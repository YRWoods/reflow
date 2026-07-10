"use client";

import { type RefObject, useEffect, useState } from "react";
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
 * SSR-safe container-query hook. Returns whether the element matches the
 * given range. Uses ResizeObserver under the hood with a frame-throttled
 * callback to avoid loop-limit errors.
 */
export function useContainerQuery(
  ref: RefObject<Element | null>,
  range: ContainerQueryRange,
  serverDefault = false,
  options: { debounce?: number; throttle?: number } = {},
): boolean {
  const [matches, setMatches] = useState<boolean>(serverDefault);
  const minPx = range.minPx;
  const maxPx = range.maxPx;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = { minPx, maxPx };
    setMatches(matchesContainerRange(getContainerSize(el), r));
    const unsub = observeContainer(
      el,
      (size) => {
        setMatches(matchesContainerRange(size, r));
      },
      options,
    );
    return unsub;
  }, [ref, minPx, maxPx, options]);

  return matches;
}

/** Get the current container size (re-rendering on changes). */
export function useContainerSize(
  ref: RefObject<Element | null>,
  serverDefault: ContainerSize = { width: 0, height: 0 },
  options: { debounce?: number; throttle?: number } = {},
): ContainerSize {
  const [size, setSize] = useState<ContainerSize>(serverDefault);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setSize(getContainerSize(el));
    return observeContainer(el, setSize, options);
  }, [ref, options]);
  return size;
}
