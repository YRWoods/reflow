/**
 * Watch `devicePixelRatio` for changes (e.g., user zooming, moving window
 * to a different-DPI monitor). The browser does not fire a single event for
 * this — we re-bind a `(resolution: ${current}dppx)` query each time it
 * changes, per the MDN-recommended pattern.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio#monitoring_screen_resolution_or_zoom_level_changes
 */

const isBrowser = (): boolean =>
  typeof window !== "undefined" && typeof window.matchMedia === "function";

export function getDevicePixelRatio(): number {
  if (typeof window === "undefined") return 1;
  return window.devicePixelRatio || 1;
}

export function observeDevicePixelRatio(listener: (dpr: number) => void): () => void {
  if (!isBrowser()) return () => {};

  let cleanup: (() => void) | null = null;
  let cancelled = false;

  const bind = () => {
    if (cancelled) return;
    const dpr = window.devicePixelRatio || 1;
    const mql = window.matchMedia(`(resolution: ${dpr}dppx)`);
    const onChange = () => {
      cleanup?.();
      listener(window.devicePixelRatio || 1);
      bind();
    };
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      cleanup = () => mql.removeEventListener("change", onChange);
    } else {
      const legacy = mql as unknown as {
        addListener: (h: () => void) => void;
        removeListener: (h: () => void) => void;
      };
      legacy.addListener(onChange);
      cleanup = () => legacy.removeListener(onChange);
    }
  };

  bind();
  return () => {
    cancelled = true;
    cleanup?.();
  };
}
