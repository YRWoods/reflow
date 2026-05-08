import { mq } from "../core/media.js";
import type { PreferenceKey } from "../core/preferences.js";
import { mediaQuery } from "./mediaQuery.js";

const QUERY_BY_KEY: Record<PreferenceKey, string> = {
  reducedMotion: mq.prefersReducedMotion,
  reducedData: mq.prefersReducedData,
  moreContrast: mq.prefersMoreContrast,
  lessContrast: mq.prefersLessContrast,
  forcedColors: mq.forcedColors,
  invertedColors: mq.invertedColors,
  dark: mq.prefersDark,
  light: mq.prefersLight,
};

/**
 * SSR-safe user preference store.
 */
export function preference(key: PreferenceKey, serverDefault = false) {
  return mediaQuery(QUERY_BY_KEY[key], serverDefault);
}
