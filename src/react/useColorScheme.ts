"use client";

import { useCallback, useSyncExternalStore } from "react";
import { watchMedia } from "../core/media.js";

/**
 * Color scheme values: system-detected or user-overridden.
 *
 * - `"light"` — light mode active
 * - `"dark"` — dark mode active
 */
export type ColorScheme = "light" | "dark";

export interface UseColorSchemeOptions {
  /** Value returned during SSR and before hydration. Default `"light"`. */
  serverDefault?: ColorScheme;
  /**
   * `localStorage` key to persist user overrides. When set, calling
   * `setColorScheme()` writes to storage and the value survives reloads.
   * Pass `undefined` (or omit) to rely purely on the system preference.
   */
  storageKey?: string;
}

export interface UseColorSchemeResult {
  /** The resolved color scheme: user override if set, else system preference. */
  colorScheme: ColorScheme;
  /** `true` when the resolved scheme is `"dark"`. */
  isDark: boolean;
  /** Override the system preference. Pass `null` to clear the override. */
  setColorScheme: (scheme: ColorScheme | null) => void;
}

const isBrowser = typeof window !== "undefined";

// Module-level store for override so it works without external state
let overrideScheme: ColorScheme | null = null;
const overrideListeners = new Set<() => void>();

function notifyOverrideListeners() {
  for (const fn of overrideListeners) fn();
}

function readStorage(key: string | undefined): ColorScheme | null {
  if (!isBrowser || !key) return null;
  try {
    const v = localStorage.getItem(key);
    if (v === "dark" || v === "light") return v;
  } catch {
    // Storage unavailable (SSR, iframe, privacy mode)
  }
  return null;
}

function writeStorage(key: string | undefined, value: ColorScheme | null) {
  if (!isBrowser || !key) return;
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage unavailable
  }
}

/**
 * SSR-safe color scheme hook with optional user override persistence.
 *
 * Without `storageKey`, it simply tracks `prefers-color-scheme` reactively.
 * With `storageKey`, calling `setColorScheme("dark")` persists the override
 * and survives page reloads. Call `setColorScheme(null)` to revert to the
 * system preference.
 *
 * @example
 * ```tsx
 * const { colorScheme, isDark, setColorScheme } = useColorScheme({
 *   storageKey: "theme",
 * });
 *
 * <button onClick={() => setColorScheme(isDark ? "light" : "dark")}>
 *   Toggle {colorScheme}
 * </button>
 * ```
 */
export function useColorScheme(options: UseColorSchemeOptions = {}): UseColorSchemeResult {
  const { serverDefault = "light", storageKey } = options;

  // Initialize override from storage on first client render
  if (isBrowser && overrideScheme === null && storageKey) {
    overrideScheme = readStorage(storageKey);
  }

  // System preference via matchMedia
  const systemSubscribe = useCallback(
    (onChange: () => void) => watchMedia("(prefers-color-scheme: dark)").subscribe(onChange),
    [],
  );
  const systemSnapshot = useCallback(
    () => watchMedia("(prefers-color-scheme: dark)").matches(),
    [],
  );
  const systemServerSnapshot = useCallback(() => serverDefault === "dark", [serverDefault]);
  const systemIsDark = useSyncExternalStore(systemSubscribe, systemSnapshot, systemServerSnapshot);

  // Override subscription
  const overrideSubscribe = useCallback((onChange: () => void) => {
    overrideListeners.add(onChange);
    return () => {
      overrideListeners.delete(onChange);
    };
  }, []);
  const overrideSnapshot = useCallback(() => overrideScheme, []);
  const overrideServerSnapshot = useCallback(() => null, []);
  const currentOverride = useSyncExternalStore(
    overrideSubscribe,
    overrideSnapshot,
    overrideServerSnapshot,
  );

  const resolved: ColorScheme = currentOverride ?? (systemIsDark ? "dark" : "light");

  const setColorScheme = useCallback(
    (scheme: ColorScheme | null) => {
      overrideScheme = scheme;
      writeStorage(storageKey, scheme);
      notifyOverrideListeners();
    },
    [storageKey],
  );

  return {
    colorScheme: resolved,
    isDark: resolved === "dark",
    setColorScheme,
  };
}
