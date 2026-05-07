/**
 * `env(safe-area-inset-*)` CSS helpers. These return strings; combine with
 * any styling solution.
 */

export type SafeAreaSide = "top" | "right" | "bottom" | "left";

/** CSS expression: `env(safe-area-inset-top, 0px)`. */
export function safeAreaInset(side: SafeAreaSide, fallbackPx = 0): string {
  return `env(safe-area-inset-${side}, ${fallbackPx}px)`;
}

/** CSS shorthand padding using safe-area insets. */
export function safeAreaPadding(fallbackPx = 0): string {
  const f = `${fallbackPx}px`;
  return `env(safe-area-inset-top, ${f}) env(safe-area-inset-right, ${f}) env(safe-area-inset-bottom, ${f}) env(safe-area-inset-left, ${f})`;
}

/** CSS declaration to opt the app into edge-to-edge layout (use in viewport meta or html). */
export const viewportFitCover = "viewport-fit=cover";
