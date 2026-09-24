/**
 * One number in a row, typed rather than stepped.
 *
 * **It exists because `Stepper` cannot reach a weight.** Going from nothing to 60 kg
 * in plates of 2.5 is twenty-four presses. A stepper is right for a value that moves
 * by one from where it already is — weeks in a programme, repetitions from eight to
 * nine — and wrong for one that is entered from scratch. This is the other half of
 * that pair, and it is also the only one of the two that fits several to a row.
 *
 * **Empty is a value, not a zero.** A field nobody has filled answers `undefined`,
 * because on a prescription zero is something somebody meant — bodyweight, no rest —
 * and parking the control at zero says it for them. That is the same distinction
 * `target_rest_seconds` is documented with, kept in the control that captures it.
 *
 * **What is typed stays typed until focus leaves.** The text is held locally and the
 * number is reported as it parses, so a «6» on the way to «60» is not rewritten under
 * the finger, and a value out of range leaves the last good number rather than
 * clearing the row.
 */

import { useState } from "react";
import { TextInput, View, type StyleProp, type ViewStyle } from "react-native";

import { Text } from "./text.js";
import { useTheme } from "./theme.js";
import { resolveTextStyle } from "./typography-style.js";

/** Resolved once: a row of these would otherwise resolve the same style per field. */
const ENTRY = resolveTextStyle("control", "sm");

export type NumberFieldProps = {
  /** Names what is being counted, for the screen reader. Not drawn. */
  readonly accessibilityLabel: string;
  readonly value: number | undefined;
  readonly onChange: (value: number | undefined) => void;
  /** Drawn after the number, small and quiet: `reps`, `kg`. */
  readonly unit?: string;
  readonly min?: number;
  readonly max?: number;
  /** Drawn in place of the field, for a value the row has but nobody may set. */
  readonly fixedAs?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function NumberField({
  accessibilityLabel,
  value,
  onChange,
  unit,
  min = 0,
  max = 9999,
  fixedAs,
  style,
}: NumberFieldProps) {
  const theme = useTheme();
  const [typed, setTyped] = useState<string | undefined>(undefined);

  if (fixedAs !== undefined) {
    return (
      <View style={[styles.box, styles.bare, style]}>
        <Text role="control" size="sm" color="muted">
          {fixedAs}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.box,
        { borderColor: theme.color.border.subtle, backgroundColor: theme.color.background.surface },
        style,
      ]}
    >
      <TextInput
        accessibilityLabel={accessibilityLabel}
        keyboardType="numeric"
        value={typed ?? (value === undefined ? "" : String(value))}
        placeholder="—"
        placeholderTextColor={theme.color.text.muted}
        onChangeText={(text) => {
          setTyped(text);
          if (text.trim() === "") return onChange(undefined);
          // A comma is what half the world types for a decimal, and `Number` reads
          // it as not-a-number rather than as the separator it plainly is.
          const parsed = Number(text.replace(",", "."));
          if (Number.isFinite(parsed) && parsed >= min && parsed <= max) onChange(parsed);
        }}
        onBlur={() => setTyped(undefined)}
        style={[styles.entry, { color: theme.color.text.primary }]}
      />
      {unit ? (
        <Text role="body" size="2xs" color="muted">
          {unit}
        </Text>
      ) : null}
    </View>
  );
}

const styles = {
  box: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    minWidth: 62,
    height: 40,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 12,
  },
  bare: { borderColor: "transparent" },
  // Family, size and tracking only. `lineHeight` on a `TextInput` throws Android's
  // vertical centring off, which is why `TextField` resolves it the same way.
  entry: {
    minWidth: 22,
    textAlign: "right",
    fontFamily: ENTRY.fontFamily,
    fontSize: ENTRY.fontSize,
    letterSpacing: ENTRY.letterSpacing,
    padding: 0,
  },
} as const;
