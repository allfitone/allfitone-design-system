/**
 * A control that says what it is set to, and opens the screen that sets it.
 *
 * The pattern every settings list has and this library did not: a label, the
 * current value under it, and a tap that leads somewhere. Filtering exercises is
 * the first use — "Musculatura / 3 grupos" beside "Equipamiento / cualquiera" —
 * where the alternative was nineteen chips on the screen they were filtering.
 *
 * **The value is part of the control, not a caption beside it.** A filter that
 * does not state what it is filtering by makes somebody open it to find out, and
 * that is the trip this exists to save. It is also the accessible value, so a
 * screen reader answers the question without the detour either.
 *
 * `active` is stated by the caller rather than inferred from the value: "any" and
 * "none" are different settings in some screens and the same in others, and the
 * library cannot know which. What it does is draw the accent when told.
 *
 * The role is `button` and not `checkbox`: nothing is chosen here, a screen is
 * opened. What lands there is that screen's business.
 */

import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { FoundationIcon, type IconName } from "./icons.js";
import { Text } from "./text.js";
import { useTheme } from "./theme.js";

const ICON_SIZE = "sm";

/** Two lines of text and air, past the platform touch target. */
const MIN_HEIGHT = 52;

export type DisclosureButtonProps = {
  readonly label: string;
  /** What it is set to, in the fewest words that are true. */
  readonly value: string;
  readonly onPress: () => void;
  readonly icon?: IconName;
  /** Whether it is doing anything. The caller decides what that means. */
  readonly active?: boolean;
  readonly disabled?: boolean;
  /** Fills the row it is in. Off by default. */
  readonly grow?: boolean;
  readonly accessibilityLabel?: string;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function DisclosureButton({
  label,
  value,
  onPress,
  icon,
  active,
  disabled,
  grow,
  accessibilityLabel,
  testID,
  style,
}: DisclosureButtonProps) {
  const theme = useTheme();
  const on = active === true && disabled !== true;

  const ink = () => {
    if (disabled) return theme.color.text.disabled;
    return on ? theme.color.text.accent : theme.color.text.primary;
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityValue={{ text: value }}
      accessibilityState={{ disabled: disabled === true }}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        {
          borderColor: disabled
            ? theme.color.action.disabled
            : on
              ? theme.color.border.accent
              : theme.color.border.subtle,
          backgroundColor: disabled
            ? theme.color.background.surfaceSubtle
            : on
              ? theme.color.accent.tonal
              : theme.color.background.surface,
          borderWidth: on ? 1.5 : 1,
          paddingHorizontal: on ? 13.5 : 14,
          opacity: pressed && !disabled ? 0.7 : 1,
        },
        grow ? styles.grow : null,
        style,
      ]}
    >
      {icon === undefined ? null : (
        <FoundationIcon name={icon} size={ICON_SIZE} color={ink()} decorative />
      )}
      <View style={styles.text}>
        <Text role="display" size="sm" uppercase numberOfLines={1} style={{ color: ink() }}>
          {label}
        </Text>
        <Text
          role="body"
          size="xs"
          color={disabled ? "disabled" : on ? "secondary" : "muted"}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_HEIGHT,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  grow: { flex: 1 },
  text: { flex: 1, gap: 1, minWidth: 0 },
});
