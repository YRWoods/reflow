import { readable } from "svelte/store";
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
 * Container query store. Pass a DOM element.
 */
export function containerQuery(el: Element, range: ContainerQueryRange, serverDefault = false) {
  return readable(serverDefault, (set) => {
    if (typeof window === "undefined") return;
    const resolvedRange = { minPx: range.minPx, maxPx: range.maxPx };
    set(matchesContainerRange(getContainerSize(el), resolvedRange));
    return observeContainer(el, (size) => {
      set(matchesContainerRange(size, resolvedRange));
    });
  });
}

/**
 * Container size store.
 */
export function containerSize(el: Element, serverDefault: ContainerSize = { width: 0, height: 0 }) {
  return readable<ContainerSize>(serverDefault, (set) => {
    if (typeof window === "undefined") return;
    set(getContainerSize(el));
    return observeContainer(el, set);
  });
}
