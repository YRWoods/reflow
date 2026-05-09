import type { Readable } from "svelte/store";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  breakpoint,
  colorScheme,
  containerQuery,
  mediaQuery,
  preference,
  viewport,
} from "../src/svelte";
import {
  type MatchMediaMockController,
  type ResizeObserverMockController,
  installMatchMediaMock,
  installResizeObserverMock,
  setWindowSize,
} from "../src/testing";

type SubscriptionTracker<T> = {
  readonly value: T;
  unsubscribe: () => void;
};

function trackStore<T>(store: Readable<T>): SubscriptionTracker<T> {
  let current!: T;
  const unsubscribe = store.subscribe((value) => {
    current = value;
  });

  return {
    get value() {
      return current;
    },
    unsubscribe,
  };
}

function setElementSize(el: Element, width: number, height: number) {
  vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
    width,
    height,
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    x: 0,
    y: 0,
    toJSON() {
      return this;
    },
  } as DOMRect);
}

describe("Svelte adapter", () => {
  let mm: MatchMediaMockController;
  let ro: ResizeObserverMockController;

  beforeEach(() => {
    mm = installMatchMediaMock();
    ro = installResizeObserverMock();
    setWindowSize(1024, 768);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    ro.uninstall();
    mm.uninstall();
  });

  it("breakpoint() exposes active breakpoint helpers and updates on resize", () => {
    const bp = breakpoint();
    const active = trackStore(bp);
    const isLg = trackStore(bp.is("lg"));
    const aboveMd = trackStore(bp.above("md"));
    const belowMd = trackStore(bp.below("md"));
    const between = trackStore(bp.between("sm", "xl"));

    expect(active.value.active).toBe("lg");
    expect(isLg.value).toBe(true);
    expect(aboveMd.value).toBe(true);
    expect(belowMd.value).toBe(false);
    expect(between.value).toBe(true);

    setWindowSize(400, 800);

    expect(active.value.active).toBe("xs");
    expect(isLg.value).toBe(false);
    expect(aboveMd.value).toBe(false);
    expect(belowMd.value).toBe(true);
    expect(between.value).toBe(false);

    between.unsubscribe();
    belowMd.unsubscribe();
    aboveMd.unsubscribe();
    isLg.unsubscribe();
    active.unsubscribe();
  });

  it("mediaQuery() and preference() react to matchMedia changes", () => {
    const dark = trackStore(mediaQuery("(prefers-color-scheme: dark)"));
    const reducedMotion = trackStore(preference("reducedMotion"));

    expect(dark.value).toBe(false);
    expect(reducedMotion.value).toBe(false);

    mm.set("(prefers-color-scheme: dark)", true);
    mm.set("(prefers-reduced-motion: reduce)", true);

    expect(dark.value).toBe(true);
    expect(reducedMotion.value).toBe(true);

    reducedMotion.unsubscribe();
    dark.unsubscribe();
  });

  it("viewport() reports width, height, and orientation", () => {
    const state = trackStore(viewport());

    expect(state.value.width).toBe(1024);
    expect(state.value.height).toBe(768);
    expect(state.value.orientation).toBe("landscape");

    setWindowSize(500, 900);

    expect(state.value.width).toBe(500);
    expect(state.value.height).toBe(900);
    expect(state.value.orientation).toBe("portrait");

    state.unsubscribe();
  });

  it("colorScheme() resolves system preference, override, and persistence", () => {
    mm.set("(prefers-color-scheme: dark)", true);
    const theme = colorScheme({ storageKey: "theme" });
    const scheme = trackStore(theme.scheme);
    const isDark = trackStore(theme.isDark);

    expect(scheme.value).toBe("dark");
    expect(isDark.value).toBe(true);

    theme.set("light");
    expect(scheme.value).toBe("light");
    expect(isDark.value).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");

    mm.set("(prefers-color-scheme: dark)", false);
    expect(scheme.value).toBe("light");

    theme.set(null);
    expect(scheme.value).toBe("light");
    expect(localStorage.getItem("theme")).toBeNull();

    isDark.unsubscribe();
    scheme.unsubscribe();
  });

  it("colorScheme() reads a persisted override on init", () => {
    localStorage.setItem("theme", "dark");
    const theme = colorScheme({ storageKey: "theme" });
    const scheme = trackStore(theme.scheme);

    expect(scheme.value).toBe("dark");

    scheme.unsubscribe();
  });

  it("containerQuery() tracks container width ranges", () => {
    const el = document.createElement("div");
    setElementSize(el, 320, 200);

    const matches = trackStore(containerQuery(el, { minPx: 300, maxPx: 600 }));
    expect(matches.value).toBe(true);

    setElementSize(el, 640, 200);
    ro.resize(el, { width: 640, height: 200 });
    expect(matches.value).toBe(false);

    matches.unsubscribe();
  });
});
