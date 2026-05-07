import type { BreakpointMap, BreakpointSystem } from "../core/breakpoints.js";

/**
 * Generate a Tailwind CSS preset that mirrors a fluidity-ts breakpoint
 * system. Use it from your `tailwind.config.{js,ts}` to guarantee Tailwind
 * and your runtime hooks agree on every breakpoint.
 *
 * @example
 *   // tailwind.config.js
 *   import { tailwindPreset } from "fluidity-ts/tailwind";
 *   import { defaultSystem } from "fluidity-ts";
 *   export default { presets: [tailwindPreset(defaultSystem)] };
 */
export function tailwindPreset<B extends BreakpointMap>(
  system: BreakpointSystem<B>,
): { theme: { screens: Record<string, string> } } {
  const screens: Record<string, string> = {};
  for (const k of system.keys) {
    const v = system.breakpoints[k]!;
    if (v > 0) screens[k] = `${v}px`;
  }
  return { theme: { screens } };
}
