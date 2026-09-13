/**
 * A picture, a name and how many — chosen by tapping it.
 *
 * `Chip` is a word and `SelectableRow` is a line in a list; this is for a set
 * somebody recognises by sight before they read it. Equipment is the first use:
 * a barbell is faster to find as a barbell than as the word "barra".
 *
 * **The picture is `children`.** The Design System knows nothing about a product's
 * assets and must not learn: a `source` prop here would mean either bundling
 * images into the library or inventing a path convention for the consumer. The
 * caller passes an `Image`, an icon, or whatever it has; the tile lays it out.
 *
 * `count` says how much is behind the tile — nine exercises, four routines — and
 * is the difference between a filter somebody trusts and one they try blind. It
 * renders in the `data` role, which is where tabular figures live, so a grid of
 * tiles does not jitter as the numbers change.
 *
 * The role is `checkbox` for the same reason `SelectableRow` uses it: several can
 * be on at once and nothing lands until the set is applied.
 */

import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Text } from "./text.js";
import { useTheme } from "./theme.js";

/** Tall enough for a picture, a name of two lines and a number under it. */
const MIN_HEIGHT = 126;

export type SelectableTileProps = {
  readonly name: string;
  /** How many things this tile stands for. Absent when the count means nothing. */
  readonly count?: number;
  readonly selected: boolean;
  readonly onPress: () => void;
  readonly disabled?: boolean;
  /** The picture. An `Image`, an icon, anything the caller already has. */
  readonly children?: React.ReactNode;
  readonly accessibilityLabel?: string;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function SelectableTile({
  name,
  count,
  selected,
  onPress,
  disabled,
  children,
  accessibilityLabel,
  testID,
  style,
}: SelectableTileProps) {
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
      accessibilityState={{ checked: selected, disabled: disabled === true }}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        {
          borderColor: border(),
          backgroundColor: background(),
          borderWidth: selected ? 1.5 : 1,
          paddingHorizontal: selected ? 7.5 : 8,
          opacity: pressed && !disabled ? 0.7 : 1,
        },
        style,
      ]}
    >
      {children === undefined ? null : <View style={styles.picture}>{children}</View>}

      <Text
        role="display"
        size="sm"
        uppercase
        align="center"
        numberOfLines={2}
        color={disabled ? "disabled" : selected ? "accent" : "primary"}
      >
        {name}
      </Text>

      {count === undefined ? null : (
        <Text role="data" size="2xs" color={selected ? "secondary" : "muted"}>
          {String(count)}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_HEIGHT,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 10,
  },
  picture: { alignItems: "center", justifyContent: "center" },
});
