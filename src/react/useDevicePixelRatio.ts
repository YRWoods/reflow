"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getDevicePixelRatio, observeDevicePixelRatio } from "../core/dpr.js";

export function useDevicePixelRatio(serverDefault = 1): number {
  const subscribe = useCallback(
    (onChange: () => void) => observeDevicePixelRatio(() => onChange()),
    [],
  );
  return useSyncExternalStore(subscribe, getDevicePixelRatio, () => serverDefault);
}
