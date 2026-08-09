/**
 * Ambient backdrop for React Native surfaces.
 *
 * Three soft blooms and a fine dot grid over the canvas. A flat canvas is
 * correct for dense reading, but on the sparse screens — opening, welcome, sign
 * in — it reads as empty rather than as calm, and glass laid over it has nothing
 * to refract, which flattens the material into a grey rectangle.
 *
 * Radial, so `expo-linear-gradient` cannot draw it; `react-native-svg` can, and
 * it is already a peer.
 *
 * Deliberately faint. This is ground, not decoration: if it reads as a pattern
 * rather than as depth, the opacities are too high.
 */

import { Circle, Defs, Pattern, RadialGradient, Rect, Stop, Svg } from "react-native-svg";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { useTheme } from "./theme.js";
import { color } from "./tokens.js";

/** Namespaced so two backdrops on one screen cannot collide over an id. */
const ID = "afo-backdrop";

const DOT_SPACING = 13;

export type AmbientBackdropProps = {
  readonly style?: StyleProp<ViewStyle>;
};

export function AmbientBackdrop({ style }: AmbientBackdropProps) {
  const theme = useTheme();
  const dark = theme.name === "dark";

  // Light needs more of the wash to register at all against a near-white canvas;
  // dark needs less before the blooms start to band.
  const bloom = dark
    ? { warm: 0.2, deep: 0.24, signal: 0.09, dots: 0.16 }
    : { warm: 0.16, deep: 0.08, signal: 0.12, dots: 0.1 };

  return (
    <Svg pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      <Defs>
        <RadialGradient id={`${ID}-a`} cx="20%" cy="8%" rx="78%" ry="52%">
          <Stop offset="0" stopColor={color.brand.turquoise} stopOpacity={bloom.warm} />
          <Stop offset="1" stopColor={color.brand.turquoise} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id={`${ID}-b`} cx="92%" cy="26%" rx="66%" ry="46%">
          <Stop
            offset="0"
            stopColor={dark ? color.brand.turquoiseDeep : color.brand.turquoiseDark}
            stopOpacity={bloom.deep}
          />
          <Stop
            offset="1"
            stopColor={dark ? color.brand.turquoiseDeep : color.brand.turquoiseDark}
            stopOpacity={0}
          />
        </RadialGradient>
        <RadialGradient id={`${ID}-c`} cx="50%" cy="98%" rx="88%" ry="56%">
          <Stop offset="0" stopColor={color.brand.primary} stopOpacity={bloom.signal} />
          <Stop offset="1" stopColor={color.brand.primary} stopOpacity={0} />
        </RadialGradient>

        <Pattern
          id={`${ID}-dots`}
          width={DOT_SPACING}
          height={DOT_SPACING}
          patternUnits="userSpaceOnUse"
        >
          <Circle cx={1} cy={1} r={0.8} fill={theme.color.border.default} />
        </Pattern>
      </Defs>

      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${ID}-a)`} />
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${ID}-b)`} />
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${ID}-c)`} />
      <Rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill={`url(#${ID}-dots)`}
        opacity={bloom.dots}
      />
    </Svg>
  );
}
