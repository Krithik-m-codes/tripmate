import {
  ArrowUpRight,
  GitFork,
  Github,
  Map,
  Server,
  Sparkles,
  Star,
} from "lucide-react";
import {
  GITHUB_REPO,
  GITHUB_URL,
  LICENSE_URL,
  ROADMAP_URL,
} from "@/lib/site";

type RepoStats = {
  stars: number | null;
  forks: number | null;
  openIssues: number | null;
  license: string;
  pushedAt: string | null;
};

async function getRepoStats(): Promise<RepoStats> {
  const fallback: RepoStats = {
    stars: null,
    forks: null,
    openIssues: null,
    license: "MIT",
    pushedAt: null,
  };

  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return fallback;
    const data = await response.json();

    return {
      stars: typeof data.stargazers_count === "number" ? data.stargazers_count : null,
      forks: typeof data.forks_count === "number" ? data.forks_count : null,
      openIssues:
        typeof data.open_issues_count === "number" ? data.open_issues_count : null,
      license: data.license?.spdx_id || "MIT",
      pushedAt: typeof data.pushed_at === "string" ? data.pushed_at : null,
    };
  } catch {
    return fallback;
  }
}

const USE_CASES = [
  {
    icon: Sparkles,
    tag: "Claude Desktop",
    title: "Agent-built itinerary",
    body: "Ask for a five-day plan. The agent calls TripMate's MCP tools and returns a day-by-day itinerary instead of a paragraph.",
  },
  {
    icon: Server,
    tag: "Self-host",
    title: "Your own travel stack",
    body: "Run the web app and MCP server on your machine. Itineraries stay in your MongoDB, and the code is yours to change.",
  },
  {
    icon: Map,
    tag: "Web app",
    title: "An editable trip workspace",
    body: "Open the plan, reorder activities, save places to a map, and keep the whole trip in one place.",
  },
];

function formatDate(value: string | null) {
  if (!value) return "Unavailable";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}

export async function Proof() {
  const stats = await getRepoStats();

  return (
    <section id="proof" className="border-b border-[var(--border-primary)] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
            Proof
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Proof, not press logos.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
            TripMate is public, MIT-licensed, and self-hostable. The repository is the
            proof: you can read every tool, run the server, and audit the claims on
            this page.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_1.95fr]">
          <div className="flex flex-col rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                  <Github className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="font-heading text-sm font-semibold text-[var(--text-primary)]">
                    {GITHUB_REPO}
                  </p>
                  <p className="font-mono text-[10px] text-[var(--text-muted)]">
                    public repository
                  </p>
                </div>
              </div>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open the TripMate GitHub repository"
                className="rounded-lg border border-[var(--border-primary)] p-2 text-[var(--text-muted)] transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-2.5">
                <dt className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wide text-[var(--text-muted)]">
                  <Star className="h-3 w-3" /> Stars
                </dt>
                <dd className="mt-1 font-heading text-xl font-bold text-[var(--text-primary)]">
                  {stats.stars ?? "—"}
                </dd>
              </div>
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-2.5">
                <dt className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wide text-[var(--text-muted)]">
                  <GitFork className="h-3 w-3" /> Forks
                </dt>
                <dd className="mt-1 font-heading text-xl font-bold text-[var(--text-primary)]">
                  {stats.forks ?? "—"}
                </dd>
              </div>
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-2.5">
                <dt className="font-mono text-[9px] uppercase tracking-wide text-[var(--text-muted)]">
                  License
                </dt>
                <dd className="mt-1 font-heading text-lg font-bold text-[var(--text-primary)]">
                  {stats.license}
                </dd>
              </div>
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-2.5">
                <dt className="font-mono text-[9px] uppercase tracking-wide text-[var(--text-muted)]">
                  Last push
                </dt>
                <dd className="mt-1 text-xs font-semibold text-[var(--text-primary)]">
                  {formatDate(stats.pushedAt)}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-col gap-2">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--text-primary)] px-3 py-2.5 text-xs font-semibold text-[var(--bg-primary)] transition-opacity hover:opacity-85"
              >
                <Github className="h-3.5 w-3.5" />
                View the source
              </a>
              <a
                href={LICENSE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border-primary)] px-3 py-2.5 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:border-emerald-500/40"
              >
                Read the MIT license
              </a>
            </div>

            <p className="mt-4 text-[10.5px] leading-relaxed text-[var(--text-muted)]">
              Star and fork counts come from the GitHub API and refresh hourly. No
              placeholder logos, no invented testimonials.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {USE_CASES.map((useCase) => (
              <div
                key={useCase.title}
                className="flex items-start gap-3.5 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <useCase.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                    {useCase.tag}
                  </p>
                  <h3 className="mt-1 font-heading text-sm font-semibold text-[var(--text-primary)]">
                    {useCase.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                    {useCase.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-5 py-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-heading text-sm font-semibold text-[var(--text-primary)]">
              Public roadmap
            </p>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
              Streaming, collaboration, and mobile work is tracked in ROADMAP.md. No
              secret backlog.
            </p>
          </div>
          <a
            href={ROADMAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-300"
          >
            Read the roadmap <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
