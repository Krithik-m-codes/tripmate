# TripMate Roadmap

**Audited commit:** `937a837` (`origin/main`, 2026-11-02) · **Scope:** the code that is actually on `main`, not any local work in progress.

TripMate today is a Next.js 14 / MongoDB / Gemini app that does three things: it generates a free-text AI itinerary, it saves places on a Mapbox map, and it shows current weather. It is not yet a trip planner. A trip is not an object anywhere in the code. This document is a candid inventory, a gap analysis against the apps users will compare it to, and a phased plan to close the gap.

Effort key: **S** = under 2 days, **M** = 2 to 5 days, **L** = 1 to 3 weeks. One developer assumed.

---

## 0. Read this first: what to know before planning

1. **`main` has serious security holes that make most of the app untrustworthy.** The verification code is returned to the browser, every user-scoped API trusts a client-supplied `userId`, the profile endpoint returns the password hash, and the AI endpoint is open to the internet. These come before any feature (section 1.3 and Phase 0).
2. **There is a second, unpushed codebase.** The local checkout at `E:\projects\tripmate` has about 79 modified or deleted files (+2,374 / -24,031 lines) that are not on any branch. It includes Next 15, React 19, Redux, Brevo email, a multi-provider AI layer and RAG, `PRD.md`, `CLAUDE.md`, an older `ROADMAP.md` (dated 2026-05-29), a PWA manifest, `sw.js`, and a `src/__tests__/` folder. Its `package.json` lists `better-auth` and no `next-auth`, while its own `CLAUDE.md`/`PRD.md` still describe NextAuth. Several items in that older roadmap, such as "OTP never sent to client", are marked done but **are not true on `main`**. Phase 0 starts with deciding what to do with that work (item 0.1).
3. **Why `next-auth/react` fails to resolve locally:** see section 1.4. Short version, it is dependency drift between two checkouts, plus a lockfile that does not match `package.json`.

---

## 1. Current state

### 1.1 What exists (and works, to varying degrees)

| Area | Where | State |
|---|---|---|
| Landing and marketing pages | `src/app/page.tsx`, `about/`, `services/`, `request-feature/`, `src/components/website/*` | Static content. The "request a feature" form's submit path is not wired to any backend (`RequestFeature.tsx`). |
| Sign-up / verify / sign-in | `src/app/(auth)/sign-up`, `verify-email`, `sign-in`; `src/app/api/sign-up`, `verify-code`, `sign-in`, `auth/[...nextauth]/options.ts` | Works on the happy path. Several flaws, see 1.3. |
| Forgot password | `src/app/forgot-password/page.tsx` | **Stub.** Contains `// TODO: Implement password reset logic`. |
| Dashboard | `src/app/(auth)/dashboard/page.tsx` | Browser geolocation, current weather via `/api/weather-report`, "Trending Places" from the hard-coded `src/lib/TrendingLocationData.json`. |
| Map and search | `src/app/(auth)/map/page.tsx`, `SearchBar.tsx`, `SlideInPanelRight.tsx` | Mapbox GL via `react-map-gl`, Mapbox geocoding, markers, nearby restaurants/attractions/hotels from RapidAPI travel-advisor (`src/lib/fetchTravelData.ts`). Search is logged to history. |
| Directions | `src/app/(auth)/directions/page.tsx` | Driving route between two geocoded points only (`mapbox/driving`). |
| AI itinerary | `src/app/(auth)/ai-trip-planner/page.tsx`, `src/app/api/generate-trip-itinerary/route.ts` | One Gemini call returns a plain-text blob with `*` characters stripped. Saved as a string. |
| Saved itineraries | `recent-generated-itineraries/page.tsx`, `api/itinerary/*` | List and view. No edit, delete, share, export. |
| Saved places | `saved-places/page.tsx`, `api/saved-places/*`, `FavoritePlaceCard.tsx` | Save and list. **No delete or edit endpoint.** Photos from Pixabay. |
| Search history | `recents-history/page.tsx`, `api/search-history/*` | Append and list only. |
| Profile | `profile/page.tsx`, `api/profile` | Read only: `api/profile/route.ts` exports a `GET` handler and nothing else, so there is no server-side profile update. |
| Feedback widget | `src/app/layout.tsx` | Optional Pinwren script, only if `NEXT_PUBLIC_PINWREN_KEY` is set. Fine. |

Data model (`src/models/`): `User`, `SavedItinerary` (`itinerary: string`, `days: Object`, `activities: string[]`, `budget`, `travelStyle`, `destination`), `SavedPlace` (`name`, `location` as a free string, `description`), `SearchHistory`. Collections are named `userRecentItinerary`, `userSavedPlaces`, `userRecentSearch`. `User` stores arrays of ObjectIds that duplicate the `userId` back-reference on each child document.

### 1.2 Stubbed, missing or broken

