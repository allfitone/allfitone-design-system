import type { Gradient } from "./types.js";

/**
 * Ink & Signal v2 — brand gradients.
 *
 * The "signal" gradient is the single accent block allowed per screen:
 * hero cards, primary CTAs, rest timers, featured content. Everything else
 * stays on ink surfaces.
 */
export const gradient = {
  signal: {
    angle: 135,
    stops: [
      { color: "#6FF3FD", position: 0 },
      { color: "#3ED4DF", position: 55 },
      { color: "#23AEB9", position: 100 },
    ],
  },
  signalDeep: {
    angle: 135,
    stops: [
      { color: "#55EFFB", position: 0 },
      { color: "#176D72", position: 100 },
    ],
  },
} as const satisfies Record<string, Gradient>;

export const semanticGradient = {
  /** The one accent surface per screen: hero blocks, primary CTAs. */
  accent: gradient.signal,
  /** Decorative deep variant: charts, text fills, brand moments. */
  accentDeep: gradient.signalDeep,
} as const;
