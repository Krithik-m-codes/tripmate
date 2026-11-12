import Image from "next/image";
import Link from "next/link";
import { Github, Menu } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { GITHUB_URL, NAV_LINKS } from "@/lib/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 px-5 py-3.5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80"
          aria-label="TripMate home"
        >
          <Image
            src="/tripmate-logo.png"
            alt=""
            width={32}
            height={32}
            className="rounded-full ring-1 ring-emerald-500/30"
            priority
          />
          <span className="font-heading text-lg font-extrabold tracking-tight text-[var(--text-primary)]">
            TripMate
          </span>
          <span className="hidden rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-700 sm:inline dark:text-emerald-300">
            MIT
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link
            href="/sign-in"
            className="rounded-lg px-3 py-2 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)]"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg bg-emerald-600 px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Start free
          </Link>
        </div>

        <details className="group relative md:hidden">
          <summary
            aria-label="Open menu"
            className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg border border-[var(--border-primary)] text-[var(--text-secondary)] [&::-webkit-details-marker]:hidden"
          >
            <Menu className="h-4 w-4" />
          </summary>
          <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-2 shadow-xl">
            <nav aria-label="Mobile" className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
              >
                <Github className="h-4 w-4" /> GitHub
              </a>
              <div className="my-2 h-px bg-[var(--border-primary)]" />
              <Link
                href="/sign-in"
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="mt-1 rounded-lg bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white"
              >
                Start free
              </Link>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
