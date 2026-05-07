import { act, render, renderHook, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  Hide,
  ResponsiveProvider,
  Show,
  useBreakpoint,
  useMediaQuery,
  usePreference,
  useViewport,
} from "../src/react";
import {
  type MatchMediaMockController,
  installMatchMediaMock,
  setWindowSize,
} from "../src/testing";

describe("React adapter", () => {
  let mm: MatchMediaMockController;

  beforeEach(() => {
    mm = installMatchMediaMock();
    setWindowSize(1024, 768);
  });
  afterEach(() => {
    mm.uninstall();
  });

  it("useBreakpoint() returns active key + helpers", () => {
    const { result } = renderHook(() => useBreakpoint(), {
      wrapper: ({ children }) => (
        <ResponsiveProvider serverWidth={1024} serverHeight={768}>
          {children}
        </ResponsiveProvider>
      ),
    });
    expect(result.current.active).toBe("lg");
    expect(result.current.is("lg")).toBe(true);
    expect(result.current.above("md")).toBe(true);
    expect(result.current.below("xl")).toBe(true);
    expect(result.current.between("sm", "xl")).toBe(true);
  });

  it("useBreakpoint() updates on resize", () => {
    const { result } = renderHook(() => useBreakpoint(), {
      wrapper: ({ children }) => (
        <ResponsiveProvider serverWidth={1024} serverHeight={768}>
          {children}
        </ResponsiveProvider>
      ),
    });
    expect(result.current.active).toBe("lg");
    act(() => setWindowSize(400, 800));
    expect(result.current.active).toBe("xs");
    act(() => setWindowSize(800, 600));
    expect(result.current.active).toBe("md");
  });

  it("useViewport() reflects window dimensions", () => {
    const { result } = renderHook(() => useViewport(), {
      wrapper: ({ children }) => <ResponsiveProvider>{children}</ResponsiveProvider>,
    });
    act(() => setWindowSize(800, 600));
    expect(result.current.width).toBe(800);
    expect(result.current.height).toBe(600);
    expect(result.current.orientation).toBe("landscape");
  });

  it("useMediaQuery() flips when match-media mock changes", () => {
    const { result } = renderHook(() => useMediaQuery("(prefers-color-scheme: dark)"));
    expect(result.current).toBe(false);
    act(() => mm.set("(prefers-color-scheme: dark)", true));
    expect(result.current).toBe(true);
  });

  it("usePreference() reflects reducedMotion", () => {
    const { result } = renderHook(() => usePreference("reducedMotion"));
    expect(result.current).toBe(false);
    act(() => mm.set("(prefers-reduced-motion: reduce)", true));
    expect(result.current).toBe(true);
  });

  it("<Show on=...> renders only at matching breakpoint", () => {
    setWindowSize(400, 800);
    render(
      <ResponsiveProvider serverWidth={400} serverHeight={800}>
        <Show on="xs">small</Show>
        <Show above="md">desktop</Show>
      </ResponsiveProvider>,
    );
    expect(screen.queryByText("small")).not.toBeNull();
    expect(screen.queryByText("desktop")).toBeNull();
  });

  it("<Show below=...> with fallback renders fallback above", () => {
    setWindowSize(1024, 768);
    render(
      <ResponsiveProvider serverWidth={1024} serverHeight={768}>
        <Show below="md" fallback={<span>desktop</span>}>
          <span>mobile</span>
        </Show>
      </ResponsiveProvider>,
    );
    expect(screen.queryByText("desktop")).not.toBeNull();
    expect(screen.queryByText("mobile")).toBeNull();
  });

  it("<Hide above=...> hides on desktop", () => {
    setWindowSize(1024, 768);
    render(
      <ResponsiveProvider serverWidth={1024} serverHeight={768}>
        <Hide above="md">mobile</Hide>
      </ResponsiveProvider>,
    );
    expect(screen.queryByText("mobile")).toBeNull();
  });

  it("works without a provider via ambient store", () => {
    const { result } = renderHook(() => useViewport());
    expect(typeof result.current.width).toBe("number");
  });
});
