import type { CubicBezier, SpringConfig } from "./types.js";

export const motion = {
  duration: {
    instant: 0,
    fastest: 80,
    fast: 120,
    normal: 180,
    moderate: 240,
    slow: 320,
    slower: 480,
    slowest: 700,
  },
  easing: {
    linear: [0, 0, 1, 1],
    standard: [0.2, 0, 0, 1],
    enter: [0, 0, 0.2, 1],
    exit: [0.4, 0, 1, 1],
    emphasized: [0.16, 1, 0.3, 1],
  } satisfies Record<string, CubicBezier>,
  spring: {
    responsive: { damping: 24, stiffness: 300, mass: 0.8 },
    expressive: { damping: 20, stiffness: 220, mass: 0.9 },
    settled: { damping: 28, stiffness: 180, mass: 1 },
  } satisfies Record<string, SpringConfig>,
} as const;

export const semanticMotion = {
  feedback: {
    duration: motion.duration.fast,
    easing: motion.easing.standard,
    spring: motion.spring.responsive,
  },
  transition: {
    duration: motion.duration.normal,
    easing: motion.easing.standard,
    spring: motion.spring.settled,
  },
  enter: {
    duration: motion.duration.slow,
    easing: motion.easing.enter,
    spring: motion.spring.expressive,
  },
  exit: {
    duration: motion.duration.fast,
    easing: motion.easing.exit,
    spring: motion.spring.responsive,
  },
  reduced: {
    duration: motion.duration.instant,
    easing: motion.easing.linear,
  },
} as const;

