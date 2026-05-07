/**
 * Pick a value for the active breakpoint, falling back to the closest
 * smaller-or-equal defined entry (mobile-first cascade).
 */
import type { BreakpointKey, BreakpointMap, BreakpointSystem } from "./breakpoints.js";

export type ResponsiveValue<T, B extends BreakpointMap> = T | Partial<Record<BreakpointKey<B>, T>>;

export function resolveResponsive<T, B extends BreakpointMap>(
  system: BreakpointSystem<B>,
  value: ResponsiveValue<T, B>,
  width: number,
): T | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value !== "object" || Array.isArray(value)) return value as T;

  const map = value as Partial<Record<BreakpointKey<B>, T>>;
  const active = system.resolve(width);
  const idx = system.keys.indexOf(active);

  // Walk from active down to base, returning first defined entry.
  for (let i = idx; i >= 0; i--) {
    const k = system.keys[i]!;
    if (k in map && map[k] !== undefined) return map[k];
  }
  // Walk upward as a last resort.
  for (let i = idx + 1; i < system.keys.length; i++) {
    const k = system.keys[i]!;
    if (k in map && map[k] !== undefined) return map[k];
  }
  return undefined;
}
