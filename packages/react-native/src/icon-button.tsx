/**
 * An action carried by a glyph alone.
 *
 * Every screen that needs one — closing a session, opening notifications, going back
 * — was drawing its own circle, and three hand-built circles are three sizes, three
 * borders and three hit areas. This is the one.
 *
 * **The label is required and never drawn.** An icon-only control is invisible to a
 * screen reader without it, and `docs/ACCESSIBILITY.md` makes that a launch condition,
 * not a nicety. There is no prop to opt out.
 *
 * Round, at the platform touch target, so it stays a target on both platforms rather
 * than the size a particular canvas happened to draw.
 */

import { Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

import { FoundationIcon, type IconName } from "./icons.js";
import { useTheme, type Theme } from "./theme.js";

export type IconButtonVariant = "outline" | "solid" | "plain";

export type IconButtonProps = Omit<PressableProps, "style" | "children"> & {
  readonly icon: IconName;
  /** Announced, never drawn. An icon alone says nothing to a screen reader. */
  readonly accessibilityLabel: string;
  readonly variant?: IconButtonVariant;
  readonly style?: StyleProp<ViewStyle>;
};

type IconButtonPalette = {
  readonly background: string;
  readonly border: string | null;
  readonly foreground: string;
};

function resolvePalette(theme: Theme, variant: IconButtonVariant, disabled: boolean): IconButtonPalette {
  if (disabled) {
    return {
      background: variant === "solid" ? theme.color.action.disabled : "transparent",
      border: null,
      foreground: theme.color.action.onDisabled,
    };
  }

  switch (variant) {
    case "outline":
      return {
        background: theme.color.background.surface,
        border: theme.color.border.subtle,
        foreground: theme.color.icon.primary,
      };
    case "solid":
      return {
        background: theme.color.action.primary,
        border: null,
        foreground: theme.color.action.onPrimary,
      };
    case "plain":
      return {
        background: "transparent",
        border: null,
        foreground: theme.color.icon.secondary,
      };
  }
}

export function IconButton({
  icon,
  accessibilityLabel,
  variant = "outline",
  disabled,
  style,
  ...props
}: IconButtonProps) {
  const theme = useTheme();
  const inactive = disabled === true;
  const palette = resolvePalette(theme, variant, inactive);
  const size = theme.touchTarget;

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: inactive }}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: palette.background,
          borderWidth: palette.border ? StyleSheet.hairlineWidth * 3 : 0,
          borderColor: palette.border ?? undefined,
        },
        pressed ? styles.pressed : null,
        style,
      ]}
    >
      <View pointerEvents="none">
        <FoundationIcon name={icon} size="sm" color={palette.foreground} decorative />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center" },
  // Opacity rather than a hover token: React Native has no hover, and the press
  // state has to read on both themes without a second palette.
  pressed: { opacity: 0.82 },
});
