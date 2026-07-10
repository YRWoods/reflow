<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/brand/logo-dark.png">
  <img src="./assets/brand/logo.png" alt="reflow" width="120" height="120">
</picture>

# reflow

**SSR-safe responsive toolkit for TypeScript. One API, every framework.**

[![npm version](https://img.shields.io/npm/v/reflow?style=flat-square&color=0EA5A5)](https://www.npmjs.com/package/reflow)
[![npm downloads](https://img.shields.io/npm/dm/reflow?style=flat-square&label=downloads&color=22D3EE)](https://www.npmjs.com/package/reflow)
[![CI](https://img.shields.io/github/actions/workflow/status/valtors/reflow/ci.yml?style=flat-square&label=CI)](https://github.com/valtors/reflow/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-0F172A?style=flat-square)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square)](https://www.typescriptlang.org/)

</div>

```bash
npm install reflow
```

## What is this?

Reflow gives you breakpoints, container queries, fluid typography, viewport tracking, and user preference detection in one library. It works in React, Vue, Svelte, Solid, Qwik, Preact, Lit, Angular, and plain JS. No hydration mismatch warnings. No `typeof window` checks scattered everywhere.

One import. One type system. Zero framework lock-in.

## Quick start

### React

```tsx
import { ResponsiveProvider, useBreakpoint, useResponsiveValue, Show } from "reflow/react";
import { fluidClamp } from "reflow/styles";

function App() {
  const bp = useBreakpoint();
  const cols = useResponsiveValue({ xs: 1, md: 2, xl: 4 });

  return (
    <main style={{ fontSize: fluidClamp({ minPx: 16, maxPx: 22 }) }}>
      <p>Breakpoint: {bp.active}</p>
      <Grid columns={cols} />
      <Show above="md">
        <Sidebar />
      </Show>
      <Show below="md" fallback={<DesktopNav />}>
        <MobileMenu />
      </Show>
    </main>
  );
}

export default () => (
  <ResponsiveProvider serverWidth={1024}>
    <App />
  </ResponsiveProvider>
);
```

### Vue 3

```vue
<script setup lang="ts">
import { useBreakpoint } from "reflow/vue";
const bp = useBreakpoint();
</script>

<template>
  <FullNav v-if="bp.above('desktop')" />
  <HamburgerMenu v-else />
</template>
```

### Svelte

```svelte
<script>
  import { breakpoint } from "reflow/svelte";
  const bp = breakpoint();
</script>

{#if $bp === 'desktop'}
  <FullNav />
{:else}
  <HamburgerMenu />
{/if}
```

### Vanilla JS

```ts
import { createBreakpoints, observeViewport } from "reflow";

const bp = createBreakpoints({ sm: 640, md: 768, lg: 1024 } as const);

const unsub = observeViewport(({ width }) => {
  console.log(bp.resolve(width));
});

unsub();
```

## Framework support

| Framework | Entry point | Status |
|---|---|---|
| React | `reflow/react` | Full hooks + components |
| Vue 3 | `reflow/vue` | Composables + plugin |
| Svelte 5 | `reflow/svelte` | Stores |
| Solid | `reflow/solid` | Core functions |
| Qwik | `reflow/qwik` | Core functions |
| Preact | `reflow/preact` | React-compatible |
| Angular | `reflow/angular` | Core functions |
| Lit | `reflow/lit` | Core functions |

All adapters share the same framework-agnostic core. React, Vue, and Svelte ship dedicated entry points. Everything else uses the core directly.

## Why reflow?

Most responsive libraries do one thing. A media query hook here, a viewport hook there, a fluid type calculator somewhere else. You end up with 5 packages, overlapping logic, and hydration errors to debug.

Reflow puts it all in one place:

- **SSR-safe by default.** Every hook uses `useSyncExternalStore` with `getServerSnapshot`. Pair with `<ResponsiveProvider serverWidth={...}>` for correct first paint.
- **Typed breakpoints.** `createBreakpoints({ sm: 640, md: 768 } as const)` gives you literal-typed keys with full autocomplete.
- **Fluid typography.** `fluidClamp()` generates CSS `clamp()` at runtime. No more copy-pasting from utopia.fyi.
- **Container queries.** ResizeObserver-based, no polyfill needed. Works in any framework.
- **User preferences.** `prefers-reduced-motion`, `prefers-reduced-data`, `prefers-contrast`, `forced-colors`, `inverted-colors`. All typed, all SSR-safe.
- **Server rendering.** `resolveBreakpointFromHints(headers)` reads Client Hints with UA fallback. Works with Next.js, Hono, Express, anything.
- **Zero framework lock-in.** Core has no React dependency. Use it in Vue, Svelte, Solid, or plain JS.

## What's included

| Module | Exports |
|---|---|
| **Core** (`reflow`) | breakpoints, viewport, media queries, container queries, preferences, pointer, DPR, safe area |
| **Styles** (`reflow/styles`) | fluidClamp, fluidScale, containerQuery, responsiveStyle, safeArea, dvh/svh/lvh |
| **Server** (`reflow/server`) | resolveBreakpointFromHints, resolveBreakpointFromUA, clientHintsResponseHeaders |
| **Testing** (`reflow/testing`) | installMatchMediaMock, installResizeObserverMock, setWindowSize |
| **Tailwind** (`reflow/tailwind`) | tailwindPreset |

## SSR integration

### Next.js App Router

```tsx
import { headers } from "next/headers";
import { resolveBreakpointFromHints } from "reflow/server";
import { ResponsiveProvider } from "reflow/react";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const { width } = resolveBreakpointFromHints(h);

  return (
    <ResponsiveProvider serverWidth={width}>
      {children}
    </ResponsiveProvider>
  );
}
```

### Express / Hono / any server

```ts
import { resolveServerBreakpoint, clientHintsResponseHeaders } from "reflow/server";

app.use((req, res, next) => {
  for (const [key, value] of clientHintsResponseHeaders) {
    res.setHeader(key, value);
  }
  next();
});

app.get("/", (req, res) => {
  const { breakpoint, width } = resolveServerBreakpoint(req.headers);
});
```

## Bundle size

| Entry | Min + gzip |
|---|---|
| `reflow` (core) | ~2.4 KB |
| `reflow/react` | ~3.3 KB |
| `reflow/styles` | ~1.3 KB |
| `reflow/server` | ~0.8 KB |

Enforced in CI via [size-limit](https://github.com/ai/size-limit). Every PR that exceeds the budget fails.

## Testing

Reflow ships test utilities so your component tests don't need a real browser:

```ts
import { installMatchMediaMock, installResizeObserverMock, setWindowSize } from "reflow/testing";

const matchMedia = installMatchMediaMock();
const resizeObserver = installResizeObserverMock();

setWindowSize(768, 1024);
matchMedia.set("(prefers-color-scheme: dark)", true);
resizeObserver.resize(element, { width: 500, height: 300 });
```

## API reference

Full API docs are in the source. Each module exports typed functions with JSDoc. Here are the main ones:

<details>
<summary><strong>Core exports</strong></summary>

| Export | Description |
|---|---|
| `createBreakpoints(map)` | Create a typed breakpoint system with `resolve`, `up`, `down`, `between`, `only` |
| `defaultBreakpoints` | `{ xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 }` |
| `watchMedia(query)` | SSR-safe `matchMedia` wrapper |
| `observeViewport(listener)` | Subscribe to window resize/orientation |
| `getViewport()` | Snapshot `{ width, height, orientation }` |
| `observeContainer(el, listener)` | ResizeObserver-based container subscription |
| `getContainerSize(el)` | Sync container size snapshot |
| `matchesContainerRange(size, range)` | Check if container matches `{ minPx?, maxPx? }` |
| `observePreference(key, listener)` | Watch reduced-motion, dark mode, forced-colors, etc. |
| `getAllPreferences()` | Snapshot of all preference booleans |
| `observePointerCapabilities(listener)` | Watch hover/coarse/fine pointer changes |
| `observeDevicePixelRatio(listener)` | Watch DPR changes |
| `observeSafeArea(listener)` | Watch `env(safe-area-inset-*)` |
| `resolveResponsive(system, value, width)` | Pick value from breakpoint-keyed map |
| `createFluidityStore(system, opts)` | Shared reactive store for any framework |

</details>

<details>
<summary><strong>React exports</strong></summary>

| Export | Type | Description |
|---|---|---|
| `ResponsiveProvider` | component | Context provider with `serverWidth`, `serverHeight`, `system` |
| `useBreakpoint()` | hook | `{ active, is, above, below, between }` |
| `useMediaQuery(query)` | hook | SSR-safe matchMedia boolean |
| `useViewport()` | hook | `{ width, height, orientation }` |
| `useResponsiveValue(map)` | hook | Resolve breakpoint-keyed values |
| `usePreference(key)` | hook | reduced-motion, dark, forced-colors, etc. |
| `usePointer()` | hook | `{ hover, coarse, fine }` |
| `useDevicePixelRatio()` | hook | Current DPR |
| `useSafeArea()` | hook | `{ top, right, bottom, left }` in px |
| `useContainerQuery(ref, range)` | hook | Boolean, does container match range? |
| `useContainerSize(ref)` | hook | `{ width, height }` of container |
| `useDynamicViewport()` | hook | `{ dvh, svh, lvh }` in px |
| `Show` / `Hide` | component | Conditional render by breakpoint |
| `BreakpointBadge` | component | Dev overlay, auto-hidden in production |

</details>

<details>
<summary><strong>Styles exports</strong></summary>

| Export | Description |
|---|---|
| `fluidClamp(opts)` | Generate CSS `clamp()` for fluid sizing |
| `fluidScale(steps, opts)` | Build a named fluid type scale |
| `containerQuery(opts)` | Build `@container` rule string |
| `responsiveStyle(system, prop, values)` | Breakpoint to media-query style objects |
| `safeAreaInset(side, fallbackPx)` | CSS `env(safe-area-inset-*)` with fallback |
| `dvh` / `svh` / `lvh` | Dynamic viewport unit helpers |
| `visuallyHidden` | Screen-reader-only style object |
| `logical` | Physical to logical property name map |

</details>

## Browser support

| Browser | Minimum |
|---|---|
| Chrome / Edge | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | 16+ |

Container queries require Safari 16+, Chromium 105+, Firefox 110+. `prefers-reduced-data` is Chromium-only and gracefully returns `false` elsewhere.

## Development

```bash
git clone https://github.com/valtors/reflow && cd reflow
npm install
npm run verify   # typecheck + lint + test + build + publint + attw + size
```

## Roadmap

**Shipped:**
- Core responsive primitives (breakpoints, viewport, container, media, preferences)
- React, Vue, Svelte, Solid, Qwik, Preact, Angular, Lit adapters
- Fluid typography helpers
- Server-side rendering utilities
- Tailwind preset
- Test utilities
- CI with typecheck, lint, test, build, publint, attw, size-limit
- Throttle/debounce support on viewport and container observers

**Next:**
- Custom hook generators (define your own responsive hooks from config)
- DevTools browser extension
- More framework-specific examples and starter templates
- Migration guides from react-responsive, @vueuse/core, usehooks-ts

## Contributing

Check [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide. Look for [`good first issue`](https://github.com/valtors/reflow/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) labels to get started.

We follow the [Contributor Covenant](./CODE_OF_CONDUCT.md).

## License

[MIT](./LICENSE) (c) [Tamish Mhatre](https://github.com/tamish560)

If reflow saves you time, star the repo.
