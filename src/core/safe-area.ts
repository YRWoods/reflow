/**
 * Read `env(safe-area-inset-*)` values resolved by the browser. Works only
 * after first paint (we read computed style on a probe element).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/env
 */
export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const isBrowser = (): boolean => typeof document !== "undefined";

let probe: HTMLDivElement | null = null;

function readProbe(): SafeAreaInsets {
  if (!isBrowser()) return { top: 0, right: 0, bottom: 0, left: 0 };
  if (!probe) {
    probe = document.createElement("div");
    probe.style.cssText =
      "position:fixed;top:0;left:0;width:0;height:0;pointer-events:none;visibility:hidden;" +
      "padding-top:env(safe-area-inset-top);padding-right:env(safe-area-inset-right);" +
      "padding-bottom:env(safe-area-inset-bottom);padding-left:env(safe-area-inset-left);";
    document.documentElement.appendChild(probe);
  }
  const cs = getComputedStyle(probe);
  return {
    top: Number.parseFloat(cs.paddingTop) || 0,
    right: Number.parseFloat(cs.paddingRight) || 0,
    bottom: Number.parseFloat(cs.paddingBottom) || 0,
    left: Number.parseFloat(cs.paddingLeft) || 0,
  };
}

export function getSafeArea(): SafeAreaInsets {
  return readProbe();
}

/** Listen for safe-area changes (e.g., orientation change on iOS). */
export function observeSafeArea(listener: (insets: SafeAreaInsets) => void): () => void {
  if (!isBrowser()) return () => {};
  let scheduled = false;
  const fire = () => {
    scheduled = false;
    listener(readProbe());
  };
  const onChange = () => {
    if (scheduled) return;
    scheduled = true;
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(fire);
    else setTimeout(fire, 16);
  };
  window.addEventListener("resize", onChange, { passive: true });
  window.addEventListener("orientationchange", onChange, { passive: true });
  return () => {
    window.removeEventListener("resize", onChange);
    window.removeEventListener("orientationchange", onChange);
  };
}
