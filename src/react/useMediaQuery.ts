"use client";

import { useCallback, useSyncExternalStore } from "react";
import { watchMedia } from "../core/media.js";

/**
 * SSR-safe `matchMedia` hook.
 *
 * Pass `serverDefault` to control what the server (and the first client
 * render before hydration) sees — this lets you avoid hydration mismatches
 * when you know the answer at SSR time (e.g., from Client Hints).
 */
export function useMediaQuery(query: string, serverDefault = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => watchMedia(query).subscribe(onChange),
    [query],
  );
  const getSnapshot = useCallback(() => watchMedia(query).matches(), [query]);
  const getServerSnapshot = useCallback(() => serverDefault, [serverDefault]);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
