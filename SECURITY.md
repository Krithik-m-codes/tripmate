# Security Policy

## Supported versions

TripMate is developed on `main`. Security fixes are applied to the latest
release only. There are no long-term support branches.

## Reporting a vulnerability

Please do **not** open a public issue for a security problem.

Use GitHub's private vulnerability reporting:
<https://github.com/Krithik-m-codes/tripmate/security/advisories/new>

Include:

- What you were able to do, and what you expected instead.
- Steps to reproduce, with the affected route, tool, or file.
- Any proof-of-concept request or payload.

You can expect an acknowledgement within a few days. We will confirm the
issue, agree a disclosure date, and credit you unless you ask us not to.

## Scope

In scope:

- Authentication, session handling, and OTP flow.
- User data access boundaries (cross-user reads or writes).
- The MCP server in `mcp/`, including tool argument handling.
- Injection into prompts, queries, or rendered output.
- Secret leakage into client bundles or logs.

Out of scope:

- Findings that require a compromised device or browser extension.
- Missing headers with no demonstrated impact.
- Denial of service from deliberately expensive public API calls.
- Rate limits on third-party services (Nominatim, Open-Meteo, OSRM, Gemini).

## Hardening notes

- OTP codes are generated, sent, and verified server-side and never returned in
  client responses.
- The MCP server reads API keys from the environment only. Never commit `.env`.
- Self-hosters are responsible for their own MongoDB, TLS, and key rotation.