- **No Trip entity.** Nothing groups dates, destination, places, itinerary days, bookings or people. This is the biggest structural gap and blocks nearly every roadmap feature.
- **AI output is unstructured text.** `generate-trip-itinerary/route.ts` asks Gemini for a prose format, then `.replace(/\*/g, "")`. It cannot be mapped, re-ordered, costed, exported or edited. The prompt is about 60 lines of prose with the user's `preferences`, `budget` and `travelStyle` interpolated straight in.
- **Model `gemini-pro` is hard-coded** and the SDK is `@google/generative-ai ^0.16.1`. That model name and SDK are legacy. Confirm current model names and the supported SDK before building on this (item 0.9).
- **Season logic is wrong outside the northern-hemisphere monsoon belt.** `getSeason()` labels June to September "monsoon season" for every destination. The prompt feeds that to the model for any place on Earth.
- **No delete or update anywhere.** Saved places, itineraries and history are write-once.
- **Forgot-password is a stub. Profile update has no handler.** No resend-code endpoint exists, although `middleware.ts` lists `/api/resend-verify-code` and `/api/check-username-unique`, neither of which exists.
- **Directions** supports driving only, two points, no waypoints, no saving of routes.
- **No pagination or limits** on any list endpoint.
- **No empty/loading/error states standard.** Many `catch` blocks only `console.error`.
- `README.md` is out of date: it describes a `verify/[token]` route and a project tree that do not exist, and omits the real env vars.

### 1.3 Security and correctness issues (ordered by severity)

These are verified in the code on `origin/main`.

| # | Issue | Evidence | Impact |
|---|---|---|---|
| S1 | **Verification code is returned to the client.** | `api/sign-up/route.ts` responds with `verifyCode`; `sign-up/page.tsx` then passes it to `sendVerificationEmail` | Email verification is meaningless. Anyone can verify any address, including addresses they do not own. Also, the email is sent from the browser with EmailJS. |
| S2 | **IDOR on every user-scoped endpoint.** | `api/saved-places/add`, `api/itinerary/add`, `api/search-history/add` read `userId` from the request body. `api/*/[userId]` read it from the URL (`request.url.split("/").pop()`). None call `getServerSession`. | Any caller can read or write any user's data by guessing or enumerating ObjectIds. |
| S3 | **Profile endpoint returns the whole user document.** | `api/profile/route.ts` returns `userData` with no projection | Leaks the bcrypt hash, `verifyCode` and `verifyCodeExpires` to the logged-in user (and, combined with S1, shows the pattern for the rest). |
| S4 | **AI endpoint is unauthenticated and unlimited.** | `api/generate-trip-itinerary/route.ts` has no session check, no rate limit, no input length caps | Anyone can burn the Gemini quota. User text is interpolated into the prompt (prompt injection). The error path returns `error.message` to the caller. |
| S5 | **Route protection does not work.** | `middleware.ts` has `export { default } from "next-auth/middleware"` **and** a named `middleware` function. Its `matcher` covers only `/sign-in`, `/sign-up`, `/`, `/verify/:path*`, `/dashboard/:path*`, so `/map`, `/saved-places`, `/api/*` are never run through it. The in-function checks use exact string equality with `[userId]` literals, which never match. | Page protection is only the client-side `useSession` check in `(auth)/layout.tsx`. API protection is nil (see S2). |
| S6 | **No brute-force protection on verification.** | `api/verify-code/route.ts`: 6-digit code, no attempt counter, no rate limit. It also logs `username` and `code`. | Code can be guessed. Codes land in logs. |
| S7 | **Verification expiry bugs.** | `sign-in/route.ts` sets `verifyCodeExpires = new Date()` (already expired). `sign-up/route.ts` uses 7 days for re-registration but 1 hour for new users. `sign-in/route.ts` calls `@emailjs/browser` from a server route, which is a browser SDK. | Resent codes cannot work. Inconsistent policy. |
| S8 | **Secrets named or handled like public values.** | `NEXT_PUBLIC_MONGODB_URI` (`lib/dbConnect.ts`), `NEXT_PUBLIC_GEMINI_API_KEY` (`generate-trip-itinerary/route.ts`), `NEXT_PUBLIC_WEATHER_API_KEY`, `NEXT_PUBLIC_RAPIDAPI_API_KEY`, `NEXT_PUBLIC_LOCATIONIQ_API_KEY`, `NEXT_PUBLIC_PIXABAY_API_KEY`. `next.config.mjs` has an `env: { NEXTAUTH_SECRET, NEXTAUTH_URL }` block that inlines the secret at build time. | The `NEXT_PUBLIC_` prefix means "ship to the browser if it is imported there". **The RapidAPI key is definitely in the client bundle**: `fetchTravelData.ts` is imported by the client component `SlideInPanelRight.tsx`, and the same is true for LocationIQ and Pixabay. The Mongo URI and Gemini key are only safe because their files happen to be server-only; one wrong import away from leaking. Rotate all of these (see 0.2). |
| S9 | **Authorize logic is loose.** | `auth/[...nextauth]/options.ts` queries `$or: [{email}, {username: credentials?.username}]`, and `username` is not in the form, so it is `undefined`. The catch block replaces every error with one generic message, so the UI cannot tell "not verified" from "wrong password". | Unclear behaviour in Mongoose with `undefined`; user-facing errors are useless. |
| S10 | **Weak input validation.** | Zod schemas exist in `src/schemas/` but **no API route imports them**; routes destructure `request.json()` directly. `username` is not `unique` in `User.model.ts`, and `sign-up` only checks it among verified users. `weather-report` does `Number(null)` (= 0) for missing coordinates. | Duplicate usernames, junk data, NaN/0,0 requests. |
| S11 | **Operational noise and leakage.** | 38 `console.log` calls in `src/`, including middleware logging every path, `fetchTravelData` logging full API payloads, `verify-code` logging codes. | PII/secrets in logs. |
| S12 | **`dbConnect` is fragile.** | Caches `readyState` (a number) not the promise; swallows connection errors and carries on. | Concurrent cold-start requests open multiple connections; failures surface later as confusing errors. |
| S13 | **No security headers, no CSRF consideration for custom POST routes, no rate limiting anywhere.** | `next.config.mjs` | Add as part of Phase 0. |
| S14 | **Image allow-list includes a dead host.** | `next.config.mjs` has `source.unsplash.com` (retired). Large unoptimised PNG/JPGs in `public/` (several over 600 KB, hero-img.png about 5 MB). | Slow first load. |

