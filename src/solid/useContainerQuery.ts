import { type Accessor, createEffect, createSignal, onCleanup, onMount } from "solid-js";
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

type ContainerTarget = Element | null | undefined;
type MaybeAccessor<T> = T | Accessor<T>;

function resolveTarget(target: MaybeAccessor<ContainerTarget>) {
  return typeof target === "function" ? (target as Accessor<ContainerTarget>)() : target;
}

export function useContainerQuery(
  target: MaybeAccessor<ContainerTarget>,
  range: ContainerQueryRange,
  serverDefault = false,
  options: { debounce?: number; throttle?: number } = {},
): Accessor<boolean> {
  const [matches, setMatches] = createSignal(serverDefault);

  onMount(() => {
    createEffect(() => {
      const element = resolveTarget(target);
      const currentRange = { minPx: range.minPx, maxPx: range.maxPx };

      if (!element) {
        setMatches(serverDefault);
        return;
      }

      setMatches(matchesContainerRange(getContainerSize(element), currentRange));
      const unsubscribe = observeContainer(
        element,
        (size) => {
          setMatches(matchesContainerRange(size, currentRange));
        },
        options,
      );

      onCleanup(unsubscribe);
    });
  });

  return matches;
}

export interface UseContainerSizeResult {
  size: Accessor<ContainerSize>;
  width: Accessor<number>;
  height: Accessor<number>;
}

export function useContainerSize(
  target: MaybeAccessor<ContainerTarget>,
  serverDefault: ContainerSize = { width: 0, height: 0 },
  options: { debounce?: number; throttle?: number } = {},
): UseContainerSizeResult {
  const [size, setSize] = createSignal(serverDefault);

  onMount(() => {
    createEffect(() => {
      const element = resolveTarget(target);

      if (!element) {
        setSize(serverDefault);
        return;
      }

      setSize(getContainerSize(element));
      const unsubscribe = observeContainer(
        element,
        (nextSize) => {
          setSize(nextSize);
        },
        options,
      );

      onCleanup(unsubscribe);
    });
  });

  return {
    size,
    width: () => size().width,
    height: () => size().height,
  };
}
