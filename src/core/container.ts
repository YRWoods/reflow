/**
 * Element-level container observation using ResizeObserver, with a
 * loop-error guard (wraps callbacks in rAF so reads & writes don't trigger
 * "ResizeObserver loop limit exceeded" in the same frame).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
 */
export interface ContainerSize {
  width: number;
  height: number;
}

const isBrowser = (): boolean => typeof window !== "undefined";

export function observeContainer(
  target: Element,
  listener: (size: ContainerSize) => void,
): () => void {
  if (!isBrowser() || typeof ResizeObserver === "undefined") return () => {};

  let scheduled = false;
  let pending: ContainerSize | null = null;

  const fire = () => {
    scheduled = false;
    if (pending) {
      const s = pending;
      pending = null;
      listener(s);
    }
  };

  const ro = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    // Prefer borderBoxSize when available; fall back to contentRect.
    let width: number;
    let height: number;
    const box = entry.borderBoxSize;
    if (box && box.length > 0) {
      const b = box[0]!;
      width = b.inlineSize;
      height = b.blockSize;
    } else {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
    }
    pending = { width, height };
    if (scheduled) return;
    scheduled = true;
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(fire);
    else setTimeout(fire, 0);
  });

  ro.observe(target);
  return () => ro.disconnect();
}

/** Snapshot a container's current size (sync). */
export function getContainerSize(target: Element): ContainerSize {
  const rect = target.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

/** Match a container width against a min/max range. */
export function matchesContainerRange(
  size: ContainerSize,
  range: { minPx?: number; maxPx?: number },
): boolean {
  if (range.minPx !== undefined && size.width < range.minPx) return false;
  if (range.maxPx !== undefined && size.width >= range.maxPx) return false;
  return true;
}
