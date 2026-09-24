/**
 * Translucent material for React Native surfaces.
 *
 * Consumes the `material` tokens. Three layers are what make it read as glass
 * rather than as a grey rectangle: a real backdrop blur, a translucent fill over
 * it, and a bright inner edge along the top. Drop the edge and it flattens
 * immediately.
 *
 * **The fill is the material; the blur only blurs.** `BlurView`'s dark tint is a
 * heavy translucency in its own right, and at the intensity this component first
 * shipped with it darkened the panel a second time — a chip over a photograph came
 * out solid, with none of the photograph in it. The intensity is low on purpose so
 * the token's own alpha decides how much shows through.
 *
 * **Two materials.** `glass` floats over the canvas; `chip` floats over imagery and
 * is lighter, because at the chrome material's opacity a chip on a photograph reads
 * as a sticker. Ask for the one that matches what is behind it.
 *
 * `docs/FOUNDATIONS.md` reserves glass for floating chrome — tab bars, top bars,
 * overlays — and keeps content cards on solid ink. This component does not enforce
 * that, because the boundary is a live product decision. It is worth knowing which
 * side of it you are on before reaching for this.
 *
 * Blur is not free. Several blurred layers on one screen visibly cost frames on
 * mid-range Android, so a small budget per screen is the working rule.
 */

import { BlurView } from "expo-blur";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { useTheme } from "./theme.js";
import { material } from "./tokens.js";

/**
 * The token carries a CSS blur radius in pixels; `BlurView` takes an abstract
 * 0-100 intensity, and on iOS that number also drives how much of the effect's own
 * tint lands. Kept low so the fill above it is what colours the panel.
 */
const BLUR_INTENSITY = 24;

export type GlassMaterialName = "glass" | "chip";

export type GlassPanelProps = {
  readonly children?: React.ReactNode;
  readonly radius?: "card" | "panel" | "overlay" | "action";
  /** `glass` over the canvas, `chip` over imagery. */
  readonly material?: GlassMaterialName;
  readonly style?: StyleProp<ViewStyle>;
};

export function GlassPanel({
  children,
  radius = "panel",
  material: name = "glass",
  style,
}: GlassPanelProps) {
  const theme = useTheme();
  const surface = material[theme.name][name];
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
      <View pointerEvents="none" style={[styles.edge, { backgroundColor: surface.shine }]} />
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
  },
});
