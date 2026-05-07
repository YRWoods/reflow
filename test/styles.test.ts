import { describe, expect, it } from "vitest";
import { defaultSystem } from "../src/core/breakpoints";
import { containerQuery, defineContainer } from "../src/styles/container";
import { fluidClamp, fluidScale } from "../src/styles/fluid";
import { logical, toLogical } from "../src/styles/logical";
import { printOnly, printStyle } from "../src/styles/print";
import { responsiveStyle } from "../src/styles/responsive-style";
import { safeAreaInset, safeAreaPadding } from "../src/styles/safe-area";
import { dynamicViewportFallback, dynamicViewportVars } from "../src/styles/viewport-units";
import { touchTargetMinPx, visuallyHidden } from "../src/styles/visually-hidden";

describe("fluidClamp", () => {
  it("produces clamp() with rem default", () => {
    const s = fluidClamp({ minPx: 16, maxPx: 32, minVwPx: 320, maxVwPx: 1280 });
    expect(s).toMatch(/^clamp\(1rem, .+ \+ .+vw, 2rem\)$/);
  });

  it("supports px unit", () => {
    const s = fluidClamp({ minPx: 16, maxPx: 32, unit: "px" });
    expect(s).toMatch(/^clamp\(16px, .+ \+ .+vw, 32px\)$/);
  });

  it("throws on equal viewports", () => {
    expect(() => fluidClamp({ minPx: 16, maxPx: 32, minVwPx: 500, maxVwPx: 500 })).toThrow();
  });

  it("throws on swapped viewports (defensive)", () => {
    expect(() => fluidClamp({ minPx: 16, maxPx: 32, minVwPx: 1280, maxVwPx: 320 })).toThrow(
      /maxVwPx must be greater than minVwPx/,
    );
  });

  it("auto-flips clamp() when sizes are inverted", () => {
    // Shrinking scale: bigger viewport -> smaller value
    const s = fluidClamp({ minPx: 32, maxPx: 16, minVwPx: 320, maxVwPx: 1280 });
    expect(s).toMatch(/^clamp\(1rem, .+ \+ .+vw, 2rem\)$/); // lower=1rem, upper=2rem
  });
});

describe("fluidScale", () => {
  it("produces a clamp for each step", () => {
    const scale = fluidScale(["sm", "base", "lg"], { minPx: 16, ratio: 1.25 });
    expect(Object.keys(scale)).toEqual(["sm", "base", "lg"]);
    for (const v of Object.values(scale)) expect(v).toMatch(/^clamp\(/);
  });
});

describe("containerQuery", () => {
  it("emits @container with min/max", () => {
    expect(containerQuery({ minPx: 400 })).toBe("@container (min-width: 400px)");
    expect(containerQuery({ name: "card", minPx: 400, maxPx: 800 })).toBe(
      "@container card (min-width: 400px) and (max-width: 799.98px)",
    );
  });
  it("requires at least one bound", () => {
    expect(() => containerQuery({})).toThrow();
  });
  it("defineContainer emits container-type[/name]", () => {
    expect(defineContainer()).toBe("container-type: inline-size;");
    expect(defineContainer("card")).toBe("container-type: inline-size; container-name: card;");
  });
});

describe("responsiveStyle", () => {
  it("emits base prop + @media at-rules in cascade order", () => {
    const out = responsiveStyle(defaultSystem, "padding", { xs: 8, md: 16, lg: 24 });
    expect(out.padding).toBe(8);
    expect(out["@media (min-width: 768px)"]).toEqual({ padding: 16 });
    expect(out["@media (min-width: 1024px)"]).toEqual({ padding: 24 });
  });
});

describe("logical helpers", () => {
  it("maps physical -> logical", () => {
    expect(toLogical({ paddingLeft: 8, marginRight: "1rem" })).toEqual({
      "padding-inline-start": 8,
      "margin-inline-end": "1rem",
    });
  });
  it("exposes the logical map", () => {
    expect(logical.width).toBe("inline-size");
  });
});

describe("safe-area helpers", () => {
  it("emits env() with fallback", () => {
    expect(safeAreaInset("top")).toBe("env(safe-area-inset-top, 0px)");
    expect(safeAreaInset("bottom", 16)).toBe("env(safe-area-inset-bottom, 16px)");
  });
  it("emits shorthand padding", () => {
    expect(safeAreaPadding(8)).toContain("env(safe-area-inset-top, 8px)");
  });
});

describe("dynamic viewport units", () => {
  it("fallback declaration includes both unit pairs", () => {
    expect(dynamicViewportFallback(100, "dvh")).toContain("100vh");
    expect(dynamicViewportFallback(100, "dvh")).toContain("100dvh");
  });
  it("vars() declares all six units", () => {
    const v = dynamicViewportVars();
    for (const u of ["dvh", "svh", "lvh", "dvw", "svw", "lvw"]) {
      expect(v).toContain(u);
    }
  });
});

describe("visuallyHidden + touchTargetMinPx", () => {
  it("provides standard visually-hidden style", () => {
    expect(visuallyHidden.position).toBe("absolute");
    expect(visuallyHidden.clip).toContain("rect(");
  });
  it("exposes touch target sizes", () => {
    expect(touchTargetMinPx.wcag).toBe(24);
    expect(touchTargetMinPx.apple).toBe(44);
    expect(touchTargetMinPx.material).toBe(48);
  });
});

describe("print helpers", () => {
  it("wraps under @media print", () => {
    const out = printStyle({ color: "black" });
    expect(out[printOnly]).toEqual({ color: "black" });
  });
});
