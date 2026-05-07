/**
 * Default breakpoint preset (mobile-first, in pixels).
 * Aligned with widely used conventions (Tailwind/Bootstrap-ish).
 */
export const defaultBreakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type DefaultBreakpoints = typeof defaultBreakpoints;

export type BreakpointMap = Readonly<Record<string, number>>;

export type BreakpointKey<B extends BreakpointMap> = Extract<keyof B, string>;

export interface BreakpointSystem<B extends BreakpointMap> {
  readonly breakpoints: B;
  readonly keys: ReadonlyArray<BreakpointKey<B>>;
  /** Returns the active breakpoint key for a given viewport width. */
  resolve(width: number): BreakpointKey<B>;
  /** `(min-width: Npx)` */
  up(key: BreakpointKey<B>): string;
  /** `(max-width: (N - 0.02)px)` — exclusive upper bound */
  down(key: BreakpointKey<B>): string;
  /** `(min-width: Npx) and (max-width: (M - 0.02)px)` */
  between(min: BreakpointKey<B>, max: BreakpointKey<B>): string;
  /** Matches only inside a single tier. */
  only(key: BreakpointKey<B>): string;
}

function sortedKeys<B extends BreakpointMap>(bps: B): ReadonlyArray<BreakpointKey<B>> {
  return (Object.keys(bps) as BreakpointKey<B>[]).slice().sort((a, b) => bps[a]! - bps[b]!);
}

/**
 * Create a typed breakpoint system from any map of `{ name: minWidthPx }`.
 *
 * @example
 *   const bp = createBreakpoints({ mobile: 0, tablet: 600, desktop: 1024 });
 *   bp.up("tablet");   // "(min-width: 600px)"
 *   bp.resolve(900);    // "tablet"
 */
export function createBreakpoints<B extends BreakpointMap>(breakpoints: B): BreakpointSystem<B> {
  const keys = sortedKeys(breakpoints);
  if (keys.length === 0) {
    throw new Error("createBreakpoints: at least one breakpoint is required");
  }

  const indexOf = (k: BreakpointKey<B>) => keys.indexOf(k);

  const up = (key: BreakpointKey<B>) => {
    const v = breakpoints[key];
    if (v === undefined) throw new Error(`Unknown breakpoint: ${String(key)}`);
    return v <= 0 ? "all" : `(min-width: ${v}px)`;
  };

  const down = (key: BreakpointKey<B>) => {
    const v = breakpoints[key];
    if (v === undefined) throw new Error(`Unknown breakpoint: ${String(key)}`);
    // Subtract 0.02px to avoid range overlap (Bootstrap convention).
    return `(max-width: ${Math.max(0, v - 0.02)}px)`;
  };

  const between = (min: BreakpointKey<B>, max: BreakpointKey<B>) => {
    const lo = breakpoints[min];
    const hi = breakpoints[max];
    if (lo === undefined || hi === undefined) {
      throw new Error(`Unknown breakpoint in between(${String(min)}, ${String(max)})`);
    }
    return `(min-width: ${lo}px) and (max-width: ${Math.max(0, hi - 0.02)}px)`;
  };

  const only = (key: BreakpointKey<B>) => {
    const idx = indexOf(key);
    if (idx === -1) throw new Error(`Unknown breakpoint: ${String(key)}`);
    const next = keys[idx + 1];
    if (!next) return up(key);
    return between(key, next);
  };

  const resolve = (width: number): BreakpointKey<B> => {
    let active: BreakpointKey<B> = keys[0]!;
    for (const k of keys) {
      if (width >= breakpoints[k]!) active = k;
      else break;
    }
    return active;
  };

  return { breakpoints, keys, resolve, up, down, between, only };
}

/** Convenience instance using {@link defaultBreakpoints}. */
export const defaultSystem: BreakpointSystem<DefaultBreakpoints> =
  createBreakpoints(defaultBreakpoints);
