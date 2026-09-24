/**
 * Gradient surfaces for React Native.
 *
 * Two things live here and they are not the same thing.
 *
 * `SignalBlock` paints a semantic gradient. Its default, `accent`, is the single
 * accent surface Ink & Signal allows per screen, and a second one on the same screen is
 * a design error. That budget belongs to the **accent** gradients and not to the
 * component: `surfaceDeep` is ink, several may share a screen, and a carousel of cards
 * is exactly that case.
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
 *
 * `Veil` is the third, and it is **not** a `Scrim` turned sideways. A scrim fades an
 * image into the canvas at the seam where the image ends, so it is clear at the edge
 * it hangs from and opaque at the far end. A veil is the opposite polarity: a band of
 * surface laid **over** imagery so words stay legible on top of it, opaque at its own
 * edge and dissolving outwards into the picture. One hides a seam; the other buys
 * contrast. Giving the scrim a direction would have made the polarity depend on which
 * way you pointed it, which is how a component ends up meaning two things.
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

export type VeilProps = {
  /** Which edge it hangs from, and therefore which side stays opaque. */
  readonly edge: "top" | "bottom" | "left" | "right";
  /** How far it reaches into the surface before it is gone. */
  readonly extent: number;
  /** The share of that reach that stays fully opaque. Beyond it, the fade. */
  readonly hold?: number;
  readonly background?: "canvas" | "surface";
  readonly style?: StyleProp<ViewStyle>;
};

/** Where the gradient runs, from the opaque edge towards the clear far end. */
const VEIL_AXIS = {
  top: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  bottom: { start: { x: 0.5, y: 1 }, end: { x: 0.5, y: 0 } },
  left: { start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } },
  right: { start: { x: 1, y: 0.5 }, end: { x: 0, y: 0.5 } },
} as const;

export function Veil({ edge, extent, hold = 0.26, background = "surface", style }: VeilProps) {
  const theme = useTheme();
  const target = theme.color.background[background];
  // Same rule as the scrim: the clear end is this colour at zero alpha and never
  // the keyword, which is transparent black and greys the picture on the way out.
  const clear = transparent(target);
  const solid = Math.min(Math.max(hold, 0), 0.999);

  const { start, end } = VEIL_AXIS[edge];
  const vertical = edge === "top" || edge === "bottom";
  const band: ViewStyle = vertical
    ? { left: 0, right: 0, height: extent, [edge]: 0 }
    : { top: 0, bottom: 0, width: extent, [edge]: 0 };

  return (
    <LinearGradient
      pointerEvents="none"
      colors={[target, target, `${target}B3`, `${target}4D`, clear]}
      locations={[0, solid, solid + (1 - solid) * 0.35, solid + (1 - solid) * 0.7, 1]}
      start={start}
      end={end}
      style={[styles.veil, band, style]}
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
  veil: { position: "absolute" },
});
