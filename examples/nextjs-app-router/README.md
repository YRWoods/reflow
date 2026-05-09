# fluidity-ts — Next.js App Router example

A minimal App Router demo showing fluidity-ts' SSR-safe breakpoint flow with Client Hints.

## What it demonstrates

- `src/middleware.ts` sends `clientHintsResponseHeaders`
- `src/app/layout.tsx` reads `headers()` and calls `resolveServerBreakpoint(...)`
- `ResponsiveProvider` receives `serverWidth` for a hydration-safe first paint
- `useBreakpoint()` drives layout decisions with `is()`, `above()`, and `below()`
- `useColorScheme()` powers a persisted light/dark toggle
- `fluidClamp()` handles fluid typography and spacing

## Run locally

```bash
cd examples/nextjs-app-router
npm install
npm run dev
```

Open http://localhost:3000.

## Notes

- This example depends on the local package via `"fluidity-ts": "file:../../"`.
- If you are working from a fresh clone, build the root package once so the local dependency has an up-to-date `dist/`.
- On the very first request the browser may not have sent viewport Client Hints yet, so `resolveServerBreakpoint()` can fall back to the User-Agent guess. Once hints are negotiated, the server receives the real viewport width on subsequent navigations.
