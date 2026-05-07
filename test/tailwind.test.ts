import { describe, expect, it } from "vitest";
import { createBreakpoints, defaultSystem } from "../src/core/breakpoints";
import { tailwindPreset } from "../src/tailwind";

describe("tailwindPreset", () => {
  it("emits Tailwind screens object skipping zero-width base", () => {
    const preset = tailwindPreset(defaultSystem);
    expect(preset.theme.screens).toEqual({
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    });
  });

  it("respects custom breakpoint maps", () => {
    const sys = createBreakpoints({ mobile: 0, tablet: 600, desktop: 1024 });
    expect(tailwindPreset(sys).theme.screens).toEqual({
      tablet: "600px",
      desktop: "1024px",
    });
  });
});
