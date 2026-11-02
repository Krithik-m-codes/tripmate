import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  Github,
  KeyRound,
  Mail,
  Server,
  Terminal,
} from "lucide-react";
import { CodeBlock } from "@/components/marketing/CodeBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  faqPageSchema,
  howToSchema,
  techArticleSchema,
  webPageSchema,
} from "@/lib/schema";
import type { FaqItem } from "@/lib/faq";
import { GITHUB_URL, pageMetadata } from "@/lib/site";

const PAGE_PATH = "/self-hosting" as const;

const TITLE = "Self-host TripMate";
const DESCRIPTION =
  "Run TripMate yourself on Node.js 20+ with MongoDB. MIT-licensed, no vendor lock-in, with setup steps, environment variables, auth, email, and production notes.";

export const metadata = pageMetadata({
  title: "Self-hosting",
  description: DESCRIPTION,
  path: PAGE_PATH,
  type: "article",
});

const ENV_ROWS = [
  {
    name: "MONGODB_URI",
    required: "Yes",
    purpose: "MongoDB connection string. Server-only; never prefix it with NEXT_PUBLIC_.",
  },
  {
    name: "NEXTAUTH_SECRET",
    required: "Production",
    purpose:
      "Secret used to sign sessions. Generate one with openssl rand -base64 32. Auth also accepts BETTER_AUTH_SECRET.",
  },
  {
    name: "BETTER_AUTH_URL",
    required: "Production",
    purpose:
      "Public origin used by auth callbacks, such as https://your-domain.com. Falls back to NEXTAUTH_URL, then NEXT_PUBLIC_APP_URL.",
  },
  {
    name: "NEXT_PUBLIC_APP_URL",
    required: "Recommended",
    purpose:
      "Public origin used by client auth and email links. Set it to the same value as BETTER_AUTH_URL.",
  },
  {
    name: "GEMINI_API_KEY",
    required: "For planning",
    purpose:
      "Google AI Studio key for AI itinerary generation. NVIDIA_API_KEY and OPENROUTER_API_KEY are optional alternatives.",
  },
  {
    name: "BREVO_API_KEY",
    required: "For email OTP",
    purpose: "Brevo key for verification email delivery. Pair it with BREVO_SENDER_EMAIL.",
  },
  {
    name: "BREVO_SENDER_EMAIL",
    required: "For email OTP",
    purpose: "Verified sender address in Brevo. Without it, sign-up cannot send a code.",
  },
  {
    name: "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN",
    required: "Optional",
    purpose:
      "Mapbox token used for Mapbox-backed directions and map features. The default open map styles need no key.",
  },
] as const;

const SELF_HOST_FAQS: FaqItem[] = [
  {
    id: "free",
    question: "Can I self-host TripMate for free?",
    answer:
      "Yes. The code is MIT licensed and runs on Node.js 20+ with MongoDB. Your only costs are the services you choose, such as MongoDB hosting, Gemini, or Brevo.",
  },
  {
    id: "requirements",
    question: "What do I need to run TripMate locally?",
    answer:
      "Node.js 20 or newer, pnpm, and a MongoDB connection string. A Gemini API key enables AI planning, and Brevo enables verification email; the app can boot without either.",
  },
  {
    id: "docker",
    question: "Is there a Docker image?",
    answer:
      "No official image is published yet. You can run the Node build directly or build your own container from the repository. The app needs Node.js at runtime and a reachable MongoDB instance.",
  },
  {
    id: "mcp",
    question: "Does self-hosting include the MCP server?",
    answer:
      "Yes. The MCP server lives in the mcp directory of the same repository. It runs separately over stdio and reads GEMINI_API_KEY plus its optional overrides from the environment your MCP client provides.",
  },
  {
    id: "update",
    question: "How do I update a self-hosted instance?",
    answer:
      "Pull the latest changes, run pnpm install, then pnpm build and restart the app. Review the release notes first in case an environment variable or dependency changed.",
  },
];

