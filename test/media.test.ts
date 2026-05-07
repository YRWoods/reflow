import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mq, watchMedia } from "../src/core/media";
import { type MatchMediaMockController, installMatchMediaMock } from "../src/testing";

describe("media", () => {
  let ctrl: MatchMediaMockController;

  beforeEach(() => {
    ctrl = installMatchMediaMock();
  });
  afterEach(() => {
    ctrl.uninstall();
  });

  it("matches() reflects mock state", () => {
    const w = watchMedia(mq.prefersDark);
    expect(w.matches()).toBe(false);
    ctrl.set(mq.prefersDark, true);
    expect(w.matches()).toBe(true);
  });

  it("subscribe() fires on change and unsubscribes cleanly", () => {
    const w = watchMedia("(min-width: 640px)");
    const calls: boolean[] = [];
    const unsub = w.subscribe((m) => calls.push(m));
    ctrl.set("(min-width: 640px)", true);
    ctrl.set("(min-width: 640px)", false);
    expect(calls).toEqual([true, false]);
    unsub();
    ctrl.set("(min-width: 640px)", true);
    expect(calls).toEqual([true, false]);
  });

  it("mq.* exports modern preference queries", () => {
    expect(mq.prefersReducedData).toBe("(prefers-reduced-data: reduce)");
    expect(mq.forcedColors).toBe("(forced-colors: active)");
    expect(mq.prefersMoreContrast).toBe("(prefers-contrast: more)");
    expect(mq.print).toBe("print");
  });
});
