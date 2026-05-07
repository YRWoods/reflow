/**
 * Helpers for CSS container queries. These produce strings — pair them with
 * any styling solution (vanilla CSS, CSS-in-JS, CSS Modules, etc.).
 */
export interface ContainerQueryOptions {
  /** Optional named container. */
  name?: string;
  /** Min width in px. */
  minPx?: number;
  /** Max width in px. */
  maxPx?: number;
}

/** Build a `@container` rule string. */
export function containerQuery(opts: ContainerQueryOptions): string {
  const conds: string[] = [];
  if (opts.minPx !== undefined) conds.push(`(min-width: ${opts.minPx}px)`);
  if (opts.maxPx !== undefined) conds.push(`(max-width: ${Math.max(0, opts.maxPx - 0.02)}px)`);
  if (conds.length === 0) {
    throw new Error("containerQuery: provide minPx and/or maxPx");
  }
  const head = opts.name ? `@container ${opts.name} ` : "@container ";
  return `${head}${conds.join(" and ")}`;
}

/** CSS declaration string establishing a size container. */
export function defineContainer(name?: string): string {
  return name
    ? `container-type: inline-size; container-name: ${name};`
    : "container-type: inline-size;";
}
