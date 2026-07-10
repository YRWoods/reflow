import { type Ref, getCurrentInstance, onMounted, onUnmounted, readonly, ref, watch } from "vue";
import {
  type ContainerSize,
  getContainerSize,
  matchesContainerRange,
  observeContainer,
} from "../core/container.js";

export interface ContainerQueryRange {
  minPx?: number;
  maxPx?: number;
}

/**
 * SSR-safe container query composable. Pass a template ref.
 */
export function useContainerQuery(
  elRef: Ref<Element | null>,
  range: ContainerQueryRange,
  serverDefault = false,
  options: { debounce?: number; throttle?: number } = {},
): Readonly<Ref<boolean>> {
  const matches = ref(serverDefault);

  if (getCurrentInstance()) {
    let unsub: (() => void) | undefined;
    const startObserving = () => {
      unsub?.();
      unsub = undefined;

      const el = elRef.value;
      if (!el) return;

      const currentRange = { minPx: range.minPx, maxPx: range.maxPx };
      matches.value = matchesContainerRange(getContainerSize(el), currentRange);
      unsub = observeContainer(
        el,
        (size) => {
          matches.value = matchesContainerRange(size, currentRange);
        },
        options,
      );
    };

    onMounted(startObserving);
    watch(elRef, startObserving);
    onUnmounted(() => {
      unsub?.();
    });
  }

  return readonly(matches);
}

/**
 * Get the current container size reactively.
 */
export function useContainerSize(
  elRef: Ref<Element | null>,
  serverDefault: ContainerSize = { width: 0, height: 0 },
  options: { debounce?: number; throttle?: number } = {},
): { readonly width: Ref<number>; readonly height: Ref<number> } {
  const width = ref(serverDefault.width);
  const height = ref(serverDefault.height);

  if (getCurrentInstance()) {
    let unsub: (() => void) | undefined;
    const startObserving = () => {
      unsub?.();
      unsub = undefined;

      const el = elRef.value;
      if (!el) return;

      const size = getContainerSize(el);
      width.value = size.width;
      height.value = size.height;
      unsub = observeContainer(
        el,
        (nextSize) => {
          width.value = nextSize.width;
          height.value = nextSize.height;
        },
        options,
      );
    };

    onMounted(startObserving);
    watch(elRef, startObserving);
    onUnmounted(() => {
      unsub?.();
    });
  }

  return { width: readonly(width), height: readonly(height) };
}
