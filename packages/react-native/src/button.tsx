/**
 * Action component for React Native surfaces.
 *
 * Ink & Signal makes standalone actions pills, which is why the radius comes
 * from `semanticRadius.action` rather than from the control radius used by
 * fields.
 *
 * The primary variant is painted with `gradient.signal`, not with a flat
 * `action.primary`. That is what the token declares it for — "hero cards,
 * primary CTAs" — and what the web adapter already does through
 * `--afo-gradient-accent`. A flat fill here made the same button look
 * measurably cheaper on the phone than in the Explorer.
 *
 * The `danger` variant is a flat `status.danger` fill and deliberately not a
 * gradient. `gradient.tsx` spends the one accent surface a screen is allowed on a
 * signal, and a destructive action is not a signal: it is a plain filled control
 * that happens to be red, so it stays a fill and leaves that budget alone.
 *
 * The minimum height is the platform touch target, not a design decision:
 * `docs/ACCESSIBILITY.md` makes 44pt on iOS and 48dp on Android a launch
 * requirement, so a product may grow it but not shrink it.
 *
 * Cyan is reserved for action, focus and selection, and only one visual emphasis
 * is allowed per screen. A screen with two primary buttons is a design error
 * this component cannot catch — worth knowing before reaching for a second one.
 */

import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { resolveAccentGradient } from "./accent-gradient.js";
import { resolveShadowStyle } from "./shadow-style.js";
import { FoundationIcon, type IconName } from "./icons.js";
import { Text } from "./text.js";
import { useTheme, type Theme } from "./theme.js";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export type ButtonProps = Omit<PressableProps, "style" | "children"> & {
  readonly label: string;
  /**
   * A glyph before the label, for actions whose meaning is carried by both. It is
   * always decorative: the label already names the action, and a second
   * announcement would make every button read twice to a screen reader.
   */
  readonly icon?: IconName | undefined;
  readonly variant?: ButtonVariant;
  /**
   * `sm` is for a row of actions that sit beside content rather than leading it —
   * a toolbar under a table, not the confirm of a screen. It gives up height, never
   * reach: the touch target stays 44 through `hitSlop`.
   */
  readonly size?: ButtonSize;
  readonly loading?: boolean;
  readonly style?: StyleProp<ViewStyle>;
};

export type ButtonSize = "md" | "sm";

/** Visibly lighter, and still a full target once the slop is counted. */
const COMPACT_HEIGHT = 36;
const COMPACT_REACH = { top: 4, bottom: 4, left: 4, right: 4 };

type ButtonPalette = {
  readonly background: string;
  readonly border: string | null;
  readonly foreground: string;
  /** Only the primary variant carries the accent gradient. */
  readonly gradient: boolean;
};

function resolvePalette(theme: Theme, variant: ButtonVariant, disabled: boolean): ButtonPalette {
  if (disabled) {
    return {
      background: variant === "ghost" ? "transparent" : theme.color.action.disabled,
      border: null,
      foreground: theme.color.action.onDisabled,
      gradient: false,
    };
  }

  switch (variant) {
    case "primary":
      return {
        background: theme.color.action.primary,
        border: null,
        foreground: theme.color.action.onPrimary,
        gradient: true,
      };
    case "secondary":
      return {
        background: theme.color.action.secondary,
        border: theme.color.border.subtle,
        foreground: theme.color.action.onSecondary,
        gradient: false,
      };
    case "ghost":
      return {
        background: "transparent",
        border: null,
        foreground: theme.color.text.accent,
        gradient: false,
      };
    // The system had the colour and not the control, so deleting was drawn as a
    // ghost and read like every other secondary choice on the screen.
    case "danger":
      return {
        background: theme.color.status.danger,
        border: null,
        foreground: theme.color.status.onStatus,
        gradient: false,
      };
  }
}

export function Button({
  label,
  icon,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  style,
  ...props
}: ButtonProps) {
  const theme = useTheme();
  const inactive = disabled || loading;
  const palette = resolvePalette(theme, variant, inactive);

  const accent = resolveAccentGradient();

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      // A compact button keeps the full reach it gives up in height. Accessibility is
      // measured on what the finger can hit, not on what the eye can see.
      {...(size === "sm" ? { hitSlop: COMPACT_REACH } : {})}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: size === "sm" ? COMPACT_HEIGHT : theme.touchTarget,
          borderRadius: theme.semanticRadius.action,
          backgroundColor: palette.gradient ? "transparent" : palette.background,
          borderWidth: palette.border ? StyleSheet.hairlineWidth * 2 : 0,
          borderColor: palette.border ?? undefined,
        },
        // Ghost sits inline with text and would look detached with elevation.
        variant === "ghost" || inactive ? null : resolveShadowStyle("control"),
        // Opacity rather than a hover token: React Native has no hover, and the
        // press state has to read on both themes without a second palette.
        pressed ? styles.pressed : null,
        style,
      ]}
    >
      {palette.gradient ? (
        <LinearGradient
          colors={accent.colors}
          locations={accent.locations}
          start={accent.start}
          end={accent.end}
          style={StyleSheet.absoluteFill}
        />
      ) : null}

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={palette.foreground} />
        </View>
      ) : null}

      <View
        style={[
          styles.content,
          {
            paddingHorizontal: theme.spacing[size === "sm" ? 4 : 6],
            paddingVertical: theme.spacing[size === "sm" ? 2 : 3],
            opacity: loading ? 0 : 1,
          },
        ]}
      >
        {icon ? (
          <FoundationIcon name={icon} size="sm" color={palette.foreground} decorative />
        ) : null}
        <Text
          role="control"
          size={size === "sm" ? "sm" : "md"}
          style={{ color: palette.foreground }}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { flexDirection: "row", alignItems: "center", gap: 8 },
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    // The gradient is an absolutely positioned child, so it has to be clipped
    // to the pill rather than painted over its corners.
    overflow: "hidden",
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
