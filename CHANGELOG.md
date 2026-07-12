# Changelog

## Unreleased

- Added `useResponsiveValue` for Solid
- Added `useDynamicViewport` for Solid
- Solid adapter upgraded from core-only to core + responsive hooks
- CONTRIBUTING.md expanded with AI agent contribution guide
- Issue and PR templates added
- Docs site deployed at valtors.github.io/reflow
- Landing page rebranded and cleaned up

## v1.3.0 (2026-07-11)

## What is this

First GitHub release of Reflow, the SSR-safe responsive toolkit for TypeScript.

## Highlights

- 8 framework adapters: React, Vue, Svelte, Solid, Qwik, Preact, Angular, Lit
- Zero runtime dependencies, ~2.4 KB core gzipped
- SSR-safe by default with useSyncExternalStore
- Container queries, fluid typography, viewport tracking, user preferences
- Tailwind preset and test utilities
- CI with typecheck, lint, test, build, publint, attw, size-limit

## New in this release

- useElementSize hook for ResizeObserver-based element dimension tracking
- Fixed CI (removed debug test importing missing dependency)


