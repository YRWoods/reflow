# fluidity-ts

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/brand/logo-dark.png">
    <img src="./assets/brand/logo.png" alt="fluidity-ts" width="160" height="160">
  </picture>
</p>

<p align="center">
  <strong>The complete, SSR-safe, framework-agnostic responsive toolkit for TypeScript.</strong><br/>
  Typed breakpoints • Fluid clamp • Container queries • Modern preference media • Zero dependencies.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/fluidity-ts"><img src="https://img.shields.io/npm/v/fluidity-ts.svg?color=blue" alt="npm version"/></a>
  <a href="https://bundlephobia.com/package/fluidity-ts"><img src="https://img.shields.io/bundlephobia/minzip/fluidity-ts?label=gzip" alt="bundle size"/></a>
  <a href="https://www.npmjs.com/package/fluidity-ts"><img src="https://img.shields.io/npm/types/fluidity-ts.svg" alt="types"/></a>
  <a href="https://github.com/fluidiety/fluidity-ts/actions/workflows/ci.yml"><img src="https://github.com/fluidiety/fluidity-ts/actions/workflows/ci.yml/badge.svg" alt="CI"/></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/fluidity-ts.svg" alt="license"/></a>
</p>

```bash
npm install fluidity-ts
```

---

## Why fluidity-ts?

Building responsive UIs in 2026 means juggling 5+ libraries — a media-query hook, a window-size hook, a fluid-type calculator, a container-query polyfill, and a UA detector. Each one ships its own footguns:

| Need                                     | `react-responsive` | `react-use`  | `usehooks-ts` | `react-device-detect` | **fluidity-ts** |
| ---------------------------------------- | :----------------: | :----------: | :-----------: | :-------------------: | :-------------: |
| SSR-safe (no hydration warnings)         |         ❌         |      ⚠️      |      ❌       |          ❌           |       ✅        |
| Typed breakpoint inference               |         ❌         |      ❌      |      ❌       |          ❌           |       ✅        |
| `fluidClamp()` runtime helper            |         ❌         |      ❌      |      ❌       |          ❌           |       ✅        |
| Container queries (`useContainerQuery`)  |         ❌         |      ❌      |      ❌       |          ❌           |       ✅        |
| `prefers-reduced-data` / `forced-colors` |         ❌         |      ❌      |      ❌       |          ❌           |       ✅        |
| Client-Hints / SSR breakpoint resolver   |         ❌         |      ❌      |      ❌       |          ❌           |       ✅        |
| Framework-agnostic core                  |         ❌         |      ❌      |      ❌       |          ❌           |       ✅        |
| Maintained                               |         ⚠️         |      ⚠️      |      ✅       |   ❌ (abandoned ’23)  |       ✅        |

---

## 30-second example

```tsx
import { ResponsiveProvider, useBreakpoint, useResponsiveValue, Show } from "fluidity-ts/react";
import { fluidClamp } from "fluidity-ts/styles";

function App() {
  const bp = useBreakpoint();                              // "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  const cols = useResponsiveValue({ xs: 1, md: 2, xl: 4 });

  return (
    <main style={{ fontSize: fluidClamp({ minPx: 16, maxPx: 22, minVw: 360, maxVw: 1280 }) }}>
      <p>Active breakpoint: {bp}</p>
      <Grid columns={cols} />
      <Show on={["md", "lg", "xl", "2xl"]}>
        <Sidebar />
      </Show>
    </main>
  );
}

export default function Root() {
  return (
    <ResponsiveProvider serverWidth={1024}>
      <App />
    </ResponsiveProvider>
  );
}
```

---

## Top differentiators

1. **Truly SSR-safe.** Every hook is built on `useSyncExternalStore` with `getServerSnapshot`. Pair with `<ResponsiveProvider serverWidth={…}>` and you get the right breakpoint on the first paint — no hydration warnings, no flash.
2. **Typed breakpoint inference.** `createBreakpoints({ sm: 640, md: 768 } as const)` gives you literal-typed breakpoint keys everywhere — autocomplete in `useResponsiveValue`, `<Show>`, and `responsiveStyle`.
3. **Runtime `fluidClamp()`** — the first npm package shipping this. Replaces utopia.fyi copy-paste with a typed function (with inverted-slope guard).
4. **Server-side breakpoint resolution.** `resolveBreakpointFromHints(headers)` reads `Sec-CH-Viewport-Width` / `Sec-CH-UA-Mobile` (with UA fallback) so Next.js / Hono / Express apps render the right layout server-side.
5. **Modern preference coverage.** `prefers-reduced-motion`, `prefers-reduced-data`, `prefers-contrast`, `forced-colors`, pointer/hover, dvh/svh, safe-area, container queries — all first-class, all typed.
6. **Framework-agnostic.** Vanilla core works in Vue, Svelte, Solid, or plain JS. React adapter is opt-in via `fluidity-ts/react`.

