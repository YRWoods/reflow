import { mq, watchMedia } from "./media.js";

export interface PointerCapabilities {
  /** Primary pointer can hover. */
  hover: boolean;
  /** Any pointer can hover (multi-input devices). */
  anyHover: boolean;
  /** Primary pointer is coarse (touch). */
  coarse: boolean;
  /** Primary pointer is fine (mouse). */
  fine: boolean;
  /** No pointer at all. */
  none: boolean;
}

export function getPointerCapabilities(): PointerCapabilities {
  return {
    hover: watchMedia(mq.hover).matches(),
    anyHover: watchMedia(mq.anyHover).matches(),
    coarse: watchMedia(mq.coarseCursor).matches(),
    fine: watchMedia(mq.fineCursor).matches(),
    none: watchMedia(mq.noPointer).matches(),
  };
}

export function observePointerCapabilities(
  listener: (caps: PointerCapabilities) => void,
): () => void {
  const queries = [mq.hover, mq.anyHover, mq.coarseCursor, mq.fineCursor, mq.noPointer];
  const unsubs = queries.map((q) =>
    watchMedia(q).subscribe(() => listener(getPointerCapabilities())),
  );
  return () => {
    for (const u of unsubs) u();
  };
}
