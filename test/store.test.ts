import { describe, expect, it } from "vitest";
import { defaultSystem } from "../src/core/breakpoints";
import { createFluidityStore } from "../src/core/store";

describe("createFluidityStore", () => {
  it("returns initial snapshot from constructor args", () => {
    const s = createFluidityStore(defaultSystem, { initialWidth: 800, initialHeight: 600 });
    expect(s.getSnapshot()).toEqual({
      width: 800,
      height: 600,
      active: "md",
      orientation: "landscape",
    });
  });

  it("resolves orientation correctly", () => {
    const s = createFluidityStore(defaultSystem, { initialWidth: 400, initialHeight: 800 });
    expect(s.getSnapshot().orientation).toBe("portrait");
  });

  it("server snapshot is independent until updated", () => {
    const s = createFluidityStore(defaultSystem, { initialWidth: 800, initialHeight: 600 });
    s.setServerSnapshot({ width: 320 });
    expect(s.getServerSnapshot().active).toBe("xs");
    expect(s.getServerSnapshot().width).toBe(320);
    expect(s.getSnapshot().width).toBe(800);
  });

  it("subscribe returns an unsubscribe", () => {
    const s = createFluidityStore(defaultSystem);
    const unsub = s.subscribe(() => {});
    expect(typeof unsub).toBe("function");
    unsub();
  });
});
