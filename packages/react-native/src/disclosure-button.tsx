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
 *
 * **The label is set in the control role, not the display one.** Condensed uppercase
 * belongs to a heading that is read once; this is a control whose label is read
 * every time the screen is scanned, and at that job it was the thing people disliked
 * before they could say why.
 *
 * **`variant="field"` reads as a form field that opens a picker**: the glyph, the value
 * in the control role, and `actionLabel` («Cambiar») in the accent before the chevron,
 * on the field's own ground. The form names the field above it, as it names a
 * `TextField`, so `label` here is only spoken. It is what a form wants for a value
 * chosen on another screen — an area of the body, a day — where the stacked variant
 * reads as a filter.
 */

import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { FoundationIcon, type IconName } from "./icons.js";
import { Text } from "./text.js";
import { useTheme } from "./theme.js";

const ICON_SIZE = "sm";

/** Two lines of text and air, past the platform touch target. */
const MIN_HEIGHT = 58;

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
  /** `field` draws one line on a field's ground; `stacked`, the default, two lines. */
  readonly variant?: "stacked" | "field";
  /** The word before the chevron on a `field`, such as «Cambiar». */
  readonly actionLabel?: string;
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
  variant = "stacked",
  actionLabel,
  accessibilityLabel,
  testID,
  style,
}: DisclosureButtonProps) {
  const theme = useTheme();
  const on = active === true && disabled !== true;
  if (variant === "field") {
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
          styles.field,
          {
            borderColor: disabled ? theme.color.action.disabled : theme.color.border.subtle,
            backgroundColor: theme.color.background.surfaceSubtle,
            borderRadius: theme.semanticRadius.control,
            paddingHorizontal: theme.semanticSpacing.controlInsetX,
            opacity: pressed && !disabled ? 0.7 : 1,
          },
          grow ? styles.grow : null,
          style,
        ]}
      >
        {icon === undefined ? null : (
          <FoundationIcon
            name={icon}
            size={ICON_SIZE}
            color={disabled ? theme.color.text.disabled : theme.color.icon.accent}
            decorative
          />
        )}
        <Text
          role="control"
          size="sm"
          numberOfLines={1}
          color={disabled ? "disabled" : on ? "primary" : "muted"}
          style={styles.text}
        >
          {value}
        </Text>
        {actionLabel === undefined ? null : (
          <Text role="control" size="xs" color={disabled ? "disabled" : "accent"}>
            {actionLabel}
          </Text>
        )}
        <FoundationIcon
          name="next"
          size="xs"
          color={disabled ? theme.color.text.disabled : theme.color.icon.secondary}
          decorative
        />
      </Pressable>
    );
  }

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
        <Text role="control" size="sm" numberOfLines={1} style={{ color: ink() }}>
          {label}
        </Text>
        <Text
          role="body"
          size="sm"
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
  field: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 2,
  },
  text: { flex: 1, gap: 1, minWidth: 0 },
});
