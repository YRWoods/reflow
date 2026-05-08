import { readable } from "svelte/store";
import { createBreakpoints, defaultBreakpoints } from "../core/breakpoints.js";
import { createFluidityStore } from "../core/store.js";

export interface ViewportState {
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
}

/**
 * Reactive viewport store. SSR-safe.
 */
export function viewport() {
  const sys = createBreakpoints(defaultBreakpoints);
  const store = createFluidityStore(sys);
  const snap = store.getSnapshot();

  return readable<ViewportState>(
    { width: snap.width, height: snap.height, orientation: snap.orientation },
    (set) => {
      if (typeof window === "undefined") return;
      const current = store.getSnapshot();
      set({ width: current.width, height: current.height, orientation: current.orientation });
      return store.subscribe(() => {
        const next = store.getSnapshot();
        set({ width: next.width, height: next.height, orientation: next.orientation });
      });
    },
  );
}
