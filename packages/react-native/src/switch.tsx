/**
 * A setting somebody turns on or off, and the screen answers at once.
 *
 * **When a switch and when a `Checkbox`.** A switch promises that something happens the
 * moment it moves; a checkbox affirms a statement that only counts when the form is sent.
 * Use a switch when turning it on changes what the screen shows right away — «Sé cuándo
 * termina» reveals the field for the end date beneath it — and a checkbox for an
 * affirmation such as accepting terms, where nothing on the screen moves.
 *
 * **The label is drawn and is the accessible name**, set in the control role at the
 * row's start, with the track at its end; the whole row is the target, so a person hits
 * it by the words as easily as by the track. The role is `switch` and the state is
 * `checked`, which both platforms read as «activado» or «desactivado».
 *
 * On, the track takes the accent and the thumb the colour that reads on it; off, the
 * track sits on the field's ground with a subtle edge and a muted thumb. The thumb slides
 * with the system's feedback timing and jumps when reduced motion is on.
 */

import { useEffect } from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Reanimated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Text } from "./text.js";
import { useTheme } from "./theme.js";

const TRACK_WIDTH = 46;
const TRACK_HEIGHT = 28;
const INSET = 3;
const THUMB = TRACK_HEIGHT - INSET * 2;
const TRAVEL = TRACK_WIDTH - THUMB - INSET * 2;

export type SwitchProps = {
  /** What is turned on. Drawn at the row's start and used as the accessible name. */
  readonly label: string;
  readonly value: boolean;
  readonly onChange: (value: boolean) => void;
  readonly disabled?: boolean;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function Switch({ label, value, onChange, disabled, testID, style }: SwitchProps) {
  const theme = useTheme();
  const reduced = useReducedMotion();
  const position = useSharedValue(value ? 1 : 0);
  const feedback = theme.motion.feedback;

  useEffect(() => {
    const target = value ? 1 : 0;
    position.value = reduced
      ? target
      : withTiming(target, {
          duration: feedback.duration,
          easing: Easing.bezier(...(feedback.easing as [number, number, number, number])),
        });
  }, [value, reduced, feedback, position]);

  const thumb = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value * TRAVEL }],
  }));

  const on = value && disabled !== true;
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value, disabled: disabled === true }}
      disabled={disabled}
      onPress={() => onChange(!value)}
      testID={testID}
      style={({ pressed }) => [styles.row, { opacity: pressed && !disabled ? 0.8 : 1 }, style]}
    >
      <Text role="control" size="sm" color={disabled ? "disabled" : "primary"} style={styles.label}>
        {label}
      </Text>
      <View
        style={[
          styles.track,
          {
            backgroundColor: on ? theme.color.icon.accent : theme.color.background.surfaceSubtle,
            borderColor: on ? theme.color.icon.accent : theme.color.border.subtle,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <Reanimated.View
          style={[
            styles.thumb,
            { backgroundColor: on ? theme.color.accent.onAccent : theme.color.text.muted },
            thumb,
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 44 },
  label: { flex: 1 },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    borderWidth: 1.5,
    paddingHorizontal: INSET - 1.5,
    justifyContent: "center",
  },
  thumb: { width: THUMB, height: THUMB, borderRadius: THUMB / 2 },
});
