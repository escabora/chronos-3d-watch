/**
 * Device capability detection — degrade gracefully, keep the look.
 */
import { RENDERING, VIEWPORT } from "./settings";

export const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

export const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

export const isLowPerf =
  isTouch || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

/** Geometry tessellation budgets, halved on low-performance devices. */
export const TESSELLATION = {
  high: isLowPerf ? 48 : 96,
  medium: isLowPerf ? 32 : 64,
  low: isLowPerf ? 16 : 32,
};

export const isMobileViewport = () => window.innerWidth < VIEWPORT.MOBILE_MAX_WIDTH;

export const getMaxPixelRatio = () =>
  Math.min(
    window.devicePixelRatio,
    isLowPerf ? RENDERING.MAX_DPR_LOW_PERF : RENDERING.MAX_DPR
  );
