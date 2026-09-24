/**
 * An ordered set of instructions, each one numbered.
 *
 * How to do something, in the order it is done: the steps of an exercise, of a setup, of
 * a recovery. The number is the point — it says this is a sequence and not a list of
 * tips, and it gives somebody following along a place to come back to.
 *
 * **The marker is a box, not a badge and not a chip.** A chip on the same screen is
 * pressable and carries the accent on its border to say so; a marker carries the accent
 * only on the numeral and keeps a subtle border, so the two cannot be confused. A badge
 * floats and reads as an alert, which a step is not.
 *
 * **It owns the alignment, which is the part a screen kept getting wrong.** The numeral
 * is set in the condensed face and leads tighter than the body text beside it, so the
 * two never share a baseline by accident — see `step-geometry.ts` for what is done
 * about it and why the row is not simply centred.
 *
 * The numbers are given, not counted from the array: an instruction's position belongs
 * to the instruction, and a list rendered from a filtered set would otherwise renumber
 * itself silently.
 */

import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { resolveTextStyle } from "./typography-style.js";
import { Text } from "./text.js";
import { useTheme } from "./theme.js";
import { STEP_MARKER_RADIUS, STEP_MARKER_SIZE, stepMarkerOffset } from "./step-geometry.js";

const TEXT_SIZE = "sm";

export type Step = {
  readonly position: number;
  readonly text: string;
};

export type StepListProps = {
  readonly steps: readonly Step[];
  readonly accessibilityLabel?: string;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function StepList({ steps, accessibilityLabel, testID, style }: StepListProps) {
  const theme = useTheme();
  const body = resolveTextStyle("body", TEXT_SIZE);
  const drop = stepMarkerOffset(
    STEP_MARKER_SIZE,
    body.lineHeight ?? STEP_MARKER_SIZE,
    body.fontSize ?? STEP_MARKER_SIZE,
  );

  return (
    <View
      accessibilityRole="list"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={[styles.list, style]}
    >
      {steps.map((step) => (
        <View key={step.position} style={styles.step}>
          <View
            style={[
              styles.marker,
              {
                marginTop: drop,
                backgroundColor: theme.color.background.surfaceSubtle,
                borderColor: theme.color.border.subtle,
              },
            ]}
          >
            {/* Its own leading, centred by the box. Forcing the line box to the
                marker's height pushed the numeral down, for the same iOS reason. */}
            <Text role="data" size={TEXT_SIZE} color="accent">
              {String(step.position)}
            </Text>
          </View>
          <Text role="body" size={TEXT_SIZE} style={styles.text}>
            {step.text}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  step: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  marker: {
    width: STEP_MARKER_SIZE,
    height: STEP_MARKER_SIZE,
    borderRadius: STEP_MARKER_RADIUS,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1 },
});
