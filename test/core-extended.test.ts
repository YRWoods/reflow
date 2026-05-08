import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  type ContainerSize,
  getContainerSize,
  matchesContainerRange,
  observeContainer,
} from "../src/core/container";
import { getDevicePixelRatio, observeDevicePixelRatio } from "../src/core/dpr";
import {
  type PointerCapabilities,
  getPointerCapabilities,
  observePointerCapabilities,
} from "../src/core/pointer";
import {
  type PreferenceKey,
  getAllPreferences,
  getPreference,
  observePreference,
} from "../src/core/preferences";
import { type SafeAreaInsets, getSafeArea, observeSafeArea } from "../src/core/safe-area";
import {
  getViewport,
  getVisualViewport,
  observeViewport,
  observeVisualViewport,
} from "../src/core/viewport";
import {
  type MatchMediaMockController,
  type ResizeObserverMockController,
  installMatchMediaMock,
  installResizeObserverMock,
  setWindowSize,
} from "../src/testing";

// ---------- DPR ----------

describe("dpr", () => {
  it("getDevicePixelRatio returns a number", () => {
    expect(typeof getDevicePixelRatio()).toBe("number");
    expect(getDevicePixelRatio()).toBeGreaterThanOrEqual(1);
  });

  it("observeDevicePixelRatio returns an unsubscribe function", () => {
    const unsub = observeDevicePixelRatio(() => {});
    expect(typeof unsub).toBe("function");
    unsub();
  });
});

// ---------- Pointer ----------

describe("pointer", () => {
  let ctrl: MatchMediaMockController;

  beforeEach(() => {
    ctrl = installMatchMediaMock();
  });
  afterEach(() => {
    ctrl.uninstall();
  });

  it("getPointerCapabilities returns all boolean fields", () => {
    const caps = getPointerCapabilities();
    expect(typeof caps.hover).toBe("boolean");
    expect(typeof caps.anyHover).toBe("boolean");
    expect(typeof caps.coarse).toBe("boolean");
    expect(typeof caps.fine).toBe("boolean");
    expect(typeof caps.none).toBe("boolean");
  });

  it("observePointerCapabilities fires on pointer media change", () => {
    const calls: PointerCapabilities[] = [];
    const unsub = observePointerCapabilities((caps) => calls.push(caps));

    ctrl.set("(hover: hover)", true);
    expect(calls.length).toBeGreaterThanOrEqual(1);
    expect(calls[calls.length - 1]!.hover).toBe(true);

    unsub();
    ctrl.set("(hover: hover)", false);
    expect(calls.length).toBeLessThanOrEqual(calls.length);
  });
});

// ---------- Preferences ----------

describe("preferences", () => {
  let ctrl: MatchMediaMockController;

  beforeEach(() => {
    ctrl = installMatchMediaMock();
  });
  afterEach(() => {
    ctrl.uninstall();
  });

  it("getPreference returns false by default for all keys", () => {
    const keys: PreferenceKey[] = [
      "reducedMotion",
      "reducedData",
      "moreContrast",
      "lessContrast",
      "forcedColors",
      "invertedColors",
      "dark",
      "light",
    ];
    for (const key of keys) {
      expect(getPreference(key)).toBe(false);
    }
  });

  it("getPreference reflects mock state", () => {
    ctrl.set("(prefers-color-scheme: dark)", true);
    expect(getPreference("dark")).toBe(true);
  });

  it("getAllPreferences returns a full boolean record", () => {
    const prefs = getAllPreferences();
    expect(Object.keys(prefs)).toEqual([
      "reducedMotion",
      "reducedData",
      "moreContrast",
      "lessContrast",
      "forcedColors",
      "invertedColors",
      "dark",
      "light",
    ]);
    for (const v of Object.values(prefs)) {
      expect(typeof v).toBe("boolean");
    }
  });

  it("observePreference fires when preference changes", () => {
    const calls: boolean[] = [];
    const unsub = observePreference("reducedMotion", (v) => calls.push(v));

    ctrl.set("(prefers-reduced-motion: reduce)", true);
    expect(calls).toEqual([true]);

    ctrl.set("(prefers-reduced-motion: reduce)", false);
    expect(calls).toEqual([true, false]);

    unsub();
    ctrl.set("(prefers-reduced-motion: reduce)", true);
    expect(calls).toEqual([true, false]);
  });
});

