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
 *
 * **Touching nothing in particular puts the keyboard away.** A `ScrollView` can be told
 * to do that for the part of a screen it covers, but a screen is rarely only a scroll
 * view: a form under a header that stays put leaves the keyboard up with no way to
 * dismiss it but the return key, which on a name field does not exist. It belongs here
 * for the same reason the top inset does — it is every screen's complaint, not one
 * screen's.
 *
 * **The ambient backdrop is part of the canvas, not of a screen.** It started on the
 * sparse screens — welcome, sign in, onboarding — each mounting it by hand, and the
 * rest of the product stayed flat. That is the disagreement about what the canvas is
 * that this component exists to prevent, only one layer up: same product, two grounds,
 * and the seam shows the moment you walk from onboarding into the app. It lives here
 * now, on by default, and `ambient={false}` is for a screen whose own imagery is the
 * ground.
 *
 * **La retícula no viene con él.** El punteado es de las pantallas con sitio de sobra
 * —la bienvenida, el acceso, el onboarding—, que lo piden con `dots`. En una pantalla
 * de lectura densa se pone entre el ojo y el texto, así que ahí quedan sólo las nubes.
 *
 * It is drawn **outside the safe area and outside the inset**, so it reaches the notch
 * and both margins. Inside the padded box it would be inset by the padding and leave
 * unpainted strips down the sides, which is what a screen mounting it by hand got.
 *
 * **It observes the touch rather than claiming it.** `onStartShouldSetResponder` runs
 * bottom-up and stops at whatever answers `true`, so a field, a button or a row being
 * dragged is asked first and this is never reached. Answering `false` means it never
 * becomes the responder either: nothing is intercepted, nothing is blocked, and no
 * control is added to the accessibility tree.
 */

import { Keyboard, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { AmbientBackdrop } from "./backdrop.js";
import { useTheme } from "./theme.js";

export type ScreenBackground = "canvas" | "surface" | "surfaceSubtle" | "surfaceMuted";

export type ScreenProps = {
  readonly children: React.ReactNode;
  readonly edges?: readonly Edge[];
  readonly background?: ScreenBackground;
  readonly padded?: boolean;
  /** Off for a screen whose own imagery is the ground. */
  readonly ambient?: boolean;
  /** La retícula del fondo. Sólo donde hay sitio de sobra. */
  readonly dots?: boolean;
  readonly style?: StyleProp<ViewStyle>;
};

export function Screen({
  children,
  edges = ["top", "bottom"],
  background = "canvas",
  padded = true,
  ambient = true,
  dots = false,
  style,
}: ScreenProps) {
  const theme = useTheme();

  // El lienzo pasa al contenedor exterior para que el fondo quede por debajo del área
  // segura; `style` sigue llegando al interior, que es donde vive el relleno.
  return (
    <View style={[styles.base, { backgroundColor: theme.color.background[background] }]}>
      {ambient ? <AmbientBackdrop dots={dots} /> : null}
      <SafeAreaView
        edges={edges}
        onStartShouldSetResponder={dismissKeyboard}
        style={[
          styles.base,
          padded ? { paddingHorizontal: theme.semanticSpacing.panelInset } : null,
          edges.includes("top") ? { paddingTop: theme.semanticSpacing.screenTop } : null,
          style,
        ]}
      >
        {children}
      </SafeAreaView>
    </View>
  );
}

/**
 * Puts the keyboard away, and never takes the touch.
 *
 * Asked only when nothing below wanted the touch. The visibility check is not an
 * optimisation of the dismissal — it is one less call across the bridge on every tap
 * that lands on the canvas of a screen with no field on it at all.
 */
function dismissKeyboard(): boolean {
  if (Keyboard.isVisible()) Keyboard.dismiss();
  return false;
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
});
