"use client";

import { useSyncExternalStore } from "preact/hooks";
import type { BreakpointMap } from "../core/breakpoints.js";
import { type ResponsiveValue, resolveResponsive } from "../core/responsive-value.js";
import { useFluidityContext } from "./context.js";

export function useResponsiveValue<T, B extends BreakpointMap>(
  value: ResponsiveValue<T, B>,
): T | undefined {
  const { store, system } = useFluidityContext();
  const snap = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return resolveResponsive(
    system as unknown as Parameters<typeof resolveResponsive<T, B>>[0],
    value,
    snap.width,
  );
}