### 1.4 Install and deploy problems

**Why `next-auth/react` failed to resolve in a local install.** On `origin/main`, `next-auth ^4.24.10` **is** declared in `package.json` and present in `package-lock.json`, so `main` is not missing the dependency. The failure is environment and lockfile drift:

1. **The installed `node_modules` did not come from `main`.** The sibling checkout `E:\projects\tripmate-pinwren` (branch `feat/pinwren-widget`, source identical to `main` for this purpose) contains a `node_modules/` that is a pnpm layout (`node_modules/.pnpm/`) with **Next 15.5.18 and `better-auth`, and no `next-auth` folder**. That tree was installed from the unpushed local work-in-progress `package.json` (which dropped `next-auth` for `better-auth`), then reused. Source on `main` still does `import { useSession } from "next-auth/react"` in `context/AuthProvider.tsx`, `(auth)/layout.tsx`, `map/page.tsx`, `ai-trip-planner/page.tsx` and others, so module resolution fails.
2. **`main`'s lockfile is out of sync with `package.json`.** `package.json` pins `"next": "14.2.35"` (from the Vercel CVE-fix commit `1d73d6b`) and `next-auth ^4.24.10`, but `package-lock.json` still resolves `next 14.2.4`, `next-auth 4.24.7`, and records `"next": "^14.2.4"` at the root. `npm ci` will refuse to install with that mismatch; `npm install` silently rewrites the lock. That commit changed `package.json` without regenerating the lock.
3. **Two lockfiles and no declared package manager.** `main` ships both `package-lock.json` and `bun.lockb`; the WIP uses `pnpm-lock.yaml`. No `packageManager` field, no `engines`, no `.nvmrc`. Different machines resolve different trees.

**Fix:** pick one package manager (npm is simplest for Vercel), delete the other lockfiles, regenerate the lock from `package.json`, add `engines`/`packageManager`, add a `.env.example`, and run `npm ci` in CI so drift fails loudly (items 0.3 and 0.4). Never reuse `node_modules` between worktrees on different dependency sets.

