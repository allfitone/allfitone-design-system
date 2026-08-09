/**
 * Action component for React Native surfaces.
 *
 * Ink & Signal makes standalone actions pills, which is why the radius comes
 * from `semanticRadius.action` rather than from the control radius used by
 * fields.
 *
 * The minimum height is the platform touch target, not a design decision:
 * `docs/ACCESSIBILITY.md` makes 44 pt on iOS and 48 dp on Android a launch
 * requirement, and a product cannot shrink it below that. It may grow.
 *
 * `primary` uses the brand cyan, which the system reserves for action, focus and
 * selection. Since only one visual emphasis is allowed per screen, a screen with
 * two primary buttons is a design error this component cannot catch — worth
 * knowing before reaching for a second one.
 */

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { Text } from "./text.js";
import { useTheme, type Theme } from "./theme.js";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export type ButtonProps = Omit<PressableProps, "style" | "children"> & {
  readonly label: string;
  readonly variant?: ButtonVariant;
  readonly loading?: boolean;
  readonly style?: StyleProp<ViewStyle>;
};

type ButtonPalette = {
  readonly background: string;
  readonly border: string | null;
  readonly foreground: string;
};

function resolvePalette(theme: Theme, variant: ButtonVariant, disabled: boolean): ButtonPalette {
  if (disabled) {
    return {
      background: variant === "ghost" ? "transparent" : theme.color.action.disabled,
      border: null,
      foreground: theme.color.action.onDisabled,
    };
  }

  switch (variant) {
    case "primary":
      return {
        background: theme.color.action.primary,
        border: null,
        foreground: theme.color.action.onPrimary,
      };
    case "secondary":
      return {
        background: theme.color.action.secondary,
        border: theme.color.border.subtle,
        foreground: theme.color.action.onSecondary,
      };
    case "ghost":
      return { background: "transparent", border: null, foreground: theme.color.text.accent };
  }
}

export function Button({
  label,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  ...props
}: ButtonProps) {
  const theme = useTheme();
  const inactive = disabled || loading;
  const palette = resolvePalette(theme, variant, inactive);

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: theme.touchTarget,
          paddingHorizontal: theme.spacing[6],
          paddingVertical: theme.spacing[3],
          borderRadius: theme.semanticRadius.action,
          backgroundColor: palette.background,
          borderWidth: palette.border ? StyleSheet.hairlineWidth * 2 : 0,
          borderColor: palette.border ?? undefined,
        },
        // Opacity rather than a hover token: React Native has no hover, and the
        // press state has to read on both themes without a second palette.
        pressed ? styles.pressed : null,
        style,
      ]}
    >
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={palette.foreground} />
        </View>
      ) : null}
      <Text
        role="control"
        size="sm"
        style={{ color: palette.foreground, opacity: loading ? 0 : 1 }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  pressed: {
    opacity: 0.82,
  },
  loading: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
