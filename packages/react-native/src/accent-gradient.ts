/**
 * The accent gradient, resolved once into what `LinearGradient` wants.
 *
 * `gradient.signal` is the token for "hero cards, primary CTAs", and `Button`
 * already painted its primary variant with it. Nothing else did — so a screen's
 * affirmative action looked one way when it was a labelled pill and another when it
 * was a round tick, for no reason a person could name. That is the bug this exists
 * to stop: the conversion lived inside one component, so the second one that needed
 * it would have had to copy it.
 *
 * Separated from the components so it can be imported and asserted outside a React
 * Native runtime, the same reason `gradient-geometry` and `typography-style` are.
 * The tuple types are what `expo-linear-gradient` requires: at least two stops, and
 * positions as fractions rather than the percentages the token declares.
 */

import { resolveGradientEndpoints } from "./gradient-geometry.js";
import { semanticGradient } from "./tokens.js";

export type AccentGradient = {
  readonly colors: readonly [string, string, ...string[]];
  readonly locations: readonly [number, number, ...number[]];
  readonly start: { readonly x: number; readonly y: number };
  readonly end: { readonly x: number; readonly y: number };
};

export function resolveAccentGradient(): AccentGradient {
  const accent = semanticGradient.accent;
  const { start, end } = resolveGradientEndpoints(accent.angle);
  const [first, second, ...rest] = accent.stops;

  return {
    colors: [first.color, second.color, ...rest.map((stop) => stop.color)],
    locations: [
      first.position / 100,
      second.position / 100,
      ...rest.map((stop) => stop.position / 100),
    ],
    start,
    end,
  };
}