**Vercel is on Node 20.x, which is discontinued.** There is no `vercel.json`, no `engines` and no `.nvmrc` in the repo, so the runtime is whatever the Vercel project setting says (reported as 20.x). Move the project to a currently supported LTS (22.x or newer, confirm in Vercel's supported-versions list), and pin the same major in `package.json` `engines` and CI so local, CI and production agree. `@types/node` is `^20.17.6`; bump with it. Next 14.2.x also needs an upgrade plan (item 0.10).

### 1.5 Tech debt, testing, observability

- **Zero tests, zero CI.** No test runner in `package.json`, no `.github/`, no pre-commit hooks. Scripts are just `dev`, `build`, `start`, `lint`.
- **No error tracking, structured logging or analytics.**
- **Duplicate and dead code.** `src/app/api/index.ts` (client-side helpers living under `app/api`, with a `fetchDirections` that returns a `Response` object from a non-route file and uses a different env var name from the real directions page); `multer`, `jsonwebtoken`, `cloudinary`, `pexels`, `react-email`, `react-spring`, `classnames`, `lodash` + `debounce` + `date-fns` + `dayjs` listed but unused or overlapping (verify before removing).
- **`any` in 14 places**, `@types/react-toastify` installed for a package that ships its own types.
- **Component sprawl.** Page files do data fetching, state and layout together (for example `map/page.tsx` at 190 lines with fetch, geolocation, markers and history logging). No shared API client or data-fetching layer; every page hand-rolls `fetch`.
- **Next 14.2 / React 18.** Still supported by security patches only; plan a managed upgrade rather than staying.
- **Accessibility and mobile** are unaudited. The sidebar layout is desktop-first; the map panel uses `100vh`.

---

## 2. Competitive gap analysis

Legend: **Y** = has it, **P** = partial, **-** = no. TripMate column reflects `main` as audited.

| Capability | TripMate | Wanderlog | TripIt | Layla | Mindtrip | Google Travel | Gap / note |
|---|---|---|---|---|---|---|---|
| Trip entity (dates, destination, days) | - | Y | Y | Y | Y | Y | Foundational. Everything below hangs off it. |
| Drag-and-drop itinerary builder | - | Y | P | P | Y | P | Itinerary is a text blob. |
| AI itinerary generation | P | Y | - | Y | Y | P | Works, but unstructured and not editable. |
| Maps with itinerary pins and day routes | P | Y | P | P | Y | Y | Map and itinerary are unconnected. |
| Collaborative trips / shared editing | - | Y | P | - | Y | - | No Trip, no membership model. |
| Bookings / reservations import (email forwarding) | - | P | Y (core feature) | P | P | Y (Gmail) | Needs inbound email parsing. High value, high effort. |
| Budget and expense tracking / split | - | Y | - | - | P | - | Wanderlog's differentiator. |
| Packing lists / checklists | - | Y | - | - | - | - | Easy win once Trip exists. |
| Offline access / PWA | - | Y (paid) | Y (paid) | - | - | P | |
| Weather | P (current only, for user's location) | Y | Y | P | P | Y | Need forecast for destination and trip dates. |
| Currency conversion | - | Y | P | - | - | P | |
| Sharing and export (link, PDF, calendar) | - | Y | Y | P | Y | Y | |
| Reviews, ratings, photos, opening hours | P (travel-advisor payload shown raw) | Y | - | Y | Y | Y | Needs a Places provider decision (see 4.2). |
| Saved places / lists | P (no delete/edit/list organisation) | Y | - | P | Y | Y | |
| Notifications and reminders | - | P | Y | - | - | Y | |
| Flights / hotels search and booking | - | P | - | Y | Y | Y | Out of scope until monetisation phase. |
| Native mobile app | - | Y | Y | Y | P | Y | A PWA covers most of this at lower cost. |
| Personalisation / preference memory | - | P | - | Y | Y | P | |

**Where TripMate can realistically compete:** an AI-first planner that produces a *structured, editable, mappable* plan, with lightweight collaboration and budget splitting for friend groups, and a good PWA. Do not try to match TripIt's email parsing or Google's inventory early.

---

## 3. Phased roadmap

Each phase lists work items with effort, dependencies and acceptance criteria. Items are numbered for referencing in PRs.

### Phase 0: Stabilise and fix foundations (about 2 to 3 weeks)

Goal: a repo that installs cleanly, deploys on a supported runtime, and does not leak data. No new features.

| # | Item | Effort | Depends on | Acceptance criteria |
|---|---|---|---|---|
| 0.1 | **Decide the fate of the unpushed local work.** Review the WIP in `E:\projects\tripmate` (Next 15, Brevo OTP, AI providers, PWA files, tests). Either land it in reviewable slices onto `main`, or discard it. Commit nothing from it until it is reviewed against 0.5 to 0.8. Resolve the `better-auth` vs `next-auth` question once. | M | none | A written decision in the PR. One auth library in `package.json` and in source. Local checkout is clean or on a named branch. |
| 0.2 | **Rotate and rename secrets.** Rotate MongoDB, Gemini, RapidAPI, OpenWeather, LocationIQ, Pixabay, EmailJS and `NEXTAUTH_SECRET` (all have touched `NEXT_PUBLIC_*` or a build-time `env` block). Rename to server-only names (`MONGODB_URI`, `GEMINI_API_KEY`, `RAPIDAPI_KEY`, `WEATHER_API_KEY`, `LOCATIONIQ_KEY`). Remove the `env` block in `next.config.mjs`. Keep only the Mapbox *public* token as `NEXT_PUBLIC_`, URL-restricted in the Mapbox dashboard. Add `.env.example`. | S | none | `grep -R NEXT_PUBLIC_` shows only the Mapbox token and Pinwren values. Built client bundle contains no third-party keys. Old keys revoked. |
| 0.3 | **Repair the install.** One package manager (recommend npm for Vercel parity). Delete `bun.lockb`; regenerate `package-lock.json` from `package.json`; add `engines` and `packageManager`; add `.nvmrc`. Remove unused deps after confirming with a depcheck. | S | 0.1 | Fresh clone: `npm ci && npm run build` succeeds. `import "next-auth/react"` resolves. No second lockfile in the repo. |
| 0.4 | **Move Vercel to a supported Node LTS.** Set the project Node version to the current LTS (22.x or newer), set the same in `engines`/`.nvmrc`/CI, bump `@types/node`. Preview deploy first. | S | 0.3 | Vercel build log shows the new Node major; no deprecation warning; production healthy for 48 hours. |
| 0.5 | **Fix the auth core.** Generate, store (hashed), expire and verify OTP only on the server; never return it. Send email server-side (Brevo or Resend, replacing browser EmailJS and removing `@emailjs/browser` use from `sendVerificationEmail.ts`). Add a resend endpoint with cooldown, an attempt counter and lockout on `verify-code`, uniform expiry, `unique` index on `username`, validated with the existing Zod schemas. Surface typed errors (unverified, wrong password) from `authorize`. Implement password reset. | M | 0.2 | Sign-up response contains no code. 6 wrong attempts lock the code. Reset flow works end to end. Unit tests for each branch. |
| 0.6 | **Enforce authorization server-side.** One helper `requireUser()` that calls `getServerSession` and returns `session.user._id`. Remove every `userId` from request bodies and URLs (`/api/saved-places`, `/api/itinerary`, `/api/search-history` become session-scoped). Add `DELETE`/`PATCH` where missing, with ownership checks (`{_id, userId}` filter). Fix `middleware.ts` to a single `matcher` covering app pages and `/api/*` (excluding auth and public routes) and drop the duplicate export. Project fields on `/api/profile`; add `PATCH`. | M | 0.5 | Cross-user access test returns 403/404. No endpoint returns `password`, `verifyCode`. Unauthenticated hit to `/api/*` (except public list) returns 401. |
| 0.7 | **Protect and bound the AI endpoint.** Require a session; validate input with Zod (length caps, date range max, enum for budget/style); per-user rate limit and daily quota (Upstash or Mongo TTL counter); server-side timeouts; do not return `error.message`; delimit user text in the prompt. | S | 0.6 | Anonymous call returns 401. 11th request in the window returns 429. Oversized input returns 400. |
| 0.8 | **Proxy third-party APIs through server routes.** Move `fetchTravelData`, LocationIQ suggestions and Pixabay behind `/api/places/*`, `/api/geocode`, `/api/photos` with caching (`next` fetch cache or Mongo TTL) and the validation from 0.6. | M | 0.2 | No browser request goes to rapidapi, locationiq or pixabay. Repeat searches hit the cache. |
| 0.9 | **Update the AI client.** Replace the hard-coded `gemini-pro`/legacy SDK with the currently supported SDK and model, configured by env (`GEMINI_MODEL`). Fix `getSeason()` to be hemisphere- and destination-aware or drop it (use destination climate from the model or a weather API). | S | 0.7 | Model name is configuration, not code. A southern-hemisphere test destination gets a correct season. |
| 0.10 | **Framework upgrade plan.** Upgrade Next 14.2 and React 18 to a current stable line once 0.1 to 0.8 land; run the official codemods. | M | 0.3, tests from 0.12 | Build and smoke tests green; no deprecated API warnings. |
| 0.11 | **Logging and error handling.** Remove the 38 `console.log` calls; add a small `logger` (pino) with request id; central `apiHandler` wrapper that converts exceptions to typed JSON errors; fix `dbConnect` to cache the connection promise and throw on failure. Add Sentry (or Vercel observability) for server and client. | M | none | No code, token or PII in logs. Errors appear in Sentry with route and user id. |
| 0.12 | **Tests and CI.** Add Vitest (unit, API route handlers with `mongodb-memory-server`), Playwright smoke (sign-up, verify, sign-in, generate, save place), GitHub Actions running `npm ci`, `lint`, `tsc --noEmit`, `test`, `build` on every PR. Branch protection on `main`. | M | 0.3 | CI required and green. At least the auth and authorization paths from 0.5 and 0.6 have regression tests. |
| 0.13 | **Rewrite README** to match reality: setup, env table, scripts, architecture, deploy. Add security headers (CSP, HSTS, frame, referrer) in `next.config`. Compress `public/` images (hero-img.png alone is about 5 MB), use `next/image`. | S | 0.2 | New developer can run the app from the README alone. Lighthouse performance on `/` above 80 on mobile. |

### Phase 1: Core trip-planning MVP (about 4 to 6 weeks)

Goal: the product becomes a trip planner. Introduce the Trip object and make the AI produce structured plans users can edit.

| # | Item | Effort | Depends on | Acceptance criteria |
|---|---|---|---|---|
| 1.1 | **Trip data model** (section 4.1): `Trip`, `ItineraryDay`, `ItineraryItem`, with `Place` reference. Migration script that turns each existing `SavedItinerary` into a Trip with a single read-only notes day. | M | Phase 0 | Trip CRUD API, ownership-checked, Zod-validated, tested. Existing itineraries visible as trips. |
| 1.2 | **Structured AI output.** Ask the model for JSON constrained by a schema (days, items with title, time slot, place name, category, cost estimate, notes). Validate with Zod; retry once on invalid JSON; geocode each item to coordinates (cached). Stream progress to the UI. | M | 0.7, 0.8, 1.1 | 95% of generations in a 50-prompt test set parse first time. Each item has coordinates or an explicit "unmatched" flag. |
| 1.3 | **Trip workspace UI.** `/trips`, `/trips/[id]` with day columns, add/remove/reorder items (drag and drop), edit notes and times, "regenerate this day". Optimistic updates. Replace the text blob view. | L | 1.1, 1.2 | A user can create a trip by hand, with no AI, and edit it. Reordering persists. Works at 375 px width. |
| 1.4 | **Save to trip.** From the map or place panel, "Add to trip/day" and "Save for later". Saved places gain delete, notes, tags and lists. Standardise `SavedPlace.location` to GeoJSON point plus provider id. | M | 1.1 | Place cards support add to trip, remove, edit note. 2dsphere index in place. |
| 1.5 | **Map and itinerary together.** Numbered pins per day, day filter, route polyline between consecutive items, travel-time per leg (Mapbox Directions; walking, driving, transit-approx). Fit-bounds. | M | 1.3 | Selecting a day shows its route and total time. Matches the Mapbox docs for profile choice. |
| 1.6 | **Weather for the trip.** Daily forecast for destination and trip dates (OpenWeather One Call or Open-Meteo) shown on each day; cache by place/day. | S | 1.1 | Each itinerary day shows forecast, or "too far out" gracefully. |
| 1.7 | **Share and export.** Read-only share link with revocable token (`/t/[token]`), print-friendly page, PDF export, `.ics` calendar export. | M | 1.3 | Share page is indexable-off by default, no auth, no PII. PDF and ICS open correctly. |
| 1.8 | **Packing list and checklists** per trip, with AI-suggested starter list from destination, weather and duration. | S | 1.1, 1.6 | Items can be added, checked, reordered; starter list generated in under 10 s. |
| 1.9 | **Profile and preferences.** Home currency, units, default travel style, avatar upload (Cloudinary signed uploads, size/type limits). | S | 0.6 | Profile PATCH works; avatar upload server-validated. |
| 1.10 | **UX baseline.** Loading/empty/error states, toast conventions, mobile layout and bottom navigation, keyboard and screen-reader pass on the main flows. | M | 1.3 | Axe checks pass on main pages. Lighthouse accessibility above 90. |

### Phase 2: Collaboration, richer maps and budget (about 5 to 7 weeks)

| # | Item | Effort | Depends on | Acceptance criteria |
|---|---|---|---|---|
| 2.1 | **Members and roles.** `TripMember` (owner, editor, viewer), email invite with token, accept flow, remove member. Authorization helper checks membership, not just ownership. | M | Phase 1 | Invitee sees the trip after accepting; viewer cannot write; tested. |
| 2.2 | **Live collaboration.** Start with polling plus optimistic concurrency (`version` field, 409 on conflict). Upgrade to realtime (Pusher/Ably, or SSE) for presence and live item updates. | L | 2.1 | Two browsers see each other's edits within 3 s; no silent overwrite. |
| 2.3 | **Comments and votes** on items ("propose, vote, lock in"). Activity feed. | M | 2.1 | Comment thread per item; vote counts; activity log. |
| 2.4 | **Budget and expenses.** `Expense` model (amount, currency, category, paid-by, split among). Per-trip budget vs actual, per-day totals, who-owes-whom settle-up. Currency conversion via a daily-cached rate source. | L | 2.1 | Splits balance to the cent in tests; totals update live; multi-currency display. |
| 2.5 | **Bookings and documents (manual first).** `Booking` model (flight, lodging, transport, reservation) with confirmation number, times, attachments (signed upload). Show on the timeline. Email-forward parsing deferred to Phase 4. | M | 1.1 | Add a booking, see it on the right day, attach a PDF. |
| 2.6 | **Offline / PWA.** Manifest, service worker (Workbox/Serwist), cache trip data and map tiles for chosen trips, "available offline" toggle, queued writes with conflict handling. | L | 1.3 | Airplane-mode: open trip, view itinerary and map region, add a note; syncs on reconnect. |
| 2.7 | **Richer place data.** Opening hours, rating, photos, price level, website, from the chosen Places provider (see 4.2); "open at this time?" warning on itinerary items. | M | 0.8 | Warns when an item is scheduled while closed. |
| 2.8 | **Notifications.** Email (and web push for PWA): invite, trip changes, daily-of-trip summary, pre-trip reminders. Preference centre and unsubscribe. | M | 2.1 | User can opt out per type; digest does not send duplicates. |

### Phase 3: AI and personalisation (about 4 to 6 weeks)

| # | Item | Effort | Depends on | Acceptance criteria |
|---|---|---|---|---|
| 3.1 | **Conversational planner** ("make day 2 slower", "swap the museum for food"). Tool-calling over the structured trip so the model edits items, not text. Show a diff and let the user accept. | L | 1.2, 1.3 | Edit commands change only the targeted items; every change is undoable. |
| 3.2 | **Grounded recommendations.** Retrieve real places (provider data) before generation so suggestions are real, open and nearby; drop or flag unmatched venues; geographic clustering to cut travel time. | L | 2.7 | Under 5% of items unmatched in the test set; average daily transit time reduced against the baseline. |
| 3.3 | **Preference memory.** Store tastes (pace, food, budget, past ratings, saved places) and inject into prompts; "because you liked..." explanations. | M | 1.4 | Two users with different profiles get measurably different plans; user can view and clear their data. |
| 3.4 | **Smart schedule checks.** Detect impossible days (too many items, too-long legs, closed venues, jet-lag), propose fixes. | M | 1.5, 2.7 | Warnings shown with one-click fix. |
| 3.5 | **Cost and safety controls for AI.** Token budgets, provider fallback chain, response caching for repeat prompts, prompt/response logging with redaction, evaluation set and regression run in CI. | M | 0.7, 0.12 | Cost per generation tracked on a dashboard; a prompt change that lowers eval score fails CI. |
| 3.6 | **Inspiration surfaces.** Replace the static `TrendingLocationData.json` with data-driven discovery (popular saved places across users with privacy thresholds, seasonal picks). | S | 3.3 | Trending list is generated, not hard-coded. |

### Phase 4: Monetisation and growth (ongoing)

| # | Item | Effort | Depends on | Acceptance criteria |
|---|---|---|---|---|
| 4.1 | **Plans and billing.** Free tier (limited AI generations, trips, offline), Pro (more AI, offline, export, collaboration size). Stripe Checkout and customer portal, webhook-driven entitlements. | L | Phase 2 | Entitlements enforced server-side; webhook idempotent; downgrade handled. |
| 4.2 | **Affiliate booking links** for hotels, tours, flights (Booking/GetYourGuide/Skyscanner-style programmes), disclosed. Deep-link from itinerary items. | M | 2.7 | Click tracking; disclosure shown. |
| 4.3 | **Email-forward booking import.** Inbound address per user (`trips+token@...`), parse confirmations (rules first, LLM extraction second), attach to trips. | L | 2.5 | At least the top airline and hotel formats import correctly; user confirms before saving. |
| 4.4 | **Public trip templates and SEO pages.** Published itineraries ("3 days in Lisbon") with structured data, copy-to-my-trips. | M | 1.7 | Pages indexed; copy flow works. |
| 4.5 | **Analytics and growth loops.** PostHog funnel (sign-up, first trip, first AI plan, invite sent), referral invites, onboarding checklist. | M | Phase 1 | Activation funnel visible; A/B on onboarding. |
| 4.6 | **Mobile.** Installable PWA first (2.6). Consider Capacitor wrapper or React Native only if retention data justifies it. | L | 2.6 | Store listing only after PWA retention target is met. |
| 4.7 | **i18n and localisation.** Date/number/currency formatting, translated UI for top markets. | M | none | Locale switch; no hard-coded strings in components. |
| 4.8 | **Data export and account deletion** (privacy compliance), cookie consent if tracking added. | S | 0.6 | User can download or delete all data. |

---

## 4. Architecture and data model changes

### 4.1 Suggested data model (MongoDB / Mongoose)

Replace the denormalised arrays on `User` (`searchHistory`, `savedPlaces`, `savedItineraries`) with queries by `userId`; they duplicate relationships and drift out of sync with the children.

```
User            { _id, email (unique), username (unique), name, avatarUrl, passwordHash,
                  emailVerifiedAt, prefs{homeCurrency, units, pace, diet[], style}, plan, createdAt }
EmailCode       { _id, userId, purpose, codeHash, expiresAt (TTL index), attempts }
Place           { _id, provider, providerId, name, location{type:"Point",coordinates}, address,
                  category, rating, priceLevel, hours, photos[], fetchedAt }       // 2dsphere
SavedPlace      { _id, userId, placeId, listId?, note, tags[], createdAt }
Trip            { _id, ownerId, title, destination{name,location}, startDate, endDate, currency,
                  coverUrl, status, shareToken?, version, createdAt }
TripMember      { _id, tripId, userId, role: owner|editor|viewer, invitedEmail?, inviteToken? }
ItineraryDay    { _id, tripId, date, order, notes }
ItineraryItem   { _id, tripId, dayId, order, title, type, placeId?, startTime?, endTime?,
                  costEstimate{amount,currency}, notes, source: ai|user }
Booking         { _id, tripId, type, confirmation, start, end, provider, attachments[] }
Expense         { _id, tripId, amount, currency, category, paidBy, splitAmong[], date, itemId? }
PackingItem     { _id, tripId, label, checked, assignee? }
Comment/Vote    { _id, tripId, itemId, userId, body|value }
Notification    { _id, userId, type, payload, readAt }
AiGeneration    { _id, userId, tripId?, model, promptHash, tokensIn, tokensOut, cost, status }
```

Indexes: `Trip(ownerId)`, `TripMember(userId, tripId)`, `ItineraryItem(tripId, dayId, order)`, `Place(location 2dsphere)`, TTL on `EmailCode.expiresAt`.

### 4.2 Architecture changes

- **Server layer.** Add `src/server/` with `auth.ts` (`requireUser`, `requireTripRole`), `db.ts` (cached connection), `services/*` (trip, places, ai), and thin route handlers that validate (Zod), authorise, call a service, and return typed JSON. No route should touch Mongoose and `request.json()` directly.
- **Client data layer.** One typed fetch client plus TanStack Query (or server components with server actions) instead of per-page `fetch`. Share Zod types between client and server.
- **Places provider decision (needed before 0.8 and 2.7).** `travel-advisor` on RapidAPI is a third-party wrapper that has been unreliable and unofficial for years. Evaluate Foursquare Places, Google Places (New), Geoapify, or OpenTripMap for cost, terms (caching allowed?) and coverage, then standardise on the `Place` model above so the provider can change.
- **Background work.** Use Vercel Cron or a queue (Inngest/QStash) for notifications, forecast refresh and inbound email, since serverless routes should not do long work.
- **Realtime.** Defer until 2.2; polling plus version numbers first.
- **Auth.** Keep one library (see 0.1). If staying on NextAuth v4, add the missing pieces (Google sign-in, email magic link) and put the `_id` into the JWT as now; if migrating, do it once and delete the other.
- **Config.** A single `env.ts` validating required variables at boot (Zod), so missing keys fail the build rather than a request.

### 4.3 Testing, CI and observability

- **Unit:** Zod schemas, expense-split math, AI-output parser, date/season helpers.
- **Integration:** every API route with an in-memory Mongo; explicit authorisation matrix tests (anonymous / other user / member / owner).
- **E2E (Playwright):** sign-up to verify to sign-in; create trip, generate, edit, share; offline smoke once 2.6 lands.
- **AI evals:** fixed prompt set scored for schema validity, geocodability, day-length sanity; run nightly and on prompt changes.
- **CI:** GitHub Actions on every PR: `npm ci`, lint, typecheck, test, build, `npm audit --omit=dev` (report only), Playwright on preview URL. Required checks on `main`; Dependabot or Renovate weekly.
- **Observability:** Sentry (errors, release tracking), pino JSON logs with request id and user id, Vercel Analytics or PostHog for product events, a simple uptime check on `/api/health` (DB ping), AI cost dashboard from `AiGeneration`.

---

## 5. Next two weeks

Ordered; each is a small PR.

**Week 1: stop the bleeding**
1. (0.2) Rotate every key; drop `NEXT_PUBLIC_` from all but the Mapbox token; delete the `env` block in `next.config.mjs`; add `.env.example`. *(S, do first, same day)*
2. (0.3) Fix the install: single lockfile, regenerated, `engines`, `.nvmrc`; confirm `npm ci && npm run build` on a clean clone. *(S)*
3. (0.4) Switch the Vercel project from Node 20.x to a current LTS on a preview deployment, then production. *(S)*
4. (0.5, part 1) Stop returning `verifyCode` from `/api/sign-up`; send the email server-side; remove the code logging. *(S to M)*
5. (0.6, part 1) Add `requireUser()` and apply it to the six `userId`-based routes and `/api/profile` (with field projection). *(M)*

**Week 2: guard rails**
6. (0.7) Auth, validate and rate-limit `/api/generate-trip-itinerary`; stop echoing `error.message`. *(S)*
7. (0.6, part 2) Fix `middleware.ts` matcher and remove the duplicate export; add `DELETE` for saved places and itineraries. *(S)*
8. (0.12) Add GitHub Actions (`ci.yml`: install, lint, typecheck, build) plus the first Vitest tests for the authorisation helper. *(M)*
9. (0.1) Written decision on the unpushed local work and the auth library; land or archive it. *(S, discussion)*
10. (0.9) Make the Gemini model configurable and fix `getSeason()`. *(S)*
11. Start the Phase 1 design doc for the Trip model (4.1) so Phase 1 can begin straight after.

**Definition of done for the two weeks:** a fresh clone installs and builds in CI, production runs on a supported Node, no secret is exposed to the browser, no endpoint serves another user's data, and the AI endpoint cannot be abused anonymously.

---

## 6. Risks and open questions

- **Which auth library?** The unpushed work points at `better-auth`; `main` and every doc point at NextAuth v4. Decide once (0.1).
- **Places data licensing.** Caching and display terms differ per provider; choose before building 2.7 and 3.2.
- **AI cost.** A structured, grounded, conversational planner multiplies calls per trip. Quotas (0.7) and cost tracking (3.5) are prerequisites for any free tier.
- **Scope discipline.** Booking search, email-import and native apps are each months of work. Treat them as Phase 4 options, gated on retention data, not commitments.
- **Items not verifiable from the repo:** the exact Vercel project settings (Node version, env var values) and whether any of the current keys have been abused. Check the Vercel dashboard and each provider's usage page when rotating.
