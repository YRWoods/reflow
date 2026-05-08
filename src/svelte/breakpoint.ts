import { derived, readable } from "svelte/store";
import type { BreakpointKey, BreakpointMap, BreakpointSystem } from "../core/breakpoints.js";
import { createBreakpoints, defaultBreakpoints } from "../core/breakpoints.js";
import { createFluidityStore } from "../core/store.js";

export interface BreakpointState<B extends BreakpointMap> {
  active: BreakpointKey<B>;
}

/**
 * SSR-safe breakpoint store for Svelte.
 *
 * @example
 * ```svelte
 * <script>
 *   import { breakpoint } from 'fluidity-ts/svelte';
 *   import { createBreakpoints } from 'fluidity-ts';
 *
 *   const bp = breakpoint(createBreakpoints({ mobile: 0, tablet: 768, desktop: 1024 }));
 * </script>
 * <p>Active: {$bp.active}</p>
 * ```
 */
export function breakpoint<B extends BreakpointMap>(system?: BreakpointSystem<B>) {
  const sys = (system ?? createBreakpoints(defaultBreakpoints)) as BreakpointSystem<B>;
  const store = createFluidityStore(sys);

  const active = readable<BreakpointKey<B>>(store.getSnapshot().active, (set) => {
    if (typeof window === "undefined") return;
    set(store.getSnapshot().active);
    return store.subscribe(() => set(store.getSnapshot().active));
  });

  const state = derived(active, ($active) => ({ active: $active }));
  const keys = sys.keys;

  return {
    subscribe: state.subscribe,
    /** Derived store: true if active === key */
    is: (key: BreakpointKey<B>) => derived(active, ($a) => $a === key),
    /** Derived store: true if at or above key */
    above: (key: BreakpointKey<B>) =>
      derived(active, ($a) => keys.indexOf($a) >= keys.indexOf(key)),
    /** Derived store: true if strictly below key */
    below: (key: BreakpointKey<B>) => derived(active, ($a) => keys.indexOf($a) < keys.indexOf(key)),
    /** Derived store: true if between [min, max) */
    between: (min: BreakpointKey<B>, max: BreakpointKey<B>) =>
      derived(active, ($a) => {
        const idx = keys.indexOf($a);
        return idx >= keys.indexOf(min) && idx < keys.indexOf(max);
      }),
  };
}
