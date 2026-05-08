import { act, renderHook } from "@testing-library/react";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useColorScheme } from "../src/react";
import { type MatchMediaMockController, installMatchMediaMock } from "../src/testing";

describe("useColorScheme", () => {
  let mm: MatchMediaMockController;

  beforeEach(() => {
    mm = installMatchMediaMock();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();

    const { result, unmount } = renderHook(() => useColorScheme());
    act(() => {
      result.current.setColorScheme(null);
    });
    unmount();

    localStorage.clear();
    mm.uninstall();
  });

  it("returns light when there is no system preference", () => {
    const { result } = renderHook(() => useColorScheme());

    expect(result.current.colorScheme).toBe("light");
    expect(result.current.isDark).toBe(false);
  });

  it("returns dark when the system prefers dark", () => {
    mm.set("(prefers-color-scheme: dark)", true);

    const { result } = renderHook(() => useColorScheme());

    expect(result.current.colorScheme).toBe("dark");
    expect(result.current.isDark).toBe(true);
  });

  it("uses serverDefault during SSR", () => {
    const App = () => {
      const { colorScheme, isDark } = useColorScheme({ serverDefault: "dark" });
      return React.createElement("span", null, `${colorScheme}:${String(isDark)}`);
    };

    expect(renderToString(React.createElement(App))).toContain("dark:true");
  });

  it("setColorScheme() overrides the system preference", () => {
    const { result } = renderHook(() => useColorScheme());

    expect(result.current.colorScheme).toBe("light");

    act(() => {
      result.current.setColorScheme("dark");
    });

    expect(result.current.colorScheme).toBe("dark");
    expect(result.current.isDark).toBe(true);

    act(() => {
      mm.set("(prefers-color-scheme: dark)", false);
    });

    expect(result.current.colorScheme).toBe("dark");
  });

  it("setColorScheme(null) clears the override and reverts to system", () => {
    mm.set("(prefers-color-scheme: dark)", true);
    const { result } = renderHook(() => useColorScheme({ storageKey: "theme" }));

    expect(result.current.colorScheme).toBe("dark");

    act(() => {
      result.current.setColorScheme("light");
    });

    expect(result.current.colorScheme).toBe("light");

    act(() => {
      result.current.setColorScheme(null);
    });

    expect(result.current.colorScheme).toBe("dark");
    expect(result.current.isDark).toBe(true);
  });

  it("computes isDark from the resolved scheme", () => {
    const { result } = renderHook(() => useColorScheme());

    expect(result.current.isDark).toBe(false);

    act(() => {
      result.current.setColorScheme("dark");
    });

    expect(result.current.colorScheme).toBe("dark");
    expect(result.current.isDark).toBe(true);
  });

  it("persists overrides to localStorage when storageKey is provided", () => {
    const setItemSpy = vi.spyOn(localStorage, "setItem");
    const { result } = renderHook(() => useColorScheme({ storageKey: "theme" }));

    act(() => {
      result.current.setColorScheme("dark");
    });

    expect(localStorage.getItem("theme")).toBe("dark");
    expect(setItemSpy).toHaveBeenCalledWith("theme", "dark");
  });

  it("reads a persisted override from localStorage on init", () => {
    localStorage.setItem("theme", "dark");

    const { result } = renderHook(() => useColorScheme({ storageKey: "theme" }));

    expect(result.current.colorScheme).toBe("dark");
    expect(result.current.isDark).toBe(true);
  });

  it("does not touch localStorage when storageKey is omitted", () => {
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
    const removeItemSpy = vi.spyOn(Storage.prototype, "removeItem");
    const { result } = renderHook(() => useColorScheme());

    act(() => {
      result.current.setColorScheme("dark");
      result.current.setColorScheme(null);
    });

    expect(getItemSpy).not.toHaveBeenCalled();
    expect(setItemSpy).not.toHaveBeenCalled();
    expect(removeItemSpy).not.toHaveBeenCalled();
  });

  it("handles localStorage errors gracefully", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });

    expect(() => renderHook(() => useColorScheme({ storageKey: "theme" }))).not.toThrow();

    const { result } = renderHook(() => useColorScheme({ storageKey: "theme" }));

    expect(result.current.colorScheme).toBe("light");

    expect(() => {
      act(() => {
        result.current.setColorScheme("dark");
      });
    }).not.toThrow();
    expect(result.current.colorScheme).toBe("dark");

    expect(() => {
      act(() => {
        result.current.setColorScheme(null);
      });
    }).not.toThrow();
    expect(result.current.colorScheme).toBe("light");
  });
});
