/**
 * Screen container for React Native surfaces.
 *
 * Exists so no product paints its own canvas. A screen that sets its own
 * background is the first step toward two screens disagreeing about what the
 * canvas is, and the disagreement only shows up on a device.
 *
 * Safe-area edges are opt-in per screen rather than always-on: a screen with
 * imagery bleeding under the status bar needs the top edge unpadded, and forcing
 * it would make full-bleed layouts impossible to build with this component.
 *
 * The top edge also buys a little air beyond the safe area. The inset only clears
 * the hardware, and content that starts the instant it ends reads as pinned to the
 * notch — the same complaint on every screen at once, which is why it is fixed here
 * rather than per product.
 */

import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { useTheme } from "./theme.js";

export type ScreenBackground = "canvas" | "surface" | "surfaceSubtle" | "surfaceMuted";

export type ScreenProps = {
  readonly children: React.ReactNode;
  readonly edges?: readonly Edge[];
  readonly background?: ScreenBackground;
  readonly padded?: boolean;
  readonly style?: StyleProp<ViewStyle>;
};

export function Screen({
  children,
  edges = ["top", "bottom"],
  background = "canvas",
  padded = true,
  style,
}: ScreenProps) {
  const theme = useTheme();

  return (
    <SafeAreaView
      edges={edges}
      style={[
        styles.base,
        { backgroundColor: theme.color.background[background] },
        padded ? { paddingHorizontal: theme.semanticSpacing.panelInset } : null,
        edges.includes("top") ? { paddingTop: theme.semanticSpacing.screenTop } : null,
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
});
