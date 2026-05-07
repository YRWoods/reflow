# Contributing to fluidity-ts

Thanks for considering a contribution! This guide will get you productive in a few minutes.

## Quick start

```bash
git clone https://github.com/fluidiety/fluidity-ts
cd fluidity-ts
npm install
npm run verify   # typecheck + lint + test + build + publint + attw + size
```

## Project layout

```
src/
  core/      framework-agnostic primitives (no React, no DOM-only assumptions where avoidable)
  react/     React adapter — hooks + components, all SSR-safe via useSyncExternalStore
  styles/    pure-string CSS helpers (fluidClamp, containerQuery, responsiveStyle, …)
  server/    Client-Hints + UA → breakpoint resolution
  testing/   matchMedia + ResizeObserver mocks for downstream consumers
  tailwind/  Tailwind preset
test/        Vitest specs (happy-dom)
```

## Development workflow

1. **Open an issue first** for non-trivial changes so we can align on scope.
2. **Branch off `main`**: `feat/<short-slug>` or `fix/<short-slug>`.
3. **Write a test** that fails before your change. We aim for ≥90 % line coverage.
4. **Run `npm run verify`** before pushing.
5. **Add a changeset** for any user-visible change:
   ```bash
   npx changeset
   ```
   Pick `patch` for fixes, `minor` for additions, `major` for breaks. Write a one-line summary; it ends up in the changelog.
6. **Open a PR** referencing the issue. Fill in the template.

## Coding standards

- TypeScript strict mode, no `any` unless justified with a comment.
- Public API must be SSR-safe — never read `window` / `document` outside an effect or guarded helper.
- Prefer `useSyncExternalStore` for any subscription-style hook.
- Keep core/ free of React imports — it must work in Vue/Svelte/Solid.
- Bundle budgets are enforced (`size-limit`); shaving bytes is welcome.
- Format and lint with Biome: `npm run lint:fix`.

## Tests

- Run all: `npm test`
- Watch: `npm run test:watch`
- New code without tests will not be merged.

## Releasing (maintainers)

We use [Changesets](https://github.com/changesets/changesets):

1. Merge PRs that contain changesets into `main`.
2. The release workflow opens a "Version Packages" PR with bumped versions + changelog.
3. Merging that PR publishes to npm.

## Reporting bugs

Use the **Bug** issue template and include:
- A minimal reproduction (StackBlitz preferred).
- Browser + OS, React version, fluidity-ts version.
- What you expected vs. what happened.

## Code of conduct

By participating you agree to abide by the [Code of Conduct](./CODE_OF_CONDUCT.md).
