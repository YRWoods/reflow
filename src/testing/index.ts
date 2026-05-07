/**
 * Testing helpers for downstream consumers and our own test suite.
 * Mock implementations of `window.matchMedia` and `ResizeObserver` for
 * jsdom / happy-dom environments.
 */

interface MockMediaQueryList {
  matches: boolean;
  media: string;
  onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => void) | null;
  addEventListener(type: "change", listener: (e: MediaQueryListEvent) => void): void;
  removeEventListener(type: "change", listener: (e: MediaQueryListEvent) => void): void;
  addListener(listener: (e: MediaQueryListEvent) => void): void;
  removeListener(listener: (e: MediaQueryListEvent) => void): void;
  dispatchEvent(event: Event): boolean;
}

export interface MatchMediaMockController {
  /** Set whether a query currently matches; fires change events. */
  set(query: string, matches: boolean): void;
  /** Drop all current matchers and listeners. */
  reset(): void;
  /** Restore the original `window.matchMedia`. */
  uninstall(): void;
}

/**
 * Install a controllable `matchMedia` mock onto `window`. Returns a
 * controller you can use to flip query results in tests.
 */
export function installMatchMediaMock(
  initial: Record<string, boolean> = {},
): MatchMediaMockController {
  if (typeof window === "undefined") {
    throw new Error("installMatchMediaMock: requires a DOM environment");
  }
  const state = new Map<string, boolean>(Object.entries(initial));
  const lists = new Map<string, MockMediaQueryList[]>();
  const listeners = new Map<MockMediaQueryList, Set<(e: MediaQueryListEvent) => void>>();
  const original = (window as unknown as { matchMedia?: typeof window.matchMedia }).matchMedia;

  const make = (query: string): MockMediaQueryList => {
    const mql: MockMediaQueryList = {
      get matches() {
        return state.get(query) ?? false;
      },
      media: query,
      onchange: null,
      addEventListener(type, listener) {
        if (type !== "change") return;
        let set = listeners.get(this);
        if (!set) {
          set = new Set();
          listeners.set(this, set);
        }
        set.add(listener);
      },
      removeEventListener(type, listener) {
        if (type !== "change") return;
        listeners.get(this)?.delete(listener);
      },
      addListener(listener) {
        this.addEventListener("change", listener);
      },
      removeListener(listener) {
        this.removeEventListener("change", listener);
      },
      dispatchEvent: () => true,
    };
    return mql;
  };

  (window as unknown as { matchMedia: (q: string) => MockMediaQueryList }).matchMedia = (
    query: string,
  ) => {
    const arr = lists.get(query) ?? [];
    const mql = make(query);
    arr.push(mql);
    lists.set(query, arr);
    return mql;
  };

  return {
    set(query, matches) {
      state.set(query, matches);
      const arr = lists.get(query) ?? [];
      for (const mql of arr) {
        const set = listeners.get(mql);
        if (!set) continue;
        const event = { matches, media: query } as unknown as MediaQueryListEvent;
        for (const l of set) l(event);
      }
    },
    reset() {
      state.clear();
      lists.clear();
      listeners.clear();
    },
    uninstall() {
      if (original) {
        (window as unknown as { matchMedia: typeof window.matchMedia }).matchMedia = original;
      } else {
        (window as unknown as { matchMedia?: typeof window.matchMedia }).matchMedia = undefined;
      }
    },
  };
}

export interface ResizeObserverMockController {
  /** Trigger a resize for a given element. */
  resize(target: Element, contentRect: Partial<DOMRectReadOnly>): void;
  uninstall(): void;
}

/**
 * Install a controllable `ResizeObserver` mock. Use `resize(el, rect)` to
 * fire observation callbacks.
 */
export function installResizeObserverMock(): ResizeObserverMockController {
  if (typeof window === "undefined") {
    throw new Error("installResizeObserverMock: requires a DOM environment");
  }
  const observers = new Map<Element, Set<(entry: ResizeObserverEntry) => void>>();
  const original = (window as unknown as { ResizeObserver?: typeof ResizeObserver }).ResizeObserver;

  class Mock {
    private targets = new Set<Element>();
    private cb: (entries: ResizeObserverEntry[]) => void;
    constructor(cb: (entries: ResizeObserverEntry[]) => void) {
      this.cb = cb;
    }
    observe(target: Element) {
      this.targets.add(target);
      let set = observers.get(target);
      if (!set) {
        set = new Set();
        observers.set(target, set);
      }
      set.add((entry) => this.cb([entry]));
    }
    unobserve(target: Element) {
      this.targets.delete(target);
      observers.delete(target);
    }
    disconnect() {
      for (const t of this.targets) observers.delete(t);
      this.targets.clear();
    }
  }

  (window as unknown as { ResizeObserver: typeof ResizeObserver }).ResizeObserver =
    Mock as unknown as typeof ResizeObserver;
  (globalThis as unknown as { ResizeObserver?: typeof ResizeObserver }).ResizeObserver =
    Mock as unknown as typeof ResizeObserver;

  return {
    resize(target, rect) {
      const set = observers.get(target);
      if (!set) return;
      const contentRect = {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        ...rect,
        toJSON() {
          return this;
        },
      } as DOMRectReadOnly;
      const entry = {
        target,
        contentRect,
        borderBoxSize: [{ inlineSize: contentRect.width, blockSize: contentRect.height }],
        contentBoxSize: [{ inlineSize: contentRect.width, blockSize: contentRect.height }],
        devicePixelContentBoxSize: [
          { inlineSize: contentRect.width, blockSize: contentRect.height },
        ],
      } as unknown as ResizeObserverEntry;
      for (const cb of set) cb(entry);
    },
    uninstall() {
      if (original) {
        (window as unknown as { ResizeObserver: typeof ResizeObserver }).ResizeObserver = original;
      } else {
        (window as unknown as { ResizeObserver?: typeof ResizeObserver }).ResizeObserver =
          undefined;
      }
    },
  };
}

/** Resize the JSDOM/happy-dom window and dispatch a resize event. */
export function setWindowSize(width: number, height: number): void {
  if (typeof window === "undefined") return;
  Object.defineProperty(window, "innerWidth", { value: width, writable: true, configurable: true });
  Object.defineProperty(window, "innerHeight", {
    value: height,
    writable: true,
    configurable: true,
  });
  window.dispatchEvent(new Event("resize"));
}
