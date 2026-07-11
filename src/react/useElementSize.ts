"use client";

import { type RefObject, useEffect, useState } from "react";
import { type ContainerSize, getContainerSize, observeContainer } from "../core/container.js";

export type UseElementSizeResult = { width: number; height: number };

const DEFAULT_SIZE: UseElementSizeResult = { width: 0, height: 0 };

export function useElementSize(
  ref: RefObject<Element | null>,
  serverDefault: UseElementSizeResult = DEFAULT_SIZE,
  options: { debounce?: number; throttle?: number } = {},
): UseElementSizeResult {
  const [size, setSize] = useState<UseElementSizeResult>(serverDefault);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setSize(getContainerSize(el));
    const unsub = observeContainer(
      el,
      (s: ContainerSize) => setSize({ width: s.width, height: s.height }),
      options,
    );
    return unsub;
  }, [ref, options]);

  return size;
}
