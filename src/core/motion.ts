import { defaultBreakpoints } from "./breakpoints.js";
import { getPreference } from "./preferences.js";

export interface SpringConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
}

export interface TransitionConfig {
  property: string;
  duration?: number;
  easing?: string;
  /** Duration to use when prefers-reduced-motion is active (default: 0) */
  reducedDuration?: number;
}

/** Calculate spring physics for a single frame */
export interface SpringState {
  value: number;
  velocity: number;
  done: boolean;
}

const DEFAULT_DURATION = 200;
const DEFAULT_EASING = "ease";
const DEFAULT_REDUCED_DURATION = 0;
const DEFAULT_SCALE_FACTOR = 0.2;
const DEFAULT_SPRING: Required<SpringConfig> = {
  stiffness: 170,
  damping: 26,
  mass: 1,
};
const SETTLE_EPSILON = 0.01;
const MIN_SCALE_WIDTH = defaultBreakpoints.sm;
const MAX_SCALE_WIDTH = defaultBreakpoints.xl;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function sanitizeDuration(value: number): number {
  return Math.max(0, Math.round(value));
}

function getReducedMotion(): boolean {
  return getPreference("reducedMotion");
}

function toTransitionString(config: TransitionConfig, reducedMotion: boolean): string {
  const duration = reducedMotion
    ? (config.reducedDuration ?? DEFAULT_REDUCED_DURATION)
    : (config.duration ?? DEFAULT_DURATION);

  return `${config.property} ${sanitizeDuration(duration)}ms ${config.easing ?? DEFAULT_EASING}`;
}

/** Generate a CSS transition string that respects reduced motion */
export function responsiveTransition(config: TransitionConfig | TransitionConfig[]): string {
  const transitions = Array.isArray(config) ? config : [config];
  const reducedMotion = getReducedMotion();
  return transitions.map((item) => toTransitionString(item, reducedMotion)).join(", ");
}

/** Returns value based on prefers-reduced-motion */
export function reduceMotion<T>(normal: T, reduced: T): T {
  return getReducedMotion() ? reduced : normal;
}

/**
 * Create a spring physics simulation for animating values with natural motion.
 * Respects `prefers-reduced-motion` by settling instantly when the preference is set.
 *
 * @param config - Optional `{ stiffness, damping, mass }` to customize spring behavior.
 * @returns `{ tick, isSettled }` functions for stepping the simulation forward.
 */
export function createSpring(config: SpringConfig = {}): {
  /** Advance spring by dt milliseconds toward target */
  tick(current: SpringState, target: number, dt: number): SpringState;
  /** Check if spring has settled */
  isSettled(state: SpringState, target: number): boolean;
} {
  const stiffness = Number.isFinite(config.stiffness)
    ? Math.max(0, config.stiffness ?? DEFAULT_SPRING.stiffness)
    : DEFAULT_SPRING.stiffness;
  const damping = Number.isFinite(config.damping)
    ? Math.max(0, config.damping ?? DEFAULT_SPRING.damping)
    : DEFAULT_SPRING.damping;
  const mass = Number.isFinite(config.mass)
    ? Math.max(0.001, config.mass ?? DEFAULT_SPRING.mass)
    : DEFAULT_SPRING.mass;

  const isSettled = (state: SpringState, target: number): boolean => {
    return (
      Math.abs(target - state.value) <= SETTLE_EPSILON && Math.abs(state.velocity) <= SETTLE_EPSILON
    );
  };

  const tick = (current: SpringState, target: number, dt: number): SpringState => {
    const durationMs = Number.isFinite(dt) ? Math.max(0, dt) : 0;
    if (durationMs === 0) {
      return isSettled(current, target)
        ? { value: target, velocity: 0, done: true }
        : { ...current, done: false };
    }

    const steps = Math.max(1, Math.ceil(durationMs / 16));
    const stepSeconds = durationMs / steps / 1000;

    let value = current.value;
    let velocity = current.velocity;

    for (let i = 0; i < steps; i++) {
      const springForce = stiffness * (target - value);
      const dampingForce = damping * velocity;
      const acceleration = (springForce - dampingForce) / mass;
      velocity += acceleration * stepSeconds;
      value += velocity * stepSeconds;
    }

    const next = { value, velocity, done: false };
    if (isSettled(next, target)) {
      return { value: target, velocity: 0, done: true };
    }
    return next;
  };

  return { tick, isSettled };
}

/** Generate duration that scales with viewport (shorter on mobile for snappiness) */
export function responsiveDuration(
  baseDuration: number,
  viewportWidth: number,
  options?: { minDuration?: number; maxDuration?: number; scaleFactor?: number },
): number {
  const safeBaseDuration = Math.max(0, baseDuration);
  const scaleFactor = Math.max(0, options?.scaleFactor ?? DEFAULT_SCALE_FACTOR);
  const minDuration = options?.minDuration ?? safeBaseDuration * (1 - scaleFactor);
  const maxDuration = options?.maxDuration ?? safeBaseDuration * (1 + scaleFactor);
  const floor = Math.max(0, Math.min(minDuration, maxDuration));
  const ceiling = Math.max(floor, Math.max(minDuration, maxDuration));

  const width = clamp(viewportWidth, MIN_SCALE_WIDTH, MAX_SCALE_WIDTH);
  const progress = (width - MIN_SCALE_WIDTH) / (MAX_SCALE_WIDTH - MIN_SCALE_WIDTH);
  const duration = floor + (ceiling - floor) * progress;

  return sanitizeDuration(duration);
}
