"use client";

import { useEffect } from "react";
import { Analytics, track } from "@vercel/analytics/react";

/**
 * Vercel Web Analytics plus a small delegated click tracker.
 *
 * Keeping the tracking in one listener means every GitHub and sign-up link is
 * measured without converting each server component into a client component.
 */
export function Telemetry() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      const href = anchor?.getAttribute("href");
      if (!href) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin === window.location.origin) {
        if (url.pathname === "/sign-up") {
          track("signup_click", { from: window.location.pathname });
        }
        return;
      }

      if (url.hostname === "github.com") {
        track("github_click", {
          from: window.location.pathname,
          to: url.pathname,
        });
        return;
      }

      track("outbound_click", {
        from: window.location.pathname,
        host: url.hostname,
      });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return <Analytics />;
}
