/**
 * Gradient surfaces for React Native.
 *
 * Two things live here and they are not the same thing.
 *
 * `SignalBlock` paints `gradient.signal`, the single accent surface Ink & Signal
 * allows per screen. A second one on the same screen is a design error.
 *
 * `Scrim` fades imagery into the canvas so text stays legible over it. The
 * detail that matters and is easy to get wrong: **the image must extend past the
 * point where the scrim reaches full opacity.** If the scrim finishes exactly at
 * the image's edge, the last few percent of the fade still shows image, and the
 * result is a visible horizontal seam — obvious on a light canvas, where the
 * dark edge of the photograph meets a near-white background.
 *
 * `coverage` therefore describes where the fade *completes*, not where the image
 * ends. Leave real image below it.
 */

import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { resolveGradientEndpoints } from "./gradient-geometry.js";
import { useTheme } from "./theme.js";
import { semanticGradient, transparent } from "./tokens.js";

export type SignalBlockProps = {
  readonly children?: React.ReactNode;
  readonly variant?: keyof typeof semanticGradient;
  readonly style?: StyleProp<ViewStyle>;
};

export function SignalBlock({ children, variant = "accent", style }: SignalBlockProps) {
  const theme = useTheme();
  const definition = semanticGradient[variant];
  const { start, end } = resolveGradientEndpoints(definition.angle);

  // Expo types both arrays as tuples of two or more, which `map` cannot produce.
  // Destructuring the two stops every brand gradient is guaranteed to have keeps
  // the tuple shape without casting the type away.
  const [first, second, ...rest] = definition.stops;
  const colors: readonly [string, string, ...string[]] = [
    first.color,
    second.color,
    ...rest.map((stop) => stop.color),
  ];
  const locations: readonly [number, number, ...number[]] = [
    first.position / 100,
    second.position / 100,
    ...rest.map((stop) => stop.position / 100),
  ];

  return (
    <LinearGradient
      colors={colors}
      locations={locations}
      start={start}
      end={end}
      style={[{ borderRadius: theme.semanticRadius.panel }, style]}
    >
      {children}
    </LinearGradient>
  );
}

export type ScrimProps = {
  /**
   * How tall the fade is. Required, because a scrim that fills its parent
   * cannot fade anything: it would have to reach the canvas colour at the
   * bottom of the screen, long after the imagery ended.
   */
  readonly height: number;
  /** Where the fade reaches the canvas colour, as a fraction of its own height. */
  readonly coverage?: number;
  /** Where it stops being fully clear. Below this the image is untouched. */
  readonly onset?: number;
  readonly background?: "canvas" | "surface";
  readonly style?: StyleProp<ViewStyle>;
};

export function Scrim({
  height,
  coverage = 0.86,
  onset = 0.32,
  background = "canvas",
  style,
}: ScrimProps) {
  const theme = useTheme();
  const target = theme.color.background[background];

  // The transparent end is the canvas colour at zero alpha, never the keyword
  // `transparent`. That keyword is transparent *black*, so on a light canvas the
  // fade runs through grey and lands as a dirty band across the image — the
  // exact artefact this component exists to avoid.
  const clear = transparent(target);
  const full = Math.min(coverage, 0.999);
  const start = Math.min(onset, full);

  // Two stops inside the ramp rather than a straight line to opaque. A linear
  // fade reads as a band with an edge you can point at; alpha ramping ahead of
  // the geometry is what makes it read as light leaving the photograph.
  const span = full - start;
  const rise = `${target}4D`;
  const fall = `${target}B3`;

  // Positioned rather than filled. `StyleSheet.absoluteFill` pins all four
  // edges, and a consumer cannot undo that by passing `bottom: undefined` — a
  // later undefined is ignored, not applied — so the scrim silently stretched
  // to the full screen and fought whatever height the caller intended.
  return (
    <LinearGradient
      pointerEvents="none"
      colors={[clear, rise, fall, target, target]}
      locations={[start, start + span * 0.35, start + span * 0.65, full, 1]}
      style={[styles.scrim, { height }, style]}
    />
  );
}

const styles = StyleSheet.create({
  scrim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
});
