/**
 * Translucent material for React Native surfaces.
 *
 * Consumes the `material` tokens, which had no consumer until now. Three layers
 * are what make it read as glass rather than as a grey rectangle: a real
 * backdrop blur, a translucent fill over it, and a bright inner edge along the
 * top. Drop the edge and it flattens immediately.
 *
 * `docs/FOUNDATIONS.md` reserves glass for floating chrome — tab bars, top bars,
 * overlays — and keeps content cards on solid ink. This component does not
 * enforce that, because the boundary is a live product decision. It is worth
 * knowing which side of it you are on before reaching for this.
 *
 * Blur is not free. Several blurred layers on one screen visibly cost frames on
 * mid-range Android, so one panel per screen is the working budget.
 */

import { BlurView } from "expo-blur";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { useTheme } from "./theme.js";
import { material } from "./tokens.js";

/**
 * The token carries a CSS blur radius in pixels; `BlurView` takes an abstract
 * 0–100 intensity. There is no conversion between the two, so this is a
 * calibration matched by eye against the web adapter at the token's 26px.
 */
const BLUR_INTENSITY = 70;

export type GlassPanelProps = {
  readonly children?: React.ReactNode;
  readonly radius?: "card" | "panel" | "overlay" | "action";
  readonly style?: StyleProp<ViewStyle>;
};

export function GlassPanel({ children, radius = "panel", style }: GlassPanelProps) {
  const theme = useTheme();
  const surface = material[theme.name].glass;
  const borderRadius = theme.semanticRadius[radius];

  return (
    <BlurView
      intensity={BLUR_INTENSITY}
      tint={theme.name === "dark" ? "dark" : "light"}
      style={[styles.base, { borderRadius, borderColor: surface.border }, style]}
    >
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: surface.fill }]}
      />
      {/* The specular edge. Without it the panel reads as a flat tinted block
          rather than as a lit surface. */}
      <View
        pointerEvents="none"
        style={[
          styles.edge,
          { backgroundColor: theme.name === "dark" ? theme.color.border.subtle : "#FFFFFF" },
        ]}
      />
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
  edge: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth * 2,
    opacity: 0.9,
  },
});
