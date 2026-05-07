import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

// Make requestAnimationFrame synchronous so resize-driven re-renders flush
// inside `act()` calls without waiting on real animation frames.
beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback): number => {
    cb(performance.now());
    return 0;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
