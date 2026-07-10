import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createBreakpoints, defaultBreakpoints } from "../src/core/breakpoints";
import { getContainerSize, matchesContainerRange, observeContainer } from "../src/core/container";
import { watchMedia } from "../src/core/media";
import { createFluidityStore } from "../src/core/store";
import { getViewport, observeViewport } from "../src/core/viewport";
import { installMatchMediaMock, installResizeObserverMock, setWindowSize } from "../src/testing";

interface MockMatchMedia {
  set: (query: string, matches: boolean) => void;
  uninstall: () => void;
}

interface MockResizeObserver {
  resize: (el: Element, size: { width: number; height: number }) => void;
  uninstall: () => void;
}

describe("qwik adapter (core integration)", () => {
  let mm: MockMatchMedia;
  let ro: MockResizeObserver;

  beforeEach(() => {
    mm = installMatchMediaMock();
    ro = installResizeObserverMock();
    setWindowSize(1024, 768);
  });

  afterEach(() => {
    mm.uninstall();
    ro.uninstall();
  });

  it("useViewport core: getViewport returns correct dimensions", () => {
    const vp = getViewport();
    expect(vp.width).toBe(1024);
    expect(vp.height).toBe(768);
    expect(vp.orientation).toBe("landscape");
  });

  it("useViewport core: observeViewport fires on resize", () => {
    const calls: Array<{ width: number; height: number; orientation: string }> = [];
    const unsub = observeViewport((s) => calls.push(s));
    setWindowSize(500, 800);
    expect(calls.length).toBeGreaterThanOrEqual(1);
    expect(calls[calls.length - 1]!.width).toBe(500);
    expect(calls[calls.length - 1]!.orientation).toBe("portrait");
    unsub();
  });

  it("useMediaQuery core: watchMedia responds to changes", () => {
    const watcher = watchMedia("(prefers-color-scheme: dark)");
    expect(watcher.matches()).toBe(false);

    const calls: boolean[] = [];
    const unsub = watcher.subscribe((v) => calls.push(v));

    mm.set("(prefers-color-scheme: dark)", true);
    expect(calls).toEqual([true]);
    expect(watcher.matches()).toBe(true);

    unsub();
  });

  it("useBreakpoint core: store resolves correct active breakpoint", () => {
    const system = createBreakpoints(defaultBreakpoints);
    const store = createFluidityStore(system, { initialWidth: 1024, initialHeight: 768 });
    const snap = store.getSnapshot();
    expect(snap.active).toBe("lg");
  });

  it("useBreakpoint core: store updates on resize", () => {
    const system = createBreakpoints(defaultBreakpoints);
    const store = createFluidityStore(system, { initialWidth: 1024, initialHeight: 768 });

    const calls: string[] = [];
    const unsub = store.subscribe(() => {
      calls.push(store.getSnapshot().active);
    });

    setWindowSize(400, 800);
    expect(calls.length).toBeGreaterThanOrEqual(1);
    expect(calls[calls.length - 1]!).toBe("xs");

    unsub();
  });

  it("useContainerQuery core: observeContainer + matchesContainerRange", async () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    const calls: boolean[] = [];
    const unsub = observeContainer(el, (size) => {
      calls.push(matchesContainerRange(size, { minPx: 500 }));
    });

    ro.resize(el, { width: 600, height: 400 });
    await new Promise((r) => setTimeout(r, 50));
    expect(calls[calls.length - 1]!).toBe(true);

    ro.resize(el, { width: 300, height: 200 });
    await new Promise((r) => setTimeout(r, 50));
    expect(calls[calls.length - 1]!).toBe(false);

    unsub();
    document.body.removeChild(el);
  });

  it("useContainerQuery core: getContainerSize returns element dimensions", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    el.getBoundingClientRect = () =>
      ({
        width: 800,
        height: 600,
        top: 0,
        left: 0,
        right: 800,
        bottom: 600,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    const size = getContainerSize(el);
    expect(size.width).toBe(800);
    expect(size.height).toBe(600);

    document.body.removeChild(el);
  });

  it("useViewport core: server snapshot returns provided values", () => {
    const system = createBreakpoints(defaultBreakpoints);
    const store = createFluidityStore(system, { initialWidth: 0, initialHeight: 0 });
    store.setServerSnapshot({ width: 0, height: 0 });
    const snap = store.getServerSnapshot();
    expect(snap.width).toBe(0);
    expect(snap.height).toBe(0);
  });
});
