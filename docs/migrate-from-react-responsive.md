# Migrate from react-responsive to reflow

[react-responsive](https://github.com/contra/react-responsive) is a popular React media-query helper. Reflow covers the same ground with **SSR-safe defaults**, typed breakpoints, and a multi-framework core.

Related: [reflow vs other libraries](./comparison.md).

```bash
npm uninstall react-responsive
npm install reflow
```

## `useMediaQuery`

**Before (react-responsive):**

```tsx
import { useMediaQuery } from "react-responsive";

function Example() {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  return isDesktop ? <DesktopNav /> : <MobileNav />;
}
```

**After (reflow):**

```tsx
import { useMediaQuery } from "reflow/react";

function Example() {
  // CSS media string; serverDefault avoids hydration flash
  const isDesktop = useMediaQuery("(min-width: 992px)", false);
  return isDesktop ? <DesktopNav /> : <MobileNav />;
}
```

Prefer named breakpoints when you can:

```tsx
import { useBreakpoint, ResponsiveProvider } from "reflow/react";

function Example() {
  const bp = useBreakpoint();
  return bp.above("lg") ? <DesktopNav /> : <MobileNav />;
}

export default function App() {
  return (
    <ResponsiveProvider serverWidth={1024}>
      <Example />
    </ResponsiveProvider>
  );
}
```

## `<MediaQuery>` → `<Show>`

**Before:**

```tsx
import { MediaQuery } from "react-responsive";

function Layout() {
  return (
    <MediaQuery minWidth={768}>
      <Sidebar />
    </MediaQuery>
  );
}
```

**After:**

```tsx
import { Show } from "reflow/react";

function Layout() {
  return (
    <Show above="md">
      <Sidebar />
    </Show>
  );
}
```

`Show` also supports `below`, `on` (exact), `between`, and `fallback`.

## Breakpoints

react-responsive often uses ad-hoc pixel objects. Reflow uses a **typed map** shared across hooks (defaults align with common Tailwind-style steps; override via provider / config in your app).

| Intent | react-responsive | reflow |
|--------|------------------|--------|
| At least `md` | `{ minWidth: 768 }` | `bp.above("md")` or `useMediaQuery("(min-width: 768px)")` |
| Below `md` | `{ maxWidth: 767 }` | `bp.below("md")` |
| Exact band | compose queries | `bp.is("md")` or `bp.between("md", "lg")` |

## SSR

react-responsive can hydrate with a different result than the server unless you add extra context/workarounds.

Reflow pattern:

1. Wrap the tree in `ResponsiveProvider` with a `serverWidth` (or equivalent server default).
2. Use `useMediaQuery(query, serverDefault)` when you still need raw media strings.

```tsx
import { ResponsiveProvider, useMediaQuery } from "reflow/react";

function Banner() {
  const wide = useMediaQuery("(min-width: 1024px)", true); // assume wide on server
  return wide ? <WideHero /> : <CompactHero />;
}

export default function Root() {
  return (
    <ResponsiveProvider serverWidth={1280}>
      <Banner />
    </ResponsiveProvider>
  );
}
```

## Why switch (short)

- **SSR-safe by default** (see [comparison](./comparison.md))
- **Zero runtime dependencies**; multi-framework adapters if you leave React later
- Breakpoints, container queries, fluid type, and preferences in one toolkit

Bundle numbers and feature matrix live in [comparison.md](./comparison.md) — keep this guide about **how to migrate**, not marketing tables.
