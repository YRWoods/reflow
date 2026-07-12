# Migrate from @vueuse/core to reflow (Vue)

[@vueuse/core](https://github.com/vueuse/vueuse) is a common source of responsive composables in Vue 3. Reflow’s Vue adapter covers the same jobs with **SSR-safe defaults** and a shared typed breakpoint system.

Related: [comparison](./comparison.md) · [React migration](./migrate-from-react-responsive.md)

```bash
# optional: stop importing responsive helpers from VueUse
# npm uninstall @vueuse/core   # only if nothing else needs it
npm install reflow
```

Provide context once (plugin or `provideBreakpoints`) so composables share one store — see `reflow/vue` exports (`createFluidityPlugin` / `provideBreakpoints`).

## `useMediaQuery`

**VueUse:**

```ts
import { useMediaQuery } from "@vueuse/core";

const isLarge = useMediaQuery("(min-width: 1024px)");
```

**Reflow:**

```ts
import { useMediaQuery } from "reflow/vue";

// Ref<boolean>; second arg is SSR/default before mount
const isLarge = useMediaQuery("(min-width: 1024px)", false);
```

## `useWindowSize` → `useViewport`

**VueUse:**

```ts
import { useWindowSize } from "@vueuse/core";

const { width, height } = useWindowSize();
```

**Reflow:**

```ts
import { useViewport } from "reflow/vue";

const { width, height, orientation } = useViewport();
// width/height/orientation are Refs
```

## `useBreakpoints` → `useBreakpoint`

**VueUse:**

```ts
import { useBreakpoints } from "@vueuse/core";

const breakpoints = useBreakpoints({
  md: 768,
  lg: 1024,
});
const mdAndUp = breakpoints.greaterOrEqual("md");
```

**Reflow:**

```ts
import { useBreakpoint } from "reflow/vue";

const bp = useBreakpoint();
// bp.active — current key
// bp.above("md") / bp.below("md") / bp.is("md") / bp.between("md", "lg")
const mdAndUp = computed(() => bp.above("md"));
```

Wire defaults/overrides via `provideBreakpoints` / plugin so keys match your design tokens.

## `usePreferredColorScheme` → `useColorScheme`

**VueUse:**

```ts
import { usePreferredColorScheme } from "@vueuse/core";

const preferred = usePreferredColorScheme(); // 'dark' | 'light' | 'no-preference'
```

**Reflow:**

```ts
import { useColorScheme } from "reflow/vue";

const { colorScheme, isDark } = useColorScheme({
  serverDefault: "light",
  // optional storageKey for user override persistence
});
```

## SSR

VueUse often needs careful `ssrWidth` / mount timing for media queries. Reflow composables are built around a shared store and server defaults so first paint can match the server when you set them.

Prefer:

1. App-level provider/plugin with a known server width  
2. Explicit `serverDefault` on hooks that accept it (`useMediaQuery`, `useColorScheme`, …)

## What you gain

- One toolkit for breakpoints, viewport, media, color scheme, container queries  
- Same concepts on React/Svelte/etc. if you leave Vue later  
- Feature/size matrix: [comparison.md](./comparison.md)
