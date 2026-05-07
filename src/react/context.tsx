"use client";

import { type ReactNode, createContext, useContext, useMemo, useRef } from "react";
import {
  type BreakpointMap,
  type BreakpointSystem,
  type DefaultBreakpoints,
  createBreakpoints,
  defaultBreakpoints,
} from "../core/breakpoints.js";
import { type FluidityStore, createFluidityStore } from "../core/store.js";

interface FluidityContextValue {
  // Store typed against any breakpoint map. Hooks use the user's own
  // BreakpointSystem to narrow on consumption.
  store: FluidityStore<BreakpointMap>;
  system: BreakpointSystem<BreakpointMap>;
}

const FluidityContext = createContext<FluidityContextValue | null>(null);

export interface ResponsiveProviderProps<B extends BreakpointMap = DefaultBreakpoints> {
  /** Custom breakpoint system. Defaults to {@link defaultBreakpoints}. */
  system?: BreakpointSystem<B>;
  /** Server-rendered viewport width (e.g., from Sec-CH-Viewport-Width). */
  serverWidth?: number;
  /** Server-rendered viewport height. */
  serverHeight?: number;
  children: ReactNode;
}

/**
 * Provides a single fluidity store to the entire React tree. Pass
 * `serverWidth` from your SSR handler (using Client Hints or a UA-derived
 * guess) to eliminate hydration mismatches.
 */
export function ResponsiveProvider<B extends BreakpointMap = DefaultBreakpoints>({
  system,
  serverWidth,
  serverHeight,
  children,
}: ResponsiveProviderProps<B>) {
  const storeRef = useRef<FluidityContextValue | null>(null);

  if (!storeRef.current) {
    const sys = (system ??
      createBreakpoints(defaultBreakpoints)) as unknown as BreakpointSystem<BreakpointMap>;
    const store = createFluidityStore(sys, {
      initialWidth: serverWidth,
      initialHeight: serverHeight,
    });
    if (serverWidth !== undefined || serverHeight !== undefined) {
      store.setServerSnapshot({
        width: serverWidth ?? 1024,
        height: serverHeight ?? 768,
      });
    }
    storeRef.current = { store, system: sys };
  }

  const value = useMemo(() => storeRef.current!, []);
  return <FluidityContext.Provider value={value}>{children}</FluidityContext.Provider>;
}

/**
 * Lazily creates an ambient store on first access if no
 * <ResponsiveProvider> is mounted. This keeps casual users from being
 * forced to wrap their tree.
 */
let ambientStore: FluidityContextValue | null = null;

export function useFluidityContext(): FluidityContextValue {
  const ctx = useContext(FluidityContext);
  if (ctx) return ctx;
  if (!ambientStore) {
    const sys = createBreakpoints(defaultBreakpoints) as unknown as BreakpointSystem<BreakpointMap>;
    ambientStore = { store: createFluidityStore(sys), system: sys };
  }
  return ambientStore;
}
