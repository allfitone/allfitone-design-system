/**
 * A statement the person affirms, with the mark that says they did.
 *
 * The role is `checkbox`, not `switch`, and that is the whole design. A switch
 * announces "on/off" and, on both platforms, promises an effect that lands the
 * moment it moves; these affirmations land when the form is submitted, so a
 * switch would move and do nothing. "Marked" is also what an affirmation is:
 * a declaration of age or an acceptance of terms is an act, not a preference,
 * and preferences are the things people flip without reading.
 *
 * What was rejected is the platform checkbox, not the semantics. The mark fills
 * with the accent colour, which Ink & Signal already reserves for selection, so
 * an affirmed statement reads the same way a filled `CodeField` box does.
 *
 * The label is required and always drawn: there is no such thing here as a mark
 * without the sentence it affirms, and the sentence is the part a copy review
 * needs to see. It doubles as the accessible name.
 *
 * `error` takes a message rather than a boolean, for the reason `TextField`
 * documents: a control that turns red without saying why makes the person guess.
 * An empty string marks without explaining, for when one message covers several
 * statements at once.
 *
 * The mark is nudged up onto the first line of the statement. Both boxes begin at
 * the same y under `flex-start`, but the mark is taller than a line of body text,
 * so its centre lands below the centre of the words beside it and reads as
 * dropped. The nudge is derived from the resolved line height rather than fixed,
 * so changing the type scale cannot silently unalign it.
 */

import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { FoundationIcon } from "./icons.js";
import { Text } from "./text.js";
import { useTheme } from "./theme.js";
import { resolveTextStyle } from "./typography-style.js";

/** Reads as a target beside body text without outweighing the sentence. */
const MARK_SIZE = 26;

const MARK_GLYPH_SIZE = 16;

const STATEMENT_ROLE = "body";
const STATEMENT_SIZE = "sm";

/** Centres the mark on the first line rather than on the whole block. */
function markOffset(): number {
  const { lineHeight } = resolveTextStyle(STATEMENT_ROLE, STATEMENT_SIZE);
  if (typeof lineHeight !== "number") return 0;
  return Math.round((lineHeight - MARK_SIZE) / 2);
}

export type CheckboxProps = {
  /** The statement being affirmed. Rendered, and used as the accessible name. */
  readonly label: string;
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly disabled?: boolean;
  readonly error?: string;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function Checkbox({
  label,
  checked,
  onChange,
  disabled,
  error,
  testID,
  style,
}: CheckboxProps) {
  const theme = useTheme();
  const invalid = error !== undefined;

  const markBorder = () => {
    if (disabled) return theme.color.action.disabled;
    if (invalid) return theme.color.status.danger;
    return checked ? theme.color.border.accent : theme.color.border.default;
  };

  return (
    <View style={[{ gap: theme.spacing[2] }, style]}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={label}
        accessibilityState={{ checked, disabled: Boolean(disabled) }}
        disabled={disabled}
        onPress={() => onChange(!checked)}
        testID={testID}
        style={[styles.row, { gap: theme.spacing[3], minHeight: theme.touchTarget }]}
      >
        <View
          style={{
            width: MARK_SIZE,
            height: MARK_SIZE,
            marginTop: markOffset(),
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.semanticRadius.controlSmall,
            borderColor: markBorder(),
            // Constant, as in `TextField`: in Yoga the border is part of the box,
            // so widening it on affirm would shift the sentence beside it.
            borderWidth: 2,
            ...(checked && !disabled ? { backgroundColor: theme.color.border.accent } : {}),
          }}
        >
          {checked ? (
            <FoundationIcon
              name="check"
              color={disabled ? theme.color.action.onDisabled : theme.color.accent.onAccent}
              customSize={MARK_GLYPH_SIZE}
              decorative
            />
          ) : null}
        </View>

        <Text
          role={STATEMENT_ROLE}
          size={STATEMENT_SIZE}
          color={disabled ? "muted" : checked ? "primary" : "secondary"}
          style={styles.statement}
        >
          {label}
        </Text>
      </Pressable>

      {error ? (
        <Text role="label" size="xs" color="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    // Top-aligned, not centred: a statement that wraps to three lines must keep
    // its mark beside the first line.
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  statement: {
    flex: 1,
  },
});
