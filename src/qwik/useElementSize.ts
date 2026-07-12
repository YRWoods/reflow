import { type Signal, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { type ContainerSize, getContainerSize, observeContainer } from "../core/container.js";

export type UseElementSizeResult = { width: number; height: number };

const DEFAULT_SIZE: UseElementSizeResult = { width: 0, height: 0 };

export function useElementSize(
  ref: { current: Element | null },
  serverDefault: UseElementSizeResult = DEFAULT_SIZE,
  options: { debounce?: number; throttle?: number } = {},
): Signal<UseElementSizeResult> {
  const size = useSignal<UseElementSizeResult>(serverDefault);

  useVisibleTask$(({ cleanup }) => {
    const el = ref.current;
    if (!el) return;
    size.value = getContainerSize(el);
    const unsub = observeContainer(
      el,
      (s: ContainerSize) => { size.value = { width: s.width, height: s.height }; },
      options,
    );
    cleanup(unsub);
  });

  return size;
}
