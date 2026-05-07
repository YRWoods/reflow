"use client";

import type { ReactNode } from "react";
import type { BreakpointKey, BreakpointMap } from "../core/breakpoints.js";
import { useBreakpoint } from "./useBreakpoint.js";

export interface ShowProps<B extends BreakpointMap> {
  /** Show only at this exact breakpoint. */
  on?: BreakpointKey<B>;
  /** Show at this breakpoint or larger. */
  above?: BreakpointKey<B>;
  /** Show below this breakpoint. */
  below?: BreakpointKey<B>;
  /** Show in `[min, max)`. */
  between?: [BreakpointKey<B>, BreakpointKey<B>];
  children: ReactNode;
  /** Render this fallback when the condition is false. */
  fallback?: ReactNode;
}

/**
 * Conditionally render based on the active breakpoint.
 *
 * @example
 *   <Show above="md"><Sidebar /></Show>
 *   <Show below="md" fallback={<Sidebar />}><MobileMenu /></Show>
 */
export function Show<B extends BreakpointMap>({
  on,
  above,
  below,
  between,
  children,
  fallback = null,
}: ShowProps<B>) {
  const bp = useBreakpoint<B>();
  let visible = true;
  if (on !== undefined) visible = visible && bp.is(on);
  if (above !== undefined) visible = visible && bp.above(above);
  if (below !== undefined) visible = visible && bp.below(below);
  if (between !== undefined) visible = visible && bp.between(between[0], between[1]);
  return <>{visible ? children : fallback}</>;
}

export interface HideProps<B extends BreakpointMap>
  extends Omit<ShowProps<B>, "children" | "fallback"> {
  children: ReactNode;
}

/** Inverse of {@link Show}. */
export function Hide<B extends BreakpointMap>({ children, ...rest }: HideProps<B>) {
  return (
    <Show<B> {...rest} fallback={children}>
      {null}
    </Show>
  );
}
