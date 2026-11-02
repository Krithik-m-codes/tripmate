/**
 * End-to-end smoke test: starts the MCP server over stdio, lists tools,
 * and calls the no-key tools. Run with `npm run smoke` from mcp/.
 */
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const serverPath = fileURLToPath(new URL("../server.mjs", import.meta.url));

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [serverPath],
  stderr: "inherit",
});

const client = new Client({ name: "tripmate-smoke", version: "0.1.0" });

try {
  await client.connect(transport);

  const { tools } = await client.listTools();
  const names = tools.map((tool) => tool.name).sort();
  console.log("tools:", names.join(", "));
  assert.deepEqual(names, [
    "geocode_place",
    "get_directions",
    "get_weather",
    "plan_trip",
    "search_places",
  ]);

  const geocode = await client.callTool({
    name: "geocode_place",
    arguments: { query: "Lisbon, Portugal", limit: 1 },
  });
  const places = JSON.parse(geocode.content[0].text);
  assert.equal(places.length, 1);
  assert.ok(Number.isFinite(places[0].latitude));
  console.log("geocode:", places[0].name, places[0].latitude, places[0].longitude);

  const weather = await client.callTool({
    name: "get_weather",
    arguments: {
      latitude: places[0].latitude,
      longitude: places[0].longitude,
      days: 3,
    },
  });
  const forecast = JSON.parse(weather.content[0].text);
  assert.ok(Array.isArray(forecast.days));
  console.log("weather days:", forecast.days.length, "source:", forecast.source);

  const search = await client.callTool({
    name: "search_places",
    arguments: {
      latitude: places[0].latitude,
      longitude: places[0].longitude,
      category: "attractions",
      radius_km: 3,
      limit: 3,
    },
  });
  const nearby = JSON.parse(search.content[0].text);
  assert.ok(Array.isArray(nearby) && nearby.length > 0);
  console.log("places:", nearby.map((place) => place.name).join(" | "));

  if (!process.env.GEMINI_API_KEY) {
    const plan = await client.callTool({
      name: "plan_trip",
      arguments: {
        destination: "Lisbon, Portugal",
        start_date: "2026-11-10",
        end_date: "2026-11-12",
      },
    });
    assert.equal(plan.isError, true);
    assert.match(plan.content[0].text, /GEMINI_API_KEY/);
    console.log("plan_trip without key: expected actionable error");
  }

  console.log("\nSMOKE TEST PASSED");
} finally {
  await client.close();
}
