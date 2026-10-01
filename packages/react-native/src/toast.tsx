/**
 * A transient confirmation that floats over the screen and then leaves.
 *
 * It exists for outcomes that need acknowledging but not keeping: "Guardada en Fotos."
 * says the action worked, and nothing on the screen depends on it afterwards. That is
 * the opposite of `InlineAlert`, which sits with its control and stays for as long as
 * the condition it explains does. A failure that blocks the next step belongs there;
 * a toast that vanished would have taken the explanation with it.
 *
 * The component draws a self-sized pill and nothing else. Where it floats is the
 * caller's, passed through `style`, because only the screen knows what it must clear.
 *
 * It is a status, not an alert. `accessibilityRole="alert"` interrupts whatever the
 * screen reader is saying, which is right for an error and rude for a confirmation, so
 * Android gets a polite live region and iOS a queued announcement instead.
 *
 * Motion honours reduced motion: the `reduced` step is zero duration, so the pill
 * appears and disappears without travelling. A new `message` restarts the clock.
 */

import { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Platform,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Reanimated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { FoundationIcon } from "./icons.js";
import { resolveShadowStyle } from "./shadow-style.js";
import { Text } from "./text.js";
import { useTheme } from "./theme.js";
import { semanticMotion } from "./tokens.js";

export type ToastTone = "neutral" | "success" | "danger";

export type ToastProps = {
  /** `undefined` hides the toast; a new value shows it and restarts the timer. */
  readonly message: string | undefined;
  readonly tone?: ToastTone;
  /** Milliseconds on screen before it hides itself. */
  readonly duration?: number;
  /** Called once the exit has finished, so the caller can clear `message`. */
  readonly onHide?: (() => void) | undefined;
  /** Defaults to the system setting. */
  readonly reduceMotion?: boolean | undefined;
  readonly testID?: string | undefined;
  readonly style?: StyleProp<ViewStyle>;
};

/** Long enough to read a short sentence, short enough not to linger. */
const HOLD = 2400;

type MotionStep = (typeof semanticMotion)[keyof typeof semanticMotion];

function timing(step: MotionStep) {
  return {
    duration: step.duration,
    easing: Easing.bezier(...(step.easing as [number, number, number, number])),
  };
}

export function Toast({
  message,
  tone = "success",
  duration = HOLD,
  onHide,
  reduceMotion,
  testID,
  style,
}: ToastProps) {
  const theme = useTheme();
  const systemReduced = useReducedMotion();
  const progress = useSharedValue(0);
  // Kept after `message` clears so the pill can animate out with its text intact.
  const [shown, setShown] = useState(message);
  const visible = useRef(false);

  // Read through refs so an inline arrow or a settings change does not restart the clock.
  const hide = useRef(onHide);
  const reduced = useRef(reduceMotion ?? systemReduced);
  useEffect(() => {
    hide.current = onHide;
    reduced.current = reduceMotion ?? systemReduced;
  }, [onHide, reduceMotion, systemReduced]);

  useEffect(() => {
    const enter = reduced.current ? semanticMotion.reduced : semanticMotion.enter;
    const exit = reduced.current ? semanticMotion.reduced : semanticMotion.exit;
    let exitTimer: ReturnType<typeof setTimeout> | undefined;

    // The exit is timed on the JS side, so finishing never has to hop off the UI thread.
    const leave = () => {
      progress.value = withTiming(0, timing(exit));
      exitTimer = setTimeout(() => {
        visible.current = false;
        setShown(undefined);
        hide.current?.();
      }, exit.duration);
    };

    if (message === undefined) {
      if (visible.current) leave();
      return () => clearTimeout(exitTimer);
    }

    visible.current = true;
    setShown(message);
    progress.value = withTiming(1, timing(enter));
    // Android speaks the live region; iOS ignores it and needs the announcement.
    if (Platform.OS === "ios") AccessibilityInfo.announceForAccessibility(message);
    const holdTimer = setTimeout(leave, duration);
    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
    };
  }, [message, duration, progress]);

  const rise = theme.spacing[2];
  const motion = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * rise }],
  }), [rise]);

  if (shown === undefined) return null;

  const icon = tone === "success" ? "success" : tone === "danger" ? "error" : undefined;

  return (
    <Reanimated.View
      testID={testID}
      accessible
      accessibilityLabel={shown}
      accessibilityLiveRegion="polite"
      style={[
        styles.pill,
        resolveShadowStyle("floating"),
        {
          gap: theme.spacing[2],
          paddingHorizontal: theme.spacing[4],
          paddingVertical: theme.spacing[3],
          borderRadius: theme.semanticRadius.pill,
          borderColor: theme.color.border.subtle,
          backgroundColor: theme.color.background.surface,
        },
        motion,
        style,
      ]}
    >
      {icon === undefined ? null : (
        <FoundationIcon
          name={icon}
          size="sm"
          color={tone === "danger" ? theme.color.status.danger : theme.color.status.success}
          decorative
        />
      )}
      <Text role="body" size="sm">
        {shown}
      </Text>
    </Reanimated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: StyleSheet.hairlineWidth * 2,
    // A confirmation must never swallow the tap meant for what lies beneath it.
    pointerEvents: "none",
  },
});
