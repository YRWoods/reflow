import { describe, expect, it } from "vitest";
import { defaultSystem } from "../src/core/breakpoints";
import {
  clientHintsResponseHeaders,
  resolveBreakpointFromHints,
  resolveBreakpointFromUserAgent,
  resolveServerBreakpoint,
} from "../src/server";

describe("server hints", () => {
  it("parses Sec-CH-Viewport-Width", () => {
    const r = resolveBreakpointFromHints({ "Sec-CH-Viewport-Width": "1280" }, defaultSystem);
    expect(r).toEqual({ active: "xl", width: 1280 });
  });

  it("falls back to mobile when Sec-CH-UA-Mobile is ?1", () => {
    const r = resolveBreakpointFromHints({ "Sec-CH-UA-Mobile": "?1" }, defaultSystem);
    expect(r?.active).toBe("xs");
  });

  it("returns null for empty input", () => {
    expect(resolveBreakpointFromHints(undefined, defaultSystem)).toBeNull();
    expect(resolveBreakpointFromHints({}, defaultSystem)).toBeNull();
  });

  it("handles Headers instances", () => {
    const headers = new Headers({ "Sec-CH-Viewport-Width": "640" });
    const r = resolveBreakpointFromHints(headers, defaultSystem);
    expect(r).toEqual({ active: "sm", width: 640 });
  });
});

describe("UA fallback", () => {
  it("detects mobile UA", () => {
    const r = resolveBreakpointFromUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit Mobile",
      defaultSystem,
    );
    expect(r?.active).toBe("xs");
  });

  it("detects tablet UA", () => {
    const r = resolveBreakpointFromUserAgent(
      "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit",
      defaultSystem,
    );
    expect(r?.active).toBe("md");
  });

  it("returns null for desktop UA", () => {
    const r = resolveBreakpointFromUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit Chrome",
      defaultSystem,
    );
    expect(r).toBeNull();
  });
});

describe("resolveServerBreakpoint", () => {
  it("prefers hints over UA", () => {
    const r = resolveServerBreakpoint(
      {
        headers: { "Sec-CH-Viewport-Width": "1024" },
        userAgent: "iPhone",
      },
      defaultSystem,
    );
    expect(r?.width).toBe(1024);
  });
});

describe("clientHintsResponseHeaders", () => {
  it("contains Accept-CH", () => {
    expect(clientHintsResponseHeaders["Accept-CH"]).toContain("Sec-CH-Viewport-Width");
  });
});