const HOW_TO_STEPS = [
  {
    name: "Clone the repository",
    text: "Run git clone https://github.com/Krithik-m-codes/tripmate.git and cd tripmate. Node.js 20 or newer and pnpm are required.",
  },
  {
    name: "Install dependencies",
    text: "Run pnpm install from the repository root. Commit the lockfile with your deployment so builds stay reproducible.",
  },
  {
    name: "Configure the environment",
    text: "Copy .env.example to .env.local and set MONGODB_URI, NEXTAUTH_SECRET, BETTER_AUTH_URL, NEXT_PUBLIC_APP_URL, and GEMINI_API_KEY.",
  },
  {
    name: "Start the app",
    text: "Run pnpm dev for local development or pnpm build then pnpm start for production. The app listens on http://localhost:3001 by default.",
  },
  {
    name: "Connect the MCP server",
    text: "Run npm install inside mcp, then add mcp/server.mjs to your MCP client with an absolute path. The MCP server is separate from the web process.",
  },
];

function SectionHeading({
  eyebrow,
  id,
  children,
}: {
  eyebrow: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-[11px] tracking-[0.18em] text-emerald-600 uppercase dark:text-emerald-400">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="font-heading mt-3 scroll-mt-24 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl"
      >
        {children}
      </h2>
    </div>
  );
}