---

## Packages / entry points

| Import                  | What you get                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `fluidity-ts`           | Vanilla core: `createBreakpoints`, `watchMedia`, `observeViewport`, `observePointer`, `observePreference`, `observeContainer`, `mq.*`, `resolveResponsive`, `createFluidityStore`. |
| `fluidity-ts/react`     | React hooks + components: `useBreakpoint`, `useMediaQuery`, `useViewport`, `useResponsiveValue`, `usePreference`, `usePointer`, `useDevicePixelRatio`, `useSafeArea`, `useContainerQuery`, `useDynamicViewport`, `<ResponsiveProvider>`, `<Show>`, `<BreakpointBadge>`. |
| `fluidity-ts/styles`    | CSS helpers: `fluidClamp`, `fluidScale`, `containerQuery`, `responsiveStyle`, `safeAreaInset`, `dvh/svh/lvh`, `printOnly`, `visuallyHidden`, logical-property aliases. |
| `fluidity-ts/server`    | `resolveBreakpointFromHints`, `parseUserAgent`, `clientHintsResponseHeaders`.                                             |
| `fluidity-ts/testing`   | `installMatchMediaMock`, `installResizeObserverMock`, `setWindowSize` for downstream Vitest/Jest.                         |
| `fluidity-ts/tailwind`  | `tailwindPreset({ breakpoints })` so your Tailwind config shares the same screens.                                        |

All entries are tree-shakeable (`sideEffects: false`, ESM + CJS, splitting on).

---

## SSR with Next.js App Router

```tsx
// app/layout.tsx
import { headers } from "next/headers";
import { resolveBreakpointFromHints } from "fluidity-ts/server";
import { ResponsiveProvider } from "fluidity-ts/react";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const { width } = resolveBreakpointFromHints(h);
  return (
    <html lang="en">
      <body>
        <ResponsiveProvider serverWidth={width}>{children}</ResponsiveProvider>
      </body>
    </html>
  );
}
```

```ts
// next.config.ts — opt the browser into Client Hints
export default {
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "Accept-CH", value: "Sec-CH-Viewport-Width, Sec-CH-UA-Mobile" },
        { key: "Critical-CH", value: "Sec-CH-Viewport-Width, Sec-CH-UA-Mobile" },
      ],
    }];
  },
};
```

---

## Recipes

### Fluid type without leaving TypeScript

```ts
import { fluidClamp } from "fluidity-ts/styles";

const fontSize = fluidClamp({ minPx: 16, maxPx: 22, minVw: 360, maxVw: 1280 });
// → "clamp(1rem, 0.75rem + 0.65vw, 1.375rem)"
```

### Container queries (works today, no polyfill)

```tsx
import { useRef } from "react";
import { useContainerQuery } from "fluidity-ts/react";

function Card() {
  const ref = useRef<HTMLDivElement>(null);
  const wide = useContainerQuery(ref, { minPx: 480 });
  return <div ref={ref}>{wide ? <Horizontal /> : <Stacked />}</div>;
}
```

### Respect user preferences

```tsx
import { usePreference } from "fluidity-ts/react";

const reducedMotion = usePreference("reduced-motion"); // boolean
const reducedData   = usePreference("reduced-data");   // Save-Data on
const forcedColors  = usePreference("forced-colors");  // Windows high contrast
```

### Tailwind preset (share breakpoints)

```ts
// tailwind.config.ts
import { tailwindPreset } from "fluidity-ts/tailwind";
import { defaultBreakpoints } from "fluidity-ts";

export default { presets: [tailwindPreset({ breakpoints: defaultBreakpoints })] };
```

---

## Testing your own app

```ts
// vitest.setup.ts
import { installMatchMediaMock, installResizeObserverMock } from "fluidity-ts/testing";

installMatchMediaMock();
installResizeObserverMock();
```

---

## Browser support

Chrome / Edge / Firefox / Safari ≥ 2 versions. Container queries require Safari 16+, Chromium 105+, Firefox 110+. `prefers-reduced-data` is currently Chromium-only and gracefully reports `false` elsewhere.

## Bundle size

| Entry      | Min + brotli |
| ---------- | -----------: |
| core       |     ~2.4 KB |
| react      |     ~3.3 KB |
| styles     |     ~1.3 KB |
| server     |       ~0.8 KB |

Enforced in CI via [`size-limit`](https://github.com/ai/size-limit).

---

## Contributing

PRs welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md). Look for `good first issue` to get started. We follow the [Contributor Covenant](./CODE_OF_CONDUCT.md).

## License

[MIT](./LICENSE) © Tamish Mhatre and fluidity-ts contributors.
