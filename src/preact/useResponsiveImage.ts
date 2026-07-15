import type { ResponsiveImageConfig } from "../core/images.js";
import { responsiveImage } from "../core/images.js";

/**
 * Preact hook for responsive `<img>` attributes.
 * Same surface as React `useResponsiveImage` — wraps core `responsiveImage`.
 */
export function useResponsiveImage(config: ResponsiveImageConfig): {
  srcSet: string;
  sizes: string;
  src: string;
  alt: string;
  loading: string;
} {
  return responsiveImage(config);
}
