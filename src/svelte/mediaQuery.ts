import { readable } from "svelte/store";
import { watchMedia } from "../core/media.js";

/**
 * SSR-safe reactive media query store.
 *
 * @example
 * ```svelte
 * <script>
 *   import { mediaQuery } from 'fluidity-ts/svelte';
 *   const isMobile = mediaQuery('(max-width: 768px)');
 * </script>
 * <p>{$isMobile ? 'Mobile' : 'Desktop'}</p>
 * ```
 */
export function mediaQuery(query: string, serverDefault = false) {
  return readable(serverDefault, (set) => {
    if (typeof window === "undefined") return;
    const watcher = watchMedia(query);
    set(watcher.matches());
    return watcher.subscribe(() => set(watcher.matches()));
  });
}
