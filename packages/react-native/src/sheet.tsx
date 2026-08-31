/**
 * A panel that rises from the bottom edge over the current screen.
 *
 * Ported from the Web `Sheet`, which is built on a dialog primitive. The
 * decisions carry over — anchored to the bottom, capped at 85% of the height,
 * rounded only on the leading corners, over a dimmed backdrop — while the
 * compound `Sheet/SheetContent/SheetHeader` API does not: React Native has no
 * portal to compose against, and every native component here is a single one
 * with props, like `TextField` and `CodeField`.
 *
 * Bottom only. The Web variant also opens from the sides, which suits a desktop
 * pane and nothing on a phone, where the reachable edge is the bottom one.
 *
 * It exists for the exchanges that are not screens: a confirmation with nothing
 * to do next, a short form that must not lose the screen behind it. Password
 * recovery is the first — the person is on sign-in, asks for a link, and needs
 * to end up back on sign-in, so a route would have to invent a destination it
 * already had.
 *
 * The backdrop dismisses, and so does the system back gesture on Android through
 * `onRequestClose`. Both are the same intent and neither is a decision, so a
 * sheet that carries one must own the confirmation itself.
 *
 * Motion honours reduced motion: the tokens define a `reduced` step at zero
 * duration, and a panel that slides anyway is the thing that setting exists to
 * stop.
 *
 * Two details keep the motion from reading as a jump.
 *
 * **The modal outlives `visible`.** Handing `visible` straight to `Modal` unmounts the
 * tree on the same frame the sheet is dismissed, so the exit animation never runs and
 * the panel vanishes. It stays mounted until the animation reports it finished.
 *
 * **The panel travels its own height, not the screen's.** Sliding a short sheet from
 * 85% of the display means covering several hundred points in a fraction of a second,
 * which arrives like a slam. Its height is measured and that is the distance.
 */

import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { semanticMotion } from "@allfitone/tokens";

import { Text } from "./text.js";
import { useTheme } from "./theme.js";

/** Enough of the screen behind stays visible that its context is not lost. */
const MAX_HEIGHT_RATIO = 0.85;

/** Dark in both themes: a scrim separates planes, it does not follow the canvas. */
const BACKDROP = "#02060BA6";

export type SheetProps = {
  readonly visible: boolean;
  readonly onDismiss: () => void;
  /** Announced as the sheet's name, and drawn unless `hideTitle`. */
  readonly title: string;
  readonly hideTitle?: boolean;
  readonly reduceMotion?: boolean;
  readonly children: React.ReactNode;
  readonly style?: StyleProp<ViewStyle>;
};

export function Sheet({
  visible,
  onDismiss,
  title,
  hideTitle,
  reduceMotion,
  children,
  style,
}: SheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);
  // Until the panel has been laid out, the screen is the only distance there is.
  const [travel, setTravel] = useState(height * MAX_HEIGHT_RATIO);

  useEffect(() => {
    if (visible) setMounted(true);
    const step = reduceMotion
      ? semanticMotion.reduced
      : visible
        ? semanticMotion.enter
        : semanticMotion.exit;
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: step.duration,
      easing: Easing.bezier(...(step.easing as [number, number, number, number])),
      useNativeDriver: true,
    }).start(({ finished }) => {
      // Only once it has actually left. Unmounting on `visible` alone is what made
      // the sheet disappear instead of closing.
      if (finished && !visible) setMounted(false);
    });
  }, [visible, reduceMotion, progress]);

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={onDismiss}
      accessibilityViewIsModal
      statusBarTranslucent
    >
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: progress }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
          onPress={onDismiss}
          style={[StyleSheet.absoluteFill, { backgroundColor: BACKDROP }]}
        />
      </Animated.View>

      <Animated.View
        accessibilityViewIsModal
        onLayout={(event) => {
          const measured = event.nativeEvent.layout.height;
          if (measured > 0) setTravel(measured);
        }}
        style={[
          styles.panel,
          {
            maxHeight: height * MAX_HEIGHT_RATIO,
            opacity: progress,
            paddingBottom: insets.bottom + theme.spacing[4],
            paddingHorizontal: theme.spacing[6],
            paddingTop: theme.spacing[5],
            backgroundColor: theme.color.background.surface,
            borderColor: theme.color.border.subtle,
            borderTopLeftRadius: theme.semanticRadius.panel,
            borderTopRightRadius: theme.semanticRadius.panel,
            transform: [
              {
                translateY: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [travel, 0],
                }),
              },
            ],
          },
          style,
        ]}
      >
        {/* A short bar, not a control: it says the panel is a layer. */}
        <View
          aria-hidden
          style={[styles.grabber, { backgroundColor: theme.color.border.default }]}
        />

        {hideTitle ? null : (
          <Text role="display" size="2xl" uppercase accessibilityRole="header">
            {title}
          </Text>
        )}

        <View style={{ marginTop: hideTitle ? 0 : theme.spacing[3] }}>{children}</View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
  },
  grabber: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 999,
    marginBottom: 18,
  },
});
