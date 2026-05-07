"use client";

import { useSyncExternalStore } from "react";
import type { BreakpointMap } from "../core/breakpoints.js";
import { type ResponsiveValue, resolveResponsive } from "../core/responsive-value.js";
import { useFluidityContext } from "./context.js";

/**
 * Resolve a responsive value (`T | Partial<Record<BreakpointKey, T>>`) to
 * the value matching the current breakpoint, with mobile-first fallback.
 */
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
