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

  it("snapshot: default breakpoints produce stable Tailwind config", () => {
    const preset = tailwindPreset(defaultSystem);
    expect(preset).toMatchInlineSnapshot(`
      {
        "theme": {
          "screens": {
            "2xl": "1536px",
            "lg": "1024px",
            "md": "768px",
            "sm": "640px",
            "xl": "1280px",
          },
        },
      }
    `);
  });

  it("snapshot: full preset shape matches expected structure", () => {
    const preset = tailwindPreset(defaultSystem);
    // Structural validation: must have exactly theme.screens at the top level
    expect(Object.keys(preset)).toEqual(["theme"]);
    expect(Object.keys(preset.theme)).toEqual(["screens"]);
    // Every screen value must be a string ending in "px"
    for (const [key, value] of Object.entries(preset.theme.screens)) {
      expect(typeof key).toBe("string");
      expect(value).toMatch(/^\d+px$/);
    }
  });

  it("snapshot: single-breakpoint system produces valid preset", () => {
    const sys = createBreakpoints({ all: 0 });
    const preset = tailwindPreset(sys);
    expect(preset.theme.screens).toEqual({});
  });
});
