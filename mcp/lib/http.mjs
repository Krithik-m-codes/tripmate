const DEFAULT_TIMEOUT_MS = 25_000;
const USER_AGENT =
  process.env.TRIPMATE_USER_AGENT ||
  "tripmate-mcp/0.1 (+https://github.com/Krithik-m-codes/tripmate)";

/**
 * Fetch JSON with a timeout and a descriptive error.
 * Keeps every outbound call in this package honest about what failed.
 */
export async function fetchJson(url, options = {}) {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...init } = options;

  let response;
  try {
    response = await fetch(url, {
      ...init,
      headers: {
        Accept: "application/json",
        "User-Agent": USER_AGENT,
        ...(init.headers || {}),
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Request failed for ${new URL(url).host}: ${reason}`);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const detail = body ? ` — ${body.slice(0, 300)}` : "";
    throw new Error(`HTTP ${response.status} from ${new URL(url).host}${detail}`);
  }

  return response.json();
}

/**
 * Nominatim asks clients to stay under one request per second.
 * Serialise calls so parallel tool calls cannot burst the public endpoint.
 */
let lastNominatimCall = 0;
let nominatimQueue = Promise.resolve();
export function nominatimThrottle() {
  nominatimQueue = nominatimQueue.then(async () => {
    const wait = 1_100 - (Date.now() - lastNominatimCall);
    if (wait > 0) {
      await new Promise((resolve) => setTimeout(resolve, wait));
    }
    lastNominatimCall = Date.now();
  });
  return nominatimQueue;
}
