/**
 * Generate a CSS `clamp()` expression that fluidly scales between two values
 * across two viewport widths. Output is a string suitable for any CSS property.
 *
 * @example
 *   clamp({ minPx: 16, maxPx: 24, minVwPx: 320, maxVwPx: 1280 })
 *   // => "clamp(1rem, 0.8rem + 1.25vw, 1.5rem)"
 */
export interface ClampOptions {
  /** Minimum value in pixels (at minVwPx and below). */
  minPx: number;
  /** Maximum value in pixels (at maxVwPx and above). */
  maxPx: number;
  /** Lower viewport width in pixels (default 320). */
  minVwPx?: number;
  /** Upper viewport width in pixels (default 1280). */
  maxVwPx?: number;
  /** Root font-size used for rem conversion (default 16). */
  rootPx?: number;
  /** Output unit: "rem" (default) or "px". */
  unit?: "rem" | "px";
  /** Decimals to round to (default 4). */
  precision?: number;
}

const round = (n: number, p: number) => {
  const f = 10 ** p;
  return Math.round(n * f) / f;
};

export function fluidClamp(opts: ClampOptions): string {
  const {
    minPx,
    maxPx,
    minVwPx = 320,
    maxVwPx = 1280,
    rootPx = 16,
    unit = "rem",
    precision = 4,
  } = opts;

  if (maxVwPx === minVwPx) {
    throw new Error("fluidClamp: minVwPx and maxVwPx must differ");
  }
  if (maxVwPx < minVwPx) {
    throw new Error(
      `fluidClamp: maxVwPx must be greater than minVwPx (got min=${minVwPx}, max=${maxVwPx}). Did you swap the arguments?`,
    );
  }
  // Allow inverted size scales (size shrinks as viewport grows) but warn-via-throw
  // only if the result would produce an invalid clamp(min, ..., max) where min>max.
  // CSS clamp() requires the first arg <= last; if the user wants a shrinking scale,
  // they should pass minPx > maxPx — we'll generate clamp(maxPx, ..., minPx) instead.
  const lower = Math.min(minPx, maxPx);
  const upper = Math.max(minPx, maxPx);

  const slope = (maxPx - minPx) / (maxVwPx - minVwPx);
  const interceptPx = minPx - slope * minVwPx;
  const slopeVw = slope * 100;

  const fmt = (px: number) =>
    unit === "px" ? `${round(px, precision)}px` : `${round(px / rootPx, precision)}rem`;

  const intercept = fmt(interceptPx);
  return `clamp(${fmt(lower)}, ${intercept} + ${round(slopeVw, precision)}vw, ${fmt(upper)})`;
}

/**
 * Build a fluid type scale: an object of `{ stepName: clamp(...) }`.
 *
 * @example
 *   fluidScale(["sm","base","lg","xl"], { minPx: 14, ratio: 1.2 })
 */
export function fluidScale(
  steps: ReadonlyArray<string>,
  opts: {
    minPx: number;
    ratio?: number;
    maxRatio?: number;
    minVwPx?: number;
    maxVwPx?: number;
    rootPx?: number;
    unit?: "rem" | "px";
  },
): Record<string, string> {
  const ratio = opts.ratio ?? 1.2;
  const maxRatio = opts.maxRatio ?? ratio * 1.1;
  const out: Record<string, string> = {};
  steps.forEach((name, i) => {
    out[name] = fluidClamp({
      minPx: opts.minPx * ratio ** i,
      maxPx: opts.minPx * maxRatio ** i,
      minVwPx: opts.minVwPx,
      maxVwPx: opts.maxVwPx,
      rootPx: opts.rootPx,
      unit: opts.unit,
    });
  });
  return out;
}
