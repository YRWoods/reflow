import { readable } from "svelte/store";
import { getDevicePixelRatio, observeDevicePixelRatio } from "../core/dpr.js";

/**
 * Reactive device pixel ratio store. SSR-safe.
 */
export function devicePixelRatio(serverDefault = 1) {
  return readable(serverDefault, (set) => {
    if (typeof window === "undefined") return;
    set(getDevicePixelRatio());
    return observeDevicePixelRatio(() => set(getDevicePixelRatio()));
  });
}
