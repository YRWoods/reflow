import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type Plugin, createApp, defineComponent, h, nextTick, ref } from "vue";
import {
  type MatchMediaMockController,
  type ResizeObserverMockController,
  installMatchMediaMock,
  installResizeObserverMock,
  setWindowSize,
} from "../src/testing";
import {
  createFluidityPlugin,
  useBreakpoint,
  useColorScheme,
  useContainerQuery,
  useMediaQuery,
  usePreference,
  useViewport,
} from "../src/vue";

type MountedComposable<T> = {
  result: T;
  unmount: () => void;
};

const mountedApps: Array<() => void> = [];

async function mountComposable<T>(
  setupFactory: () => T,
  options: { plugin?: Plugin; render?: (result: T) => ReturnType<typeof h> } = {},
): Promise<MountedComposable<T>> {
  let result!: T;
  const host = document.createElement("div");
  document.body.appendChild(host);

  const Root = defineComponent({
    setup() {
      result = setupFactory();
      return () => options.render?.(result) ?? h("div");
    },
  });

  const app = createApp(Root);
  if (options.plugin) app.use(options.plugin);
  app.mount(host);
  await nextTick();

  const unmount = () => {
    app.unmount();
    host.remove();
  };

  mountedApps.push(unmount);
  return { result, unmount };
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

describe("Vue adapter", () => {
  let mm: MatchMediaMockController;
  let ro: ResizeObserverMockController;

  beforeEach(() => {
    mm = installMatchMediaMock();
    ro = installResizeObserverMock();
    setWindowSize(1024, 768);
    localStorage.clear();
  });

  afterEach(async () => {
    while (mountedApps.length > 0) {
      mountedApps.pop()?.();
    }

    const reset = await mountComposable(() => useColorScheme());
    reset.result.setColorScheme(null);
    reset.unmount();

    vi.restoreAllMocks();
    localStorage.clear();
    ro.uninstall();
    mm.uninstall();
  });

  it("useBreakpoint() reports the active breakpoint and updates on resize", async () => {
    const { result } = await mountComposable(() => useBreakpoint(), {
      plugin: createFluidityPlugin({ serverWidth: 1024, serverHeight: 768 }),
    });

    expect(result.active.value).toBe("lg");
    expect(result.is("lg")).toBe(true);
    expect(result.above("md")).toBe(true);
    expect(result.below("xl")).toBe(true);
    expect(result.between("sm", "xl")).toBe(true);

    setWindowSize(400, 800);
    await nextTick();

    expect(result.active.value).toBe("xs");
    expect(result.is("xs")).toBe(true);
    expect(result.above("md")).toBe(false);
    expect(result.below("md")).toBe(true);
  });

  it("useMediaQuery() and usePreference() react to matchMedia changes", async () => {
    const { result } = await mountComposable(() => ({
      dark: useMediaQuery("(prefers-color-scheme: dark)"),
      reducedMotion: usePreference("reducedMotion"),
    }));

    expect(result.dark.value).toBe(false);
    expect(result.reducedMotion.value).toBe(false);

    mm.set("(prefers-color-scheme: dark)", true);
    mm.set("(prefers-reduced-motion: reduce)", true);
    await nextTick();

    expect(result.dark.value).toBe(true);
    expect(result.reducedMotion.value).toBe(true);
  });

  it("useViewport() reflects the current window size", async () => {
    const { result } = await mountComposable(() => useViewport(), {
      plugin: createFluidityPlugin({ serverWidth: 1024, serverHeight: 768 }),
    });

    expect(result.width.value).toBe(1024);
    expect(result.height.value).toBe(768);
    expect(result.orientation.value).toBe("landscape");

    setWindowSize(500, 900);
    await nextTick();

    expect(result.width.value).toBe(500);
    expect(result.height.value).toBe(900);
    expect(result.orientation.value).toBe("portrait");
  });

  it("useColorScheme() resolves system preference, override, and localStorage", async () => {
    mm.set("(prefers-color-scheme: dark)", true);
    const { result } = await mountComposable(() => useColorScheme({ storageKey: "theme" }));

    expect(result.colorScheme.value).toBe("dark");
    expect(result.isDark.value).toBe(true);

    result.setColorScheme("light");
    await nextTick();

    expect(result.colorScheme.value).toBe("light");
    expect(result.isDark.value).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");

    mm.set("(prefers-color-scheme: dark)", false);
    await nextTick();
    expect(result.colorScheme.value).toBe("light");

    result.setColorScheme(null);
    await nextTick();

    expect(result.colorScheme.value).toBe("light");
    expect(localStorage.getItem("theme")).toBeNull();
  });

  it("useColorScheme() reads a persisted override on init", async () => {
    localStorage.setItem("theme", "dark");

    const { result } = await mountComposable(() => useColorScheme({ storageKey: "theme" }));

    expect(result.colorScheme.value).toBe("dark");
    expect(result.isDark.value).toBe(true);
  });

  it("useContainerQuery() tracks container width ranges", async () => {
    const { result } = await mountComposable(
      () => {
        const el = ref<Element | null>(null);
        return {
          el,
          matches: useContainerQuery(el, { minPx: 300, maxPx: 600 }),
        };
      },
      {
        render: ({ el }) => h("div", { ref: el }),
      },
    );

    const el = result.el.value;
    expect(el).not.toBeNull();
    if (!el) throw new Error("container element was not mounted");

    setElementSize(el, 320, 200);
    ro.resize(el, { width: 320, height: 200 });
    await nextTick();
    expect(result.matches.value).toBe(true);

    setElementSize(el, 640, 200);
    ro.resize(el, { width: 640, height: 200 });
    await nextTick();
    expect(result.matches.value).toBe(false);
  });
});
