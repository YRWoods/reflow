import type { BreakpointKey, BreakpointMap, BreakpointSystem } from "./breakpoints.js";
import type { Preferences } from "./preferences.js";

/**
 * The shared store backing all hooks. Holds the current viewport,
 * breakpoint, preferences, pointer capabilities, etc., and notifies
 * subscribers on change. Designed for `useSyncExternalStore` (`getSnapshot`
 * returns a referentially-stable object until something actually changes).
 */
export interface FluidityStoreSnapshot<B extends BreakpointMap> {
  width: number;
  height: number;
  active: BreakpointKey<B>;
  orientation: "portrait" | "landscape";
}

export interface FluidityStore<B extends BreakpointMap> {
  readonly system: BreakpointSystem<B>;
  getSnapshot(): FluidityStoreSnapshot<B>;
  /** Server snapshot — must be referentially stable. */
  getServerSnapshot(): FluidityStoreSnapshot<B>;
  subscribe(listener: () => void): () => void;
  /** Update the server snapshot at SSR time (provider sets this). */
  setServerSnapshot(snap: Partial<FluidityStoreSnapshot<B>>): void;
}

const isBrowser = (): boolean => typeof window !== "undefined";

function buildSnapshot<B extends BreakpointMap>(
  system: BreakpointSystem<B>,
  width: number,
  height: number,
): FluidityStoreSnapshot<B> {
  return {
    width,
    height,
    active: system.resolve(width),
    orientation: height >= width ? "portrait" : "landscape",
  };
}

export function createFluidityStore<B extends BreakpointMap>(
  system: BreakpointSystem<B>,
  options: {
    initialWidth?: number;
    initialHeight?: number;
  } = {},
): FluidityStore<B> {
  const initialWidth = options.initialWidth ?? (isBrowser() ? window.innerWidth : 1024);
  const initialHeight = options.initialHeight ?? (isBrowser() ? window.innerHeight : 768);

  let snapshot: FluidityStoreSnapshot<B> = buildSnapshot(system, initialWidth, initialHeight);
  let serverSnapshot: FluidityStoreSnapshot<B> = snapshot;
  const listeners = new Set<() => void>();
  let resizeAttached = false;
  let detach: (() => void) | null = null;

  const recompute = () => {
    if (!isBrowser()) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w === snapshot.width && h === snapshot.height) return;
    snapshot = buildSnapshot(system, w, h);
    for (const l of listeners) l();
  };

  const attach = () => {
    if (resizeAttached || !isBrowser()) return;
    resizeAttached = true;
    let scheduled = false;
    const onResize = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        recompute();
      });
    };
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });
    // Initial sync (in case window resized between create() and first subscribe).
    recompute();
    detach = () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      resizeAttached = false;
    };
  };

  return {
    system,
    getSnapshot: () => snapshot,
    getServerSnapshot: () => serverSnapshot,
    setServerSnapshot(partial) {
      const merged: FluidityStoreSnapshot<B> = {
        ...serverSnapshot,
        ...partial,
      };
      // Recompute derived fields if width/height changed.
      if (partial.width !== undefined || partial.height !== undefined) {
        serverSnapshot = buildSnapshot(system, merged.width, merged.height);
      } else {
        serverSnapshot = merged;
      }
    },
    subscribe(listener) {
      listeners.add(listener);
      attach();
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          detach?.();
          detach = null;
        }
      };
    },
  };
}

export type { Preferences };
