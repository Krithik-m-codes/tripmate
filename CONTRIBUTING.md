# Contributing to TripMate

Thanks for taking a look. TripMate is MIT-licensed and contributions are
welcome, including bug reports, documentation fixes, and small focused
features.

## Before you start

- Read `ROADMAP.md` to see what is already planned.
- For anything larger than a typo, open an issue first so we can agree on the
  approach before you spend time on it.
- Do not add a dependency for something the standard library or the existing
  stack already handles.

## Local setup

Requirements: Node.js 20+, pnpm 9+, and a MongoDB connection string.

```bash
pnpm install
cp .env.example .env
pnpm dev
```

The app runs at <http://localhost:3001>. At minimum you need
`MONGODB_URI`, `BETTER_AUTH_SECRET`, and one AI provider key to generate
itineraries. The map and weather features work without paid keys.

## MCP server

The MCP server lives in `mcp/` and is a standalone package.

```bash
cd mcp
npm install
npm run check   # syntax check
npm run smoke   # end-to-end stdio test against the public APIs
```

`plan_trip` needs `GEMINI_API_KEY`; the other four tools are key-free. Keep
new tools read-only unless there is a clear reason not to, and return
actionable error messages instead of stack traces.

## Checks before opening a PR

```bash
pnpm typecheck
pnpm lint
pnpm test
```

For changes under `mcp/`, also run `npm run check && npm run smoke` there.

## Pull requests

- Keep the diff focused. One concern per PR.
- Describe the user-visible change and how you verified it.
- Update `README.md`, `ROADMAP.md`, or `mcp/README.md` when behaviour or setup
  changes.
- Do not commit secrets, `.env` files, or generated build output.

## Claim hygiene

TripMate's marketing copy names features that must actually work. If you add
a claim to the site, link it to the code or tool that implements it, or label
it as planned. No placeholder logos, invented testimonials, or unverified
pricing.

## License

By contributing, you agree that your contribution is licensed under the MIT
license in `LICENSE`.
