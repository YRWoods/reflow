/**
 * Visually-hidden helper — hides content from sighted users while keeping
 * it accessible to screen readers. Prefer this over `display: none` for any
 * SR-relevant content.
 *
 * @see https://www.tpgi.com/the-anatomy-of-visually-hidden/
 */
export const visuallyHidden = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: 0,
} as const;

/** As a CSS string, suitable for `style.cssText` or a stylesheet rule. */
export const visuallyHiddenCss =
  "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0;";

/**
 * WCAG-aligned minimum touch target sizes for coarse pointers.
 * @see https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
 */
export const touchTargetMinPx = {
  /** WCAG 2.2 AA minimum. */
  wcag: 24,
  /** Apple Human Interface Guidelines. */
  apple: 44,
  /** Material Design. */
  material: 48,
} as const;
