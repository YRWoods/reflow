import {
  type BreakpointKey,
  type BreakpointMap,
  type BreakpointSystem,
  createBreakpoints,
  defaultBreakpoints,
} from "../core/breakpoints.js";

/**
 * Server-side helpers for resolving a breakpoint *before* the client mounts,
 * to avoid hydration mismatches. Use these from your Next.js / Remix /
 * Express / Hono handler to thread the right initial state into your render.
 */

/**
 * Parse the User-Agent Client Hints `Sec-CH-Viewport-Width` header (when
 * available) and resolve to a breakpoint key.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-CH-Viewport-Width
 */
export function resolveBreakpointFromHints<B extends BreakpointMap>(
  headers: Headers | Record<string, string | undefined> | undefined,
  system: BreakpointSystem<B> = createBreakpoints(
    defaultBreakpoints,
  ) as unknown as BreakpointSystem<B>,
): { active: BreakpointKey<B>; width: number } | null {
  if (!headers) return null;
  const get = (k: string): string | undefined => {
    if (headers instanceof Headers) {
      return headers.get(k) ?? undefined;
    }
    const lower = k.toLowerCase();
    for (const [key, val] of Object.entries(headers)) {
      if (key.toLowerCase() === lower) return val ?? undefined;
    }
    return undefined;
  };

  const widthHeader = get("Sec-CH-Viewport-Width") ?? get("Viewport-Width");
  if (widthHeader) {
    const w = Number.parseInt(widthHeader, 10);
    if (!Number.isNaN(w) && w > 0) {
      return { active: system.resolve(w), width: w };
    }
  }

  const isMobile = get("Sec-CH-UA-Mobile");
  if (isMobile === "?1") {
    const w = 390; // typical mobile width
    return { active: system.resolve(w), width: w };
  }
  return null;
}

/**
 * Coarse fallback: parse a User-Agent string for "Mobi" / "Android" / "iPhone"
 * tokens to guess a breakpoint. Use only when Client Hints aren't available.
 * Returns `null` if you should rely on the client to figure it out.
 */
export function resolveBreakpointFromUserAgent<B extends BreakpointMap>(
  userAgent: string | undefined,
  system: BreakpointSystem<B> = createBreakpoints(
    defaultBreakpoints,
  ) as unknown as BreakpointSystem<B>,
): { active: BreakpointKey<B>; width: number } | null {
  if (!userAgent) return null;
  const ua = userAgent.toLowerCase();
  const isMobile = /mobi|iphone|ipod|android.+mobile|blackberry|iemobile|opera mini/i.test(ua);
  const isTablet = /ipad|android(?!.*mobile)|tablet|kindle|playbook|silk/i.test(ua);
  if (isMobile) {
    const w = 390;
    return { active: system.resolve(w), width: w };
  }
  if (isTablet) {
    const w = 820;
    return { active: system.resolve(w), width: w };
  }
  return null;
}

/**
 * Convenience: try Client Hints first, fall back to UA sniffing, return
 * `null` if neither yields a guess (let the client decide).
 */
export function resolveServerBreakpoint<B extends BreakpointMap>(
  input: {
    headers?: Headers | Record<string, string | undefined>;
    userAgent?: string;
  },
  system?: BreakpointSystem<B>,
): { active: BreakpointKey<B>; width: number } | null {
  const sys = system ?? (createBreakpoints(defaultBreakpoints) as unknown as BreakpointSystem<B>);
  return (
    resolveBreakpointFromHints(input.headers, sys) ??
    resolveBreakpointFromUserAgent(input.userAgent, sys)
  );
}

/**
 * Headers a server should send to opt-in to Client Hints for future requests.
 * Set on the initial HTML response.
 */
export const clientHintsResponseHeaders: Readonly<Record<string, string>> = {
  "Accept-CH":
    "Sec-CH-Viewport-Width, Sec-CH-UA-Mobile, Sec-CH-Prefers-Color-Scheme, Sec-CH-Prefers-Reduced-Motion",
  Vary: "Sec-CH-Viewport-Width, Sec-CH-UA-Mobile, Sec-CH-Prefers-Color-Scheme, Sec-CH-Prefers-Reduced-Motion",
  "Critical-CH": "Sec-CH-Viewport-Width",
};
