import { readable } from "svelte/store";
import { type SafeAreaInsets, getSafeArea, observeSafeArea } from "../core/safe-area.js";

const ZERO: SafeAreaInsets = { top: 0, right: 0, bottom: 0, left: 0 };

/**
 * Reactive safe area insets store. SSR-safe.
 */
export function safeArea(serverDefault: SafeAreaInsets = ZERO) {
  return readable<SafeAreaInsets>(serverDefault, (set) => {
    if (typeof window === "undefined") return;
    set(getSafeArea());
    return observeSafeArea(() => set(getSafeArea()));
  });
}
