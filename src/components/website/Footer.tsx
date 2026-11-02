import Image from "next/image";
import Link from "next/link";
import { Github } from "lucide-react";
import { FOOTER_LINKS, GITHUB_URL, LICENSE_URL } from "@/lib/site";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string; external?: boolean }>;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-[var(--text-secondary)] transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-[13px] text-[var(--text-secondary)] transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-primary)]">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
              <Image
                src="/tripmate-logo.png"
                alt=""
                width={32}
                height={32}
                className="rounded-full ring-1 ring-emerald-500/30"
              />
              <span className="font-heading text-lg font-extrabold tracking-tight text-[var(--text-primary)]">
                TripMate
              </span>
            </Link>
            <p className="mt-4 text-[13px] leading-relaxed text-[var(--text-secondary)]">
              Open-source, MCP-native trip planning for AI agents and the people who
              use them.
            </p>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              <Github className="h-4 w-4" />
              Krithik-m-codes/tripmate
            </a>
          </div>

          <FooterColumn title="Product" links={FOOTER_LINKS.product} />
          <FooterColumn title="Developers" links={FOOTER_LINKS.developers} />
          <FooterColumn title="Company" links={FOOTER_LINKS.company} />
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-[var(--border-primary)] pt-6 sm:flex-row sm:items-center">
          <p className="text-[11px] text-[var(--text-muted)]">
            © {new Date().getFullYear()} TripMate contributors. Source available
            under the{" "}
            <a
              href={LICENSE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
            >
              MIT license
            </a>
            .
          </p>
          <p className="text-[11px] text-[var(--text-muted)]">
            Built by{" "}
            <a
              href="https://github.com/Krithik-m-codes"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
            >
              Krithik M
            </a>
            . Costs shown in the app are planning estimates, not live quotes.
          </p>
        </div>
      </div>
    </footer>
  );
}
