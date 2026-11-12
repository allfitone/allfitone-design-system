/**
 * A short choice among a few, drawn as a pill.
 *
 * The control a filter row and an option sheet are both made of: a word, a state,
 * and a target big enough to hit while walking. Selection is carried by the accent
 * — border and tonal fill — because Ink & Signal already reserves it for exactly
 * that, so a selected chip and a focused field say "this one" the same way.
 *
 * **It is not a button and not a checkbox.** A button performs; a chip declares
 * which of several things is meant, and the answer stays visible afterwards. The
 * accessibility role is `button` with `selected` state, which is what both
 * platforms read out for a segmented choice — `radio` would promise a group that a
 * single chip cannot guarantee it belongs to.
 *
 * `count` is drawn after the label for the case a filter has to say how much is
 * behind it. It is deliberately not a badge: a badge floats and reads as an alert,
 * and this is part of the same sentence as the word beside it.
 *
 * **One line, always.** A chip is a word or two; wrapped, it turns a row of choices into
 * a column of fragments. When the row is tight the label shrinks a little before it
 * would break. `size="sm"` is the compact chip for four or five answers that share one
 * row with `grow`, such as «Hoy · Esta semana · Este mes · Otra fecha».
 */

import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { FoundationIcon, type IconName } from "./icons.js";
import { Text } from "./text.js";
import { useTheme } from "./theme.js";

/** 44 px is the touch floor; a chip sits just under it and is never alone in a row. */
const HEIGHT = 40;
/** The compact chip; its row still reaches the touch floor through its spacing. */
const HEIGHT_SM = 36;

const ICON_SIZE = "sm";

export type ChipProps = {
  readonly label: string;
  readonly selected: boolean;
  readonly onPress: () => void;
  readonly icon?: IconName;
  readonly count?: number;
  readonly disabled?: boolean;
  /** Fills the row it is in. Off by default: a chip is as wide as its word. */
  readonly grow?: boolean;
  /** `sm` is shorter and set smaller, for several chips sharing one row. */
  readonly size?: "md" | "sm";
  readonly accessibilityLabel?: string;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function Chip({
  label,
  selected,
  onPress,
  icon,
  count,
  disabled,
  grow,
  size = "md",
  accessibilityLabel,
  testID,
  style,
}: ChipProps) {
  const theme = useTheme();

  const border = () => {
    if (disabled) return theme.color.action.disabled;
    return selected ? theme.color.border.accent : theme.color.border.subtle;
  };

  const background = () => {
    if (disabled) return theme.color.background.surfaceSubtle;
    return selected ? theme.color.accent.tonal : theme.color.background.surface;
  };

  const ink = () => {
    if (disabled) return theme.color.text.disabled;
    return selected ? theme.color.text.accent : theme.color.text.secondary;
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected, disabled: disabled === true }}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        {
          borderColor: border(),
          backgroundColor: background(),
          // The selected ring is thicker so selection survives a glance, and the
          // padding compensates so the label does not shift when it changes.
          borderWidth: selected ? 1.5 : 1,
          paddingHorizontal: (size === "sm" ? 8 : 14) - (selected ? 0.5 : 0),
          minHeight: size === "sm" ? HEIGHT_SM : HEIGHT,
          opacity: pressed && !disabled ? 0.7 : 1,
        },
        grow ? styles.grow : null,
        style,
      ]}
    >
      {icon ? <FoundationIcon name={icon} size={ICON_SIZE} color={ink()} decorative /> : null}
      <Text
        role="control"
        size={size === "sm" ? "xs" : "sm"}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
        style={{ color: ink(), flexShrink: 1 }}
      >
        {label}
      </Text>
      {count === undefined ? null : (
        <View style={styles.count}>
          <Text role="label" size="2xs" style={{ color: ink() }}>
            {String(count)}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: HEIGHT,
    borderRadius: HEIGHT / 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  grow: { flex: 1 },
  count: { opacity: 0.75 },
});
