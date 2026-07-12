import { type Signal, useComputed$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { type ContainerSize, getContainerSize, observeContainer } from "../core/container.js";

type ElementTarget = Signal<Element | null | undefined>;

export type UseElementSizeResult = { width: number; height: number };

export function useElementSize(
  target: ElementTarget,
  serverDefault: UseElementSizeResult = { width: 0, height: 0 },
  options: { debounce?: number; throttle?: number } = {},
): { width: Signal<number>; height: Signal<number> } {
  const size = useSignal<ContainerSize>({ ...serverDefault });

  useVisibleTask$(({ track, cleanup }) => {
    const element = track(() => target.value);

    if (!element) {
      size.value = { ...serverDefault };
      return;
    }

    size.value = getContainerSize(element);
    const unsubscribe = observeContainer(element, (nextSize) => {
      size.value = nextSize;
    }, options);

    cleanup(unsubscribe);
  });

  return {
    width: useComputed$(() => size.value.width),
    height: useComputed$(() => size.value.height),
  };
}
