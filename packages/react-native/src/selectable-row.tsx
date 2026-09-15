/**
 * A row somebody adds to a set, with the mark that says it is in.
 *
 * `Checkbox` is the affirmation of a sentence and draws that sentence in body
 * text; this is a thing being chosen from a list of things, so it leads with a
 * name and carries a second line describing it. Picking exercises for a routine is
 * the first use: "Press de banca con barra" over "Pecho · Tríceps · Barra · Banco".
 *
 * The role is still `checkbox`, because that is what it is — several can be on at
 * once and nothing happens until the list is confirmed. A `button` would announce
 * an action that does not occur, and a `radio` would promise the opposite of
 * multiple choice.
 *
 * **The whole row is the target.** A 22 pt mark is under the 44 pt DT-010 asks
 * for, and shrinking the reach to the mark would make the name decoration. The row
 * is the control; the mark only reports.
 *
 * Selection is carried by the border and the name's colour rather than by the mark
 * alone, so it survives a glance down a long list — the same reason `Chip`
 * thickens its ring.
 *
 * **A secondary action sits outside the row's press area.** Picking an exercise and
 * reading about it are different intents, and a row that did both on one tap would do
 * the wrong one half the time. `action` renders its own 44 pt target at the trailing
 * edge, with its own accessible name, and the row keeps its own. Nothing is nested:
 * a `checkbox` that contained a second control without naming it would leave a screen
 * reader announcing one thing and doing another.
 */

import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { FoundationIcon, type IconName } from "./icons.js";
import { Text } from "./text.js";
import { useTheme } from "./theme.js";

/** Reads as a mark beside a name without competing with it. */
const MARK_SIZE = 22;

const MARK_GLYPH_SIZE = 13;

/** Two lines of text plus air, and comfortably past the platform touch target. */
const MIN_HEIGHT = 56;

/** The whole target, not the glyph: DT-010 measures what the finger can hit. */
const ACTION_SIZE = 44;

const ACTION_GLYPH = "sm";

export type SelectableRowProps = {
  /** What is being chosen. Leads the row and is the accessible name. */
  readonly name: string;
  /** What it is, in one line. Absent when there is nothing worth saying. */
  readonly caption?: string;
  readonly selected: boolean;
  readonly onPress: () => void;
  /** A second, different intent — reading about the thing rather than choosing it. */
  readonly action?: {
    readonly icon: IconName;
    readonly accessibilityLabel: string;
    readonly onPress: () => void;
  };
  readonly disabled?: boolean;
  readonly accessibilityLabel?: string;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function SelectableRow({
  name,
  caption,
  selected,
  onPress,
  action,
  disabled,
  accessibilityLabel,
  testID,
  style,
}: SelectableRowProps) {
  const theme = useTheme();

  const border = () => {
    if (disabled) return theme.color.action.disabled;
    return selected ? theme.color.border.accent : theme.color.border.subtle;
  };

  const background = () => {
    if (disabled) return theme.color.background.surfaceSubtle;
    return selected ? theme.color.accent.tonal : theme.color.background.surface;
  };

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel ?? name}
      accessibilityHint={caption}
      accessibilityState={{ checked: selected, disabled: disabled === true }}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        {
          borderColor: border(),
          backgroundColor: background(),
          // Thicker when chosen, with the padding compensating so nothing shifts.
          borderWidth: selected ? 1.5 : 1,
          paddingHorizontal: selected ? 12.5 : 13,
          opacity: pressed && !disabled ? 0.7 : 1,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.mark,
          {
            borderColor: selected ? theme.color.border.accent : theme.color.border.default,
            backgroundColor: selected ? theme.color.action.primary : "transparent",
          },
        ]}
      >
        {selected ? (
          <FoundationIcon
            name="check"
            customSize={MARK_GLYPH_SIZE}
            color={theme.color.action.onPrimary}
            decorative
          />
        ) : null}
      </View>

      <View style={styles.body}>
        <Text
          role="display"
          size="md"
          uppercase
          numberOfLines={1}
          color={disabled ? "disabled" : selected ? "accent" : "primary"}
        >
          {name}
        </Text>
        {caption === undefined ? null : (
          <Text role="body" size="xs" color="muted" numberOfLines={1}>
            {caption}
          </Text>
        )}
      </View>

      {action === undefined ? null : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={action.accessibilityLabel}
          disabled={disabled}
          onPress={action.onPress}
          style={({ pressed }) => [styles.action, { opacity: pressed && !disabled ? 0.6 : 1 }]}
        >
          <FoundationIcon
            name={action.icon}
            size={ACTION_GLYPH}
            color={disabled ? theme.color.text.disabled : theme.color.icon.secondary}
            decorative
          />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_HEIGHT,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingVertical: 11,
  },
  mark: {
    width: MARK_SIZE,
    height: MARK_SIZE,
    flexBasis: MARK_SIZE,
    flexGrow: 0,
    flexShrink: 0,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, gap: 3, minWidth: 0 },
  action: {
    width: ACTION_SIZE,
    height: ACTION_SIZE,
    alignItems: "center",
    justifyContent: "center",
    // Eats into the row's padding rather than widening it, so the row keeps its height.
    marginRight: -10,
  },
});
