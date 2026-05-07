/**
 * Helpers for dynamic viewport units (svh/lvh/dvh and svw/lvw/dvw) with
 * graceful fallbacks for browsers that don't support them.
 *
 * @see https://web.dev/viewport-units/
 */

export type DynamicUnit = "dvh" | "svh" | "lvh" | "dvw" | "svw" | "lvw";

/**
 * Returns a CSS expression that prefers a dynamic unit but falls back to the
 * older equivalent (`vh`/`vw`) for older browsers.
 *
 * @example
 *   dynamicViewportFallback(100, "dvh")
 *   // -> "100vh; height: 100dvh;" — use as a *block* of declarations.
 */
export function dynamicViewportFallback(value: number, unit: DynamicUnit): string {
  const fallback = unit.endsWith("h") ? "vh" : "vw";
  return `${value}${fallback}; ${unit.endsWith("h") ? "height" : "width"}: ${value}${unit}`;
}

/**
 * Build a CSS variable declaration that resolves to the dynamic unit when
 * supported, with the older unit as a fallback. Use `var(--vh)` etc.
 */
export function dynamicViewportVars(): string {
  return [
    "--vh: 1vh; --vh: 1dvh;",
    "--svh: 1vh; --svh: 1svh;",
    "--lvh: 1vh; --lvh: 1lvh;",
    "--vw: 1vw; --vw: 1dvw;",
    "--svw: 1vw; --svw: 1svw;",
    "--lvw: 1vw; --lvw: 1lvw;",
  ].join(" ");
}

/**
 * Read the actual height of `1dvh` in pixels from the runtime (useful in JS
 * for full-bleed sections that need accurate values on mobile).
 */
export function readDynamicViewportPx(unit: "dvh" | "svh" | "lvh" = "dvh"): number {
  if (typeof document === "undefined") return 0;
  const probe = document.createElement("div");
  probe.style.cssText = `position:fixed;top:0;left:0;width:0;height:1${unit};visibility:hidden;pointer-events:none;`;
  document.documentElement.appendChild(probe);
  const h = probe.getBoundingClientRect().height;
  probe.remove();
  return h;
}
