"use client";

import { useCallback, useSyncExternalStore } from "react";
import { type SafeAreaInsets, getSafeArea, observeSafeArea } from "../core/safe-area.js";

const ZERO: SafeAreaInsets = { top: 0, right: 0, bottom: 0, left: 0 };

export function useSafeArea(serverDefault: SafeAreaInsets = ZERO): SafeAreaInsets {
  const subscribe = useCallback((onChange: () => void) => observeSafeArea(() => onChange()), []);
  return useSyncExternalStore(subscribe, getSafeArea, () => serverDefault);
}
