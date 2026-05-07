/**
 * Logical-property aliases. Encourages writing direction- and writing-mode-
 * agnostic CSS so RTL just works.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values
 */
export const logical = {
  // Sizing
  width: "inline-size",
  height: "block-size",
  minWidth: "min-inline-size",
  maxWidth: "max-inline-size",
  minHeight: "min-block-size",
  maxHeight: "max-block-size",
  // Padding
  paddingLeft: "padding-inline-start",
  paddingRight: "padding-inline-end",
  paddingTop: "padding-block-start",
  paddingBottom: "padding-block-end",
  // Margin
  marginLeft: "margin-inline-start",
  marginRight: "margin-inline-end",
  marginTop: "margin-block-start",
  marginBottom: "margin-block-end",
  // Border
  borderLeft: "border-inline-start",
  borderRight: "border-inline-end",
  borderTop: "border-block-start",
  borderBottom: "border-block-end",
  // Position
  left: "inset-inline-start",
  right: "inset-inline-end",
  top: "inset-block-start",
  bottom: "inset-block-end",
} as const;

export type PhysicalProperty = keyof typeof logical;

/** Convert a record of physical-property styles to logical equivalents. */
export function toLogical(
  styles: Partial<Record<PhysicalProperty, string | number>>,
): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(styles)) {
    if (v === undefined) continue;
    const mapped = (logical as Record<string, string>)[k] ?? k;
    out[mapped] = v as string | number;
  }
  return out;
}
