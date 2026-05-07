"use client";

import { mq } from "../core/media.js";
import type { PreferenceKey } from "../core/preferences.js";
import { useMediaQuery } from "./useMediaQuery.js";

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

export function usePreference(key: PreferenceKey, serverDefault = false): boolean {
  return useMediaQuery(QUERY_BY_KEY[key], serverDefault);
}