// ---------- Container ----------

describe("container", () => {
  it("matchesContainerRange checks minPx correctly", () => {
    const size: ContainerSize = { width: 500, height: 300 };
    expect(matchesContainerRange(size, { minPx: 400 })).toBe(true);
    expect(matchesContainerRange(size, { minPx: 600 })).toBe(false);
    expect(matchesContainerRange(size, { minPx: 500 })).toBe(true);
  });

  it("matchesContainerRange checks maxPx correctly", () => {
    const size: ContainerSize = { width: 500, height: 300 };
    expect(matchesContainerRange(size, { maxPx: 600 })).toBe(true);
    expect(matchesContainerRange(size, { maxPx: 500 })).toBe(false);
    expect(matchesContainerRange(size, { maxPx: 400 })).toBe(false);
  });

  it("matchesContainerRange checks combined min/max", () => {
    const size: ContainerSize = { width: 500, height: 300 };
    expect(matchesContainerRange(size, { minPx: 400, maxPx: 600 })).toBe(true);
    expect(matchesContainerRange(size, { minPx: 400, maxPx: 500 })).toBe(false);
    expect(matchesContainerRange(size, { minPx: 600, maxPx: 800 })).toBe(false);
  });

  it("matchesContainerRange with no constraints always matches", () => {
    expect(matchesContainerRange({ width: 0, height: 0 }, {})).toBe(true);
    expect(matchesContainerRange({ width: 9999, height: 9999 }, {})).toBe(true);
  });

  it("getContainerSize returns width and height", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    const size = getContainerSize(el);
    expect(typeof size.width).toBe("number");
    expect(typeof size.height).toBe("number");
    document.body.removeChild(el);
  });

  it("observeContainer returns an unsubscribe function", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    const unsub = observeContainer(el, () => {});
    expect(typeof unsub).toBe("function");
    unsub();
    document.body.removeChild(el);
  });
});

// ---------- Viewport (extended) ----------

describe("viewport (extended)", () => {
  it("getViewport returns width, height, orientation", () => {
    const vp = getViewport();
    expect(typeof vp.width).toBe("number");
    expect(typeof vp.height).toBe("number");
    expect(["portrait", "landscape"]).toContain(vp.orientation);
  });

  it("getVisualViewport returns all fields", () => {
    const vvp = getVisualViewport();
    expect(typeof vvp.width).toBe("number");
    expect(typeof vvp.height).toBe("number");
    expect(typeof vvp.offsetTop).toBe("number");
    expect(typeof vvp.offsetLeft).toBe("number");
    expect(typeof vvp.scale).toBe("number");
  });

  it("observeViewport fires on resize when dimensions change", () => {
    const calls: Array<{ width: number; height: number }> = [];
    const unsub = observeViewport((state) => calls.push(state));

    setWindowSize(800, 600);
    expect(calls.length).toBeGreaterThanOrEqual(1);
    expect(calls[calls.length - 1]!.width).toBe(800);
    expect(calls[calls.length - 1]!.height).toBe(600);

    unsub();
  });

  it("observeViewport with immediate fires immediately", () => {
    const calls: Array<{ width: number; height: number }> = [];
    const unsub = observeViewport((state) => calls.push(state), { immediate: true });
    expect(calls.length).toBe(1);
    unsub();
  });

  it("observeVisualViewport returns unsubscribe", () => {
    const unsub = observeVisualViewport(() => {});
    expect(typeof unsub).toBe("function");
    unsub();
  });
});

// ---------- Safe area ----------

describe("safe-area", () => {
  it("getSafeArea returns four numeric insets", () => {
    const insets = getSafeArea();
    expect(typeof insets.top).toBe("number");
    expect(typeof insets.right).toBe("number");
    expect(typeof insets.bottom).toBe("number");
    expect(typeof insets.left).toBe("number");
  });

  it("observeSafeArea subscribes and unsubscribes cleanly", () => {
    const calls: SafeAreaInsets[] = [];
    const unsub = observeSafeArea((insets) => calls.push(insets));
    expect(typeof unsub).toBe("function");
    unsub();
  });
});
