import { describe, expect, it } from "vitest";
import { createBreakpoints, defaultBreakpoints, defaultSystem } from "../src/core/breakpoints";

describe("createBreakpoints", () => {
  it("sorts keys by min-width ascending", () => {
    const bp = createBreakpoints({ lg: 1024, sm: 640, md: 768 });
    expect(bp.keys).toEqual(["sm", "md", "lg"]);
  });

  it("supports zero-width base breakpoint as `all`", () => {
    expect(defaultSystem.up("xs")).toBe("all");
  });

  it("up() emits min-width", () => {
    expect(defaultSystem.up("md")).toBe("(min-width: 768px)");
  });

  it("down() subtracts 0.02px to avoid range overlap", () => {
    expect(defaultSystem.down("md")).toBe("(max-width: 767.98px)");
  });

  it("between() composes min+max", () => {
    expect(defaultSystem.between("sm", "lg")).toBe("(min-width: 640px) and (max-width: 1023.98px)");
  });

  it("only() returns the bounded range, or open up() at top", () => {
    expect(defaultSystem.only("md")).toBe("(min-width: 768px) and (max-width: 1023.98px)");
    expect(defaultSystem.only("2xl")).toBe("(min-width: 1536px)");
  });

  it("resolve() picks active breakpoint by width", () => {
    expect(defaultSystem.resolve(0)).toBe("xs");
    expect(defaultSystem.resolve(640)).toBe("sm");
    expect(defaultSystem.resolve(700)).toBe("sm");
    expect(defaultSystem.resolve(768)).toBe("md");
    expect(defaultSystem.resolve(99999)).toBe("2xl");
  });

  it("throws on empty map", () => {
    expect(() => createBreakpoints({})).toThrow();
  });

  it("throws on unknown key", () => {
    expect(() => defaultSystem.up("bogus" as never)).toThrow();
  });

  it("default preset matches expected values", () => {
    expect(defaultBreakpoints).toEqual({
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      "2xl": 1536,
    });
  });
});
