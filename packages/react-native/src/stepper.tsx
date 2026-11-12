/**
 * A small whole number the person adjusts by one.
 *
 * How many weeks a programme repeats, how many sets a movement has. The value is
 * shown between two targets and is **not** editable text: the range is small, the
 * keyboard would cover the thing being adjusted, and a field invites values the
 * range does not allow.
 *
 * **The bounds disable, they do not clamp silently.** A `+` that keeps answering
 * the same number reads as a broken button; one that is visibly unavailable says
 * the range ended. `onChange` is therefore never called with an out-of-range value.
 *
 * The number is centred in a fixed-width slot so the two targets do not walk left
 * and right as it goes from 9 to 10.
 *
 * **`size="lg"` is the stepper a screen is about**: how many days a week somebody
 * trains, with the number as the poster of the screen. The value sits in its own box,
 * set in the poster role in the accent with its unit beside it, and `−` and `+` are
 * boxes of the same height on either side, so the three read as one control. It always
 * fills its row. The italic poster figure rises above its tight line and leans past its
 * box, so it carries room on both.
 */

import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { FoundationIcon } from "./icons.js";
import { Text } from "./text.js";
import { useTheme } from "./theme.js";

const TARGET = 44;

/** Wide enough for three digits, which is past anything this control is for. */
const VALUE_WIDTH = 56;

export type StepperProps = {
  /** Names what is being counted, for the screen reader. Not drawn. */
  readonly accessibilityLabel: string;
  readonly value: number;
  readonly onChange: (value: number) => void;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  /** Drawn after the number, e.g. `semanas`. */
  readonly unit?: string;
  /** How the number reads. Seconds counted, minutes shown: `90` → `1 min 30 s`. */
  readonly format?: (value: number) => string;
  /** A quiet second line under the value, for what the number is of. */
  readonly caption?: string;
  /** Fills the row it is in. Off by default: a stepper is as wide as its number. */
  readonly grow?: boolean;
  /** `lg` makes the number the poster of the screen; it always fills its row. */
  readonly size?: "md" | "lg";
  readonly disabled?: boolean;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function Stepper({
  accessibilityLabel,
  value,
  onChange,
  min = 1,
  max = 99,
  step = 1,
  unit,
  format,
  caption,
  grow,
  size = "md",
  disabled,
  testID,
  style,
}: StepperProps) {
  const theme = useTheme();
  const canDecrease = !disabled && value - step >= min;
  const canIncrease = !disabled && value + step <= max;
  if (size === "lg") {
    const box = {
      backgroundColor: theme.color.background.surfaceMuted,
      borderColor: theme.color.border.subtle,
    };
    return (
      <View
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ min, max, now: value, text: spoken(value, format, unit) }}
        testID={testID}
        style={[styles.large, style]}
      >
        <Target
          glyph="subtract"
          label={`Quitar ${unit ?? ""}`.trim()}
          enabled={canDecrease}
          onPress={() => onChange(value - step)}
          style={[styles.largeTarget, box]}
        />
        <View style={[styles.largeValue, box, { borderColor: theme.color.border.accent }]}>
          <Text
            role="poster"
            size="5xl"
            color={disabled ? "disabled" : "accent"}
            numberOfLines={1}
            style={styles.poster}
          >
            {format ? format(value) : String(value)}
          </Text>
          {unit ? (
            <Text role="label" size="sm" color="secondary" uppercase>
              {unit}
            </Text>
          ) : null}
        </View>
        <Target
          glyph="add"
          label={`Agregar ${unit ?? ""}`.trim()}
          enabled={canIncrease}
          onPress={() => onChange(value + step)}
          style={[styles.largeTarget, box]}
        />
      </View>
    );
  }

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      // What is announced is what is drawn: a stepper counting seconds and reading
      // «1 min 30 s» must not tell a screen reader «90».
      accessibilityValue={{ min, max, now: value, text: spoken(value, format, unit) }}
      testID={testID}
      style={[
        styles.base,
        grow ? styles.grown : null,
        {
          backgroundColor: theme.color.background.surface,
          borderColor: theme.color.border.subtle,
        },
        style,
      ]}
    >
      <Target
        glyph="subtract"
        label={`Quitar ${unit ?? ""}`.trim()}
        enabled={canDecrease}
        onPress={() => onChange(value - step)}
      />
      <View style={[styles.value, grow ? styles.valueGrown : null]}>
        <Text role="display" size={format ? "2xl" : "lg"} numberOfLines={1}>
          {format ? format(value) : String(value)}
        </Text>
        {unit ? (
          <Text role="label" size="2xs" color="muted" uppercase>
            {unit}
          </Text>
        ) : null}
        {caption ? (
          <Text role="body" size="2xs" color="muted" numberOfLines={1}>
            {caption}
          </Text>
        ) : null}
      </View>
      <Target
        glyph="add"
        label={`Agregar ${unit ?? ""}`.trim()}
        enabled={canIncrease}
        onPress={() => onChange(value + step)}
      />
    </View>
  );
}

function Target({
  glyph,
  label,
  enabled,
  onPress,
  style,
}: {
  readonly glyph: "subtract" | "add";
  readonly label: string;
  readonly enabled: boolean;
  readonly onPress: () => void;
  readonly style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !enabled }}
      disabled={!enabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.target,
        style,
        { opacity: enabled ? (pressed ? 0.6 : 1) : 0.35 },
      ]}
    >
      <FoundationIcon
        name={glyph}
        size="sm"
        color={enabled ? theme.color.icon.primary : theme.color.icon.secondary}
        decorative
      />
    </Pressable>
  );
}

function spoken(value: number, format?: (value: number) => string, unit?: string) {
  if (format) return format(value);
  return unit ? `${value} ${unit}` : String(value);
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 14,
  },
  grown: { alignSelf: "stretch" },
  target: { width: TARGET, height: TARGET, alignItems: "center", justifyContent: "center" },
  value: { width: VALUE_WIDTH, alignItems: "center", gap: 1 },
  // Takes the room the two targets leave, rather than a width of its own: a formatted
  // value is «1 min 30 s» one moment and «45 s» the next.
  valueGrown: { flex: 1, width: undefined, paddingVertical: 10 },
  large: { flexDirection: "row", alignItems: "stretch", alignSelf: "stretch", gap: 10 },
  largeTarget: { width: 56, height: undefined, borderRadius: 18, borderWidth: 1.5 },
  largeValue: {
    flex: 1,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    gap: 8,
    borderRadius: 18,
    borderWidth: 1.5,
    paddingVertical: 10,
  },
  poster: { paddingTop: 8, paddingRight: 4 },
});
