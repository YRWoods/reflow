/**
 * Tiny SSR-safe wrapper around `window.matchMedia`.
 * Returns the current match state and a subscribe function that fires on change.
 */
export interface MediaQueryWatcher {
  readonly query: string;
  matches(): boolean;
  subscribe(listener: (matches: boolean) => void): () => void;
}

const isBrowser = (): boolean =>
  typeof window !== "undefined" && typeof window.matchMedia === "function";

/** Create a media-query watcher. SSR-safe (returns `false` and no-op subscribe). */
export function watchMedia(query: string): MediaQueryWatcher {
  if (!isBrowser()) {
    return {
      query,
      matches: () => false,
      subscribe: () => () => {},
    };
  }

  const mql = window.matchMedia(query);

  return {
    query,
    matches: () => mql.matches,
    subscribe(listener) {
      const handler = (e: MediaQueryListEvent) => listener(e.matches);
      // addEventListener is the modern API; fall back for old Safari.
      if (typeof mql.addEventListener === "function") {
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
      }
      // Deprecated APIs — kept for compatibility.
      const legacy = mql as unknown as {
        addListener: (h: (e: MediaQueryListEvent) => void) => void;
        removeListener: (h: (e: MediaQueryListEvent) => void) => void;
      };
      legacy.addListener(handler);
      return () => legacy.removeListener(handler);
    },
  };
}

/** Build common media query strings without typing them by hand. */
export const mq = {
  // Color scheme
  prefersDark: "(prefers-color-scheme: dark)",
  prefersLight: "(prefers-color-scheme: light)",
  // Motion / data / contrast / colors
  prefersReducedMotion: "(prefers-reduced-motion: reduce)",
  prefersReducedData: "(prefers-reduced-data: reduce)",
  prefersMoreContrast: "(prefers-contrast: more)",
  prefersLessContrast: "(prefers-contrast: less)",
  forcedColors: "(forced-colors: active)",
  invertedColors: "(inverted-colors: inverted)",
  // Pointer / hover
  hover: "(hover: hover)",
  noHover: "(hover: none)",
  anyHover: "(any-hover: hover)",
  fineCursor: "(pointer: fine)",
  coarseCursor: "(pointer: coarse)",
  noPointer: "(pointer: none)",
  anyFinePointer: "(any-pointer: fine)",
  anyCoarsePointer: "(any-pointer: coarse)",
  // Orientation / resolution / update
  portrait: "(orientation: portrait)",
  landscape: "(orientation: landscape)",
  retina: "(min-resolution: 2dppx)",
  fastUpdate: "(update: fast)",
  slowUpdate: "(update: slow)",
  noUpdate: "(update: none)",
  // Media types
  print: "print",
  screen: "screen",
  // Foldables (experimental)
  horizontalFold: "(horizontal-viewport-segments: 2)",
  verticalFold: "(vertical-viewport-segments: 2)",
} as const;

export type MediaQueryKey = keyof typeof mq;
