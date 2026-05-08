import { mq } from "../core/media.js";
import { mediaQuery } from "./mediaQuery.js";

export interface PointerInfo {
  hover: boolean;
  anyHover: boolean;
  coarse: boolean;
  fine: boolean;
}

/**
 * Pointer capabilities stores. SSR-safe.
 */
export function pointer(serverDefault?: Partial<PointerInfo>) {
  return {
    hover: mediaQuery(mq.hover, serverDefault?.hover ?? true),
    anyHover: mediaQuery(mq.anyHover, serverDefault?.anyHover ?? true),
    coarse: mediaQuery(mq.coarseCursor, serverDefault?.coarse ?? false),
    fine: mediaQuery(mq.fineCursor, serverDefault?.fine ?? true),
  };
}
