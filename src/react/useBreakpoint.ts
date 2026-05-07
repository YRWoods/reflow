"use client";

import { useSyncExternalStore } from "react";
import type { BreakpointKey, BreakpointMap } from "../core/breakpoints.js";
import { useFluidityContext } from "./context.js";

export interface UseBreakpointResult<B extends BreakpointMap> {
  /** Currently active breakpoint key. */
  active: BreakpointKey<B>;
  /** True if active === key. */
  is(key: BreakpointKey<B>): boolean;
  /** True if viewport is at or above the given key. */
  above(key: BreakpointKey<B>): boolean;
  /** True if viewport is strictly below the given key. */
  below(key: BreakpointKey<B>): boolean;
  /** True if viewport is between [min, max). */
  between(min: BreakpointKey<B>, max: BreakpointKey<B>): boolean;
}

export function useBreakpoint<B extends BreakpointMap>(): UseBreakpointResult<B> {
  const { store, system } = useFluidityContext();
  const snap = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const active = snap.active as BreakpointKey<B>;
  const sys = system as unknown as { breakpoints: B; keys: ReadonlyArray<BreakpointKey<B>> };

  const idx = sys.keys.indexOf(active);
  return {
    active,
    is: (k) => active === k,
    above: (k) => sys.keys.indexOf(k) <= idx,
    below: (k) => idx < sys.keys.indexOf(k),
    between: (min, max) => {
      const i = sys.keys.indexOf(min);
      const j = sys.keys.indexOf(max);
      return idx >= i && idx < j;
    },
  };
}
