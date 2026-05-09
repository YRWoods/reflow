import { createBreakpoints } from "fluidity-ts";

export const breakpointValues = {
  mobile: 0,
  tablet: 640,
  laptop: 1024,
  desktop: 1440,
} as const;

export type AppBreakpoints = typeof breakpointValues;

export const breakpointSystem = createBreakpoints(breakpointValues);
