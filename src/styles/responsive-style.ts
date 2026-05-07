import type { BreakpointKey, BreakpointMap, BreakpointSystem } from "../core/breakpoints.js";

/**
 * Convert a `{ breakpoint: value }` map into nested CSS-in-JS-style media
 * query objects. Compatible with libraries like emotion, styled-components,
 * vanilla-extract, etc., that accept nested `@media` keys.
 *
 * @example
 *   responsiveStyle(system, "padding", { xs: 8, md: 16, lg: 24 })
 *   // => { padding: 8, "@media (min-width: 768px)": { padding: 16 }, ... }
 */
export function responsiveStyle<B extends BreakpointMap, V>(
  system: BreakpointSystem<B>,
  property: string,
  values: Partial<Record<BreakpointKey<B>, V>>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of system.keys) {
    if (!(key in values) || values[key] === undefined) continue;
    const v = values[key]!;
    const bpValue = system.breakpoints[key]!;
    if (bpValue <= 0) {
      out[property] = v;
    } else {
      out[`@media (min-width: ${bpValue}px)`] = { [property]: v };
    }
  }
  return out;
}
