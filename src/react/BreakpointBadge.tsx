"use client";

import type { BreakpointMap } from "../core/breakpoints.js";
import { useBreakpoint } from "./useBreakpoint.js";
import { useViewport } from "./useViewport.js";

export interface BreakpointBadgeProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  /** Render only when `process.env.NODE_ENV !== 'production'`. Default true. */
  devOnly?: boolean;
}

const POS: Record<NonNullable<BreakpointBadgeProps["position"]>, React.CSSProperties> = {
  "bottom-right": { bottom: 8, right: 8 },
  "bottom-left": { bottom: 8, left: 8 },
  "top-right": { top: 8, right: 8 },
  "top-left": { top: 8, left: 8 },
};

const isProd = typeof process !== "undefined" && process.env?.NODE_ENV === "production";

/**
 * Tiny dev overlay showing the current breakpoint + viewport size. Drop it
 * once at the root of your app while building responsive UI.
 */
export function BreakpointBadge({
  position = "bottom-right",
  devOnly = true,
}: BreakpointBadgeProps = {}) {
  const bp = useBreakpoint<BreakpointMap>();
  const vp = useViewport();
  if (devOnly && isProd) return null;
  const style: React.CSSProperties = {
    position: "fixed",
    zIndex: 2147483646,
    background: "rgba(15,23,42,0.85)",
    color: "#fff",
    font: "12px/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
    padding: "6px 8px",
    borderRadius: 6,
    pointerEvents: "none",
    userSelect: "none",
    ...POS[position],
  };
  return (
    <div data-fluidity-badge style={style}>
      {String(bp.active)} · {vp.width}×{vp.height}
    </div>
  );
}
