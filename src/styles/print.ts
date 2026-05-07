/**
 * Print-only helpers. Mirrors the pattern of media query builders.
 */
export const printOnly = "@media print";
export const screenOnly = "@media screen";

/** Wrap a CSS object under `@media print` for CSS-in-JS users. */
export function printStyle<T extends Record<string, unknown>>(declarations: T): Record<string, T> {
  return { [printOnly]: declarations } as Record<string, T>;
}
