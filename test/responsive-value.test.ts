import { describe, expect, it } from "vitest";
import { defaultSystem } from "../src/core/breakpoints";
import { resolveResponsive } from "../src/core/responsive-value";

describe("resolveResponsive", () => {
  it("returns scalar values unchanged", () => {
    expect(resolveResponsive(defaultSystem, 42, 1024)).toBe(42);
    expect(resolveResponsive(defaultSystem, "x", 100)).toBe("x");
  });

  it("falls back to closest smaller-or-equal entry, then upward as last resort", () => {
    const v = { sm: "small", lg: "large" };
    // Below sm: no smaller entry → walks upward and finds sm.
    expect(resolveResponsive(defaultSystem, v, 0)).toBe("small");
    expect(resolveResponsive(defaultSystem, v, 700)).toBe("small");
    expect(resolveResponsive(defaultSystem, v, 800)).toBe("small");
    expect(resolveResponsive(defaultSystem, v, 1024)).toBe("large");
    expect(resolveResponsive(defaultSystem, v, 9000)).toBe("large");
  });

  it("walks upward only as last resort", () => {
    const v = { lg: "L" };
    expect(resolveResponsive(defaultSystem, v, 0)).toBe("L");
  });

  it("handles undefined/null", () => {
    expect(resolveResponsive(defaultSystem, undefined as never, 1024)).toBeUndefined();
  });
});