export default function SelfHostingPage() {
  return (
    <>
      <JsonLd
        data={[
          techArticleSchema({
            path: PAGE_PATH,
            headline: TITLE,
            description: DESCRIPTION,
            dependencies: "Node.js 20 or newer, pnpm, and MongoDB",
            keywords: [
              "self-hosted trip planner",
              "TripMate self-hosting",
              "open source travel app",
              "MongoDB",
              "Next.js",
            ],
          }),
          howToSchema({
            path: PAGE_PATH,
            name: "How to self-host TripMate",
            description:
              "Clone, configure, and run the TripMate web app and MCP server on your own infrastructure.",
            steps: HOW_TO_STEPS,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Self-hosting", path: PAGE_PATH },
          ]),
          faqPageSchema(SELF_HOST_FAQS, PAGE_PATH),
          webPageSchema({
            path: PAGE_PATH,
            title: TITLE,
            description: DESCRIPTION,
          }),
        ]}
      />

      <div className="bg-[var(--bg-primary)]">
        {/* Hero */}
        <section className="border-b border-[var(--border-primary)]">
          <div className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="max-w-3xl">
              <p className="font-mono text-[11px] tracking-[0.18em] text-emerald-600 uppercase dark:text-emerald-400">
                Self-hosting · MIT
              </p>
              <h1 className="font-heading mt-4 text-4xl leading-[1.08] font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-[3.4rem]">
                Run the whole stack yourself.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
                TripMate is MIT licensed and self-hostable on Node.js 20+ with MongoDB. Clone the
                repository, set the environment variables, run pnpm install and pnpm dev, then open
                http://localhost:3001.
              </p>

              <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  href="#quick-start"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-700"
                >
                  Quick start
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-emerald-500/40"
                >
                  <Github className="h-4 w-4" />
                  View the repository
                </a>
              </div>

              <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-4 border-t border-[var(--border-primary)] pt-6 sm:grid-cols-4">
                {[
                  ["Runtime", "Node 20+"],
                  ["Database", "MongoDB"],
                  ["Package manager", "pnpm"],
                  ["License", "MIT"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="font-mono text-[10px] tracking-[0.14em] text-[var(--text-muted)] uppercase">
                      {label}
                    </dt>
                    <dd className="font-heading mt-1 text-sm font-semibold text-[var(--text-primary)]">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="border-b border-[var(--border-primary)]">
          <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
            <SectionHeading eyebrow="Requirements" id="requirements">
              Three things before you start.
            </SectionHeading>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              You need Node.js 20 or newer, pnpm, and a MongoDB database. Everything else is
              optional: AI planning keys, email delivery, OAuth, and paid map styles can be added
              later.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: Terminal,
                  title: "Node.js 20+ and pnpm",
                  body: "The repository ships a pnpm lockfile. Run pnpm install from the root; the MCP server uses npm inside mcp/.",
                },
                {
                  icon: Database,
                  title: "MongoDB",
                  body: "Use MongoDB Atlas or a local mongod. The app connects with MONGODB_URI and stores data in the tripmate database.",
                },
                {
                  icon: KeyRound,
                  title: "Optional service keys",
                  body: "Gemini enables planning, Brevo enables OTP email, and Mapbox enables Mapbox-backed routes. The app still boots without them.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6"
                >
                  <item.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-heading mt-4 text-base font-semibold text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick start */}
        <section id="quick-start" className="scroll-mt-24 border-b border-[var(--border-primary)]">
          <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
            <SectionHeading eyebrow="Quick start" id="quick-start-heading">
              From clone to localhost.
            </SectionHeading>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              These five commands are enough for a local instance. Fill in the environment file
              before the last step, or the app will start without a database connection.
            </p>

            <CodeBlock label="Terminal">{`git clone https://github.com/Krithik-m-codes/tripmate.git
cd tripmate
pnpm install
cp .env.example .env.local

# Edit .env.local, then:
pnpm dev`}</CodeBlock>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
              On Windows PowerShell, use{" "}
              <code className="font-mono text-[12px]">Copy-Item .env.example .env.local</code>{" "}
              instead of <code className="font-mono text-[12px]">cp</code>. The dev server runs on
              port 3001.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                {
                  step: "01",
                  title: "Clone and install",
                  body: "Use the lockfile so your dependency tree matches the release you are running.",
                },
                {
                  step: "02",
                  title: "Create .env.local",
                  body: "Start from .env.example. At minimum, set MONGODB_URI and NEXTAUTH_SECRET.",
                },
                {
                  step: "03",
                  title: "Run pnpm dev",
                  body: "The app starts on http://localhost:3001. Create an account to test auth and the planner.",
                },
                {
                  step: "04",
                  title: "Build for production",
                  body: "Run pnpm build, then pnpm start. Set the public URL variables before the build.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex gap-4 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5"
                >
                  <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="font-heading text-sm font-semibold text-[var(--text-primary)]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Environment */}
        <section className="border-b border-[var(--border-primary)]">
          <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
            <SectionHeading eyebrow="Environment" id="environment">
              The variables that matter.
            </SectionHeading>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              Only MONGODB_URI is strictly required to boot. Set a real secret and public URL before
              exposing the app, and add the service keys for the features you want to use.
            </p>

            <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--border-primary)]">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-[var(--bg-secondary)]">
                  <tr className="font-mono text-[10px] tracking-[0.14em] text-[var(--text-muted)] uppercase">
                    <th scope="col" className="px-4 py-3 font-medium">
                      Variable
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Required
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Purpose
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-primary)] bg-[var(--bg-card)]">
                  {ENV_ROWS.map((row) => (
                    <tr key={row.name} className="align-top">
                      <th scope="row" className="px-4 py-4 font-normal whitespace-nowrap">
                        <code className="font-mono text-[12px] font-semibold text-[var(--text-primary)]">
                          {row.name}
                        </code>
                      </th>
                      <td className="px-4 py-4 text-[12px] whitespace-nowrap text-[var(--text-secondary)]">
                        {row.required}
                      </td>
                      <td className="px-4 py-4 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                        {row.purpose}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 max-w-3xl text-xs leading-relaxed text-[var(--text-muted)]">
              Additional optional variables in <code className="font-mono">.env.example</code>:
              GOOGLE_CLIENT_ID and GITHUB_CLIENT_ID (plus their secrets) for OAuth,
              DODO_PAYMENTS_API_KEY and DODO_PAYMENTS_API_URL for Pro checkout, and
              NEXT_PUBLIC_PIXABAY_API_KEY for destination imagery. Only NEXT_PUBLIC_* values are
              exposed to the browser.
            </p>
          </div>
        </section>

        {/* Database and auth */}
        <section className="border-b border-[var(--border-primary)]">
          <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
            <SectionHeading eyebrow="Database and auth" id="database">
              Two services do the heavy lifting.
            </SectionHeading>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              MongoDB stores users, itineraries, saved places, and usage counters. better-auth
              manages sessions and email OTP verification, using the secret and public URL you
              provide.
            </p>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6">
                <Database className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-heading mt-4 text-base font-semibold text-[var(--text-primary)]">
                  MongoDB
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Create a database and copy its connection string into{" "}
                  <code className="font-mono text-[12px]">MONGODB_URI</code>. The app connects to
                  the <code className="font-mono text-[12px]">tripmate</code> database name by
                  default. If you use Atlas, allow your host&rsquo;s IP address in the network
                  access list.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Mongoose creates collections on first use, so a fresh install has no general
                  migration step. The repository does include a one-off itinerary migration script
                  under <code className="font-mono text-[12px]">src/scripts</code>.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6">
                <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-heading mt-4 text-base font-semibold text-[var(--text-primary)]">
                  Auth and email
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Set a long random <code className="font-mono text-[12px]">NEXTAUTH_SECRET</code>{" "}
                  and point <code className="font-mono text-[12px]">BETTER_AUTH_URL</code> at your
                  public origin. Verification codes are sent through Brevo; if Brevo is not
                  configured, sign-up cannot deliver a code.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  In local development the generated OTP is also printed to the server console, so
                  you can finish sign-up without email.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Verify */}
        <section className="border-b border-[var(--border-primary)]">
          <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
            <SectionHeading eyebrow="Verify" id="verify">
              Check the install before you trust it.
            </SectionHeading>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              A healthy instance returns the marketing site, a sitemap, and a planner that can
              generate one itinerary. Walk through these checks in order.
            </p>

            <ul className="mt-8 max-w-2xl space-y-3">
              {[
                "Open http://localhost:3001 and confirm the homepage renders.",
                "Open /sitemap.xml and /robots.txt to confirm metadata routes work.",
                "Create an account. With Brevo configured, the code arrives by email; otherwise read it from the server console.",
                "Generate one itinerary with a Gemini key to confirm the planner and database writes work.",
                "Run the MCP smoke test in mcp/ if you also plan to use the server.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-relaxed text-[var(--text-secondary)]"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
              To run the MCP server too:
            </p>
            <CodeBlock label="Terminal">{`cd mcp
npm install
npm run smoke`}</CodeBlock>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
              Then add <code className="font-mono text-[12px]">mcp/server.mjs</code> to your client
              config. The full{" "}
              <Link
                href="/mcp-server"
                className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300"
              >
                MCP server guide
              </Link>{" "}
              has copy-paste blocks for Claude Desktop, Cursor, and Claude Code.
            </p>
          </div>
        </section>

        {/* Production */}
        <section className="border-b border-[var(--border-primary)]">
          <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
            <SectionHeading eyebrow="Production" id="production">
              Before you expose it to the internet.
            </SectionHeading>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              TripMate builds as a standard Next.js app, so any Node host works. Set production
              values for the public URL and secret, keep server keys out of the client bundle, and
              terminate TLS at your proxy or platform.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                {
                  icon: Server,
                  title: "Build and start",
                  body: "Run pnpm build, then pnpm start. The start script listens on port 3001; map it to your platform's port or put a reverse proxy in front.",
                },
                {
                  icon: KeyRound,
                  title: "Set the real origin",
                  body: "Point BETTER_AUTH_URL and NEXT_PUBLIC_APP_URL at your https domain. Auth callbacks and email links use these values.",
                },
                {
                  icon: Database,
                  title: "Protect the database",
                  body: "Keep MONGODB_URI server-side, use a dedicated database user, and restrict network access to your host.",
                },
                {
                  icon: CheckCircle2,
                  title: "Keep keys off the client",
                  body: "Only NEXT_PUBLIC_* variables reach the browser. Server keys such as GEMINI_API_KEY, BREVO_API_KEY, and MONGODB_URI stay in the server environment.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5"
                >
                  <item.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-heading mt-3 text-sm font-semibold text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-6 max-w-3xl rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 text-xs leading-relaxed text-[var(--text-secondary)]">
              There is no official Docker image yet. If you containerise the app yourself, run the
              production build in the image and provide MongoDB and the environment variables at
              runtime.
            </p>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="border-b border-[var(--border-primary)]">
          <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
            <SectionHeading eyebrow="Troubleshooting" id="troubleshooting">
              Common first-run failures.
            </SectionHeading>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              Most local setup problems trace back to a missing environment variable or a database
              that is not reachable from your machine.
            </p>

            <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--border-primary)]">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-[var(--bg-secondary)]">
                  <tr className="font-mono text-[10px] tracking-[0.14em] text-[var(--text-muted)] uppercase">
                    <th scope="col" className="px-4 py-3 font-medium">
                      Symptom
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Fix
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-primary)] bg-[var(--bg-card)]">
                  {[
                    [
                      "Missing MONGODB_URI in the logs",
                      "Add MONGODB_URI to .env.local and restart the dev server. Confirm the Atlas IP allowlist includes your machine.",
                    ],
                    [
                      "Sign-up never sends a code",
                      "Set BREVO_API_KEY and BREVO_SENDER_EMAIL, or read the generated OTP from the server console in development.",
                    ],
                    [
                      "Sessions drop after sign-in",
                      "Set a stable NEXTAUTH_SECRET and make sure BETTER_AUTH_URL matches the origin in your browser.",
                    ],
                    [
                      "The planner returns an auth or key error",
                      "Add GEMINI_API_KEY (or an alternative provider key) to the server environment and restart.",
                    ],
                    [
                      "Maps render blank",
                      "Check browser access to tiles.openfreemap.org and basemaps.cartocdn.com. The default map styles need no key; a Mapbox token only enables Mapbox-backed features.",
                    ],
                  ].map(([symptom, fix]) => (
                    <tr key={symptom} className="align-top">
                      <th
                        scope="row"
                        className="px-4 py-4 text-left text-[13px] font-medium text-[var(--text-primary)]"
                      >
                        {symptom}
                      </th>
                      <td className="px-4 py-4 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                        {fix}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 border-b border-[var(--border-primary)]">
          <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
            <SectionHeading eyebrow="FAQ" id="faq-heading">
              Self-hosting questions.
            </SectionHeading>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              What people ask before running their own instance.
            </p>

            <div className="mt-8 max-w-3xl divide-y divide-[var(--border-primary)] border-y border-[var(--border-primary)]">
              {SELF_HOST_FAQS.map((faq, index) => (
                <details key={faq.id} className="group" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                    <h3 className="font-heading text-base leading-snug font-semibold text-[var(--text-primary)]">
                      {faq.question}
                    </h3>
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--border-primary)] font-mono text-[var(--text-muted)] transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="-mt-1 max-w-2xl pr-8 pb-5 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 sm:py-16">
          <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:px-10">
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50 via-white to-white p-6 sm:p-10 dark:from-emerald-950/30 dark:via-[var(--bg-card)] dark:to-[var(--bg-card)]">
              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-xl">
                  <p className="font-mono text-[11px] tracking-[0.18em] text-emerald-700 uppercase dark:text-emerald-300">
                    Own the stack
                  </p>
                  <h2 className="font-heading mt-3 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
                    Clone it, run it, change it.
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                    MIT means you can inspect every line, swap the AI provider, and host it wherever
                    you like. Start with the repository and the MCP guide.
                  </p>
                </div>
                <div className="flex flex-col gap-2.5 sm:flex-row lg:shrink-0">
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-700"
                  >
                    <Github className="h-4 w-4" />
                    Get the source
                  </a>
                  <Link
                    href="/mcp-server"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-emerald-500/40"
                  >
                    MCP server guide
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
