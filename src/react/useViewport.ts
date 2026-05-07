"use client";

import { useSyncExternalStore } from "react";
import { useFluidityContext } from "./context.js";

export interface ViewportState {
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
}

export function useViewport(): ViewportState {
  const { store } = useFluidityContext();
  const snap = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return {
    width: snap.width,
    height: snap.height,
    orientation: snap.orientation,
  };
}
