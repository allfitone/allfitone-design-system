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
  /** Ink with the cold cast of the brand, for large cards. Not an accent surface. */
  surfaceDeep: {
    angle: 210,
    stops: [
      { color: "#0A2737", position: 0 },
      { color: "#071822", position: 100 },
    ],
  },
} as const satisfies Record<string, Gradient>;

export const semanticGradient = {
  /** The one accent surface per screen: hero blocks, primary CTAs. */
  accent: gradient.signal,
  /** Decorative deep variant: charts, text fills, brand moments. */
  accentDeep: gradient.signalDeep,
  /**
   * The surface of a card that carries a whole screen's worth of decision.
   *
   * It is **ink, not signal**: it does not spend the one accent surface a screen is
   * allowed, and several of these may share a screen — a carousel is exactly that. The
   * gradient is what keeps a card that size from reading as a flat hole, which a single
   * fill does at three hundred points tall.
   */
  surfaceDeep: gradient.surfaceDeep,
} as const;
