import { derived, readable, writable } from "svelte/store";
import type { Readable, Writable } from "svelte/store";
import { watchMedia } from "../core/media.js";

export type ColorScheme = "light" | "dark";

export interface ColorSchemeOptions {
  serverDefault?: ColorScheme;
  storageKey?: string;
}

const isBrowser = typeof window !== "undefined";

function readStorage(key?: string): ColorScheme | null {
  if (!isBrowser || !key) return null;
  try {
    const value = localStorage.getItem(key);
    if (value === "dark" || value === "light") return value;
  } catch {}
  return null;
}

function writeStorage(key?: string, value?: ColorScheme | null) {
  if (!isBrowser || !key) return;
  try {
    if (value === null || value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {}
}

/**
 * Color scheme store with optional persistence.
 *
 * @example
 * ```svelte
 * <script>
 *   import { colorScheme } from 'fluidity-ts/svelte';
 *   const { scheme, isDark, set } = colorScheme({ storageKey: 'theme' });
 * </script>
 * <button on:click={() => set($isDark ? 'light' : 'dark')}>
 *   {$scheme}
 * </button>
 * ```
 */
export function colorScheme(options: ColorSchemeOptions = {}) {
  const { serverDefault = "light", storageKey } = options;

  const systemDark: Readable<boolean> = readable(
    isBrowser ? watchMedia("(prefers-color-scheme: dark)").matches() : serverDefault === "dark",
    (set) => {
      if (!isBrowser) return;
      const watcher = watchMedia("(prefers-color-scheme: dark)");
      set(watcher.matches());
      return watcher.subscribe(() => set(watcher.matches()));
    },
  );

  const override: Writable<ColorScheme | null> = writable(readStorage(storageKey));
  const scheme = derived(
    [override, systemDark],
    ([$override, $systemDark]) => ($override ?? ($systemDark ? "dark" : "light")) as ColorScheme,
  );
  const isDark = derived(scheme, ($scheme) => $scheme === "dark");

  const set = (value: ColorScheme | null) => {
    override.set(value);
    writeStorage(storageKey, value);
  };

  return { scheme, isDark, set };
}
