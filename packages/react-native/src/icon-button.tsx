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
 *
 * **`squircle` is a shape, not a second component.** A control that sits on top of
 * content — over a photograph, in the corner of a card — reads as part of that card
 * when it shares its corner, and as a floating bubble when it does not. The size and
 * the reach do not change with the shape: only the radius does.
 *
 * **`solid` is the affirmative action, so it carries the accent gradient**, the same
 * as `Button`'s primary variant. A screen whose confirm is a round tick and one whose
 * confirm is a labelled pill were painted differently for no reason anybody could
 * name — `gradient.signal` is the token for primary CTAs, and a tick that commits a
 * screen is one.
 *
 * **`plain` at full size is a glyph alone in a corner** — the way back from a screen
 * with no header. With no circle to give it presence, a 16 px glyph in the secondary ink
 * nearly vanished, so it draws at 24 in the primary ink with the compact stroke. The
 * compact `plain`, a glyph beside content, keeps the quiet 16.
 *
 * **`xs` is the glyph with no circle around it** — the trash can at the end of an
 * exercise's row. A 36 circle there took the width the row's caption needed and broke
 * it onto two lines; the glyph takes 16 and lends the rest of the target from slop.
 */

import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

import { resolveAccentGradient } from "./accent-gradient.js";
import { FoundationIcon, type IconName } from "./icons.js";
import { iconButtonBox, type IconButtonSize } from "./icon-button-look.js";
import { useTheme, type Theme } from "./theme.js";

export type { IconButtonSize } from "./icon-button-look.js";

export type IconButtonVariant = "outline" | "solid" | "plain";
export type IconButtonShape = "round" | "squircle";

export type IconButtonProps = Omit<PressableProps, "style" | "children"> & {
  readonly icon: IconName;
  /** Announced, never drawn. An icon alone says nothing to a screen reader. */
  readonly accessibilityLabel: string;
  readonly variant?: IconButtonVariant;
  /**
   * `sm` matches `Button`'s compact size, for a row of actions beside content. `xs` is
   * the glyph alone, for the end of a crowded row; only `plain` is drawn at `xs`.
   */
  readonly size?: IconButtonSize;
  /** `squircle` for a control laid over a card, so it shares the card's corner. */
  readonly shape?: IconButtonShape;
  readonly style?: StyleProp<ViewStyle>;
};

type IconButtonPalette = {
  readonly background: string;
  readonly border: string | null;
  readonly foreground: string;
  /** Only the solid variant carries the accent gradient. */
  readonly gradient: boolean;
};

function resolvePalette(theme: Theme, variant: IconButtonVariant, disabled: boolean): IconButtonPalette {
  if (disabled) {
    return {
      background: variant === "solid" ? theme.color.action.disabled : "transparent",
      border: null,
      foreground: theme.color.action.onDisabled,
      gradient: false,
    };
  }

  switch (variant) {
    case "outline":
      return {
        background: theme.color.background.surface,
        border: theme.color.border.subtle,
        foreground: theme.color.icon.primary,
        gradient: false,
      };
    case "solid":
      return {
        background: theme.color.action.primary,
        border: null,
        foreground: theme.color.action.onPrimary,
        gradient: true,
      };
    case "plain":
      return {
        background: "transparent",
        border: null,
        foreground: theme.color.icon.secondary,
        gradient: false,
      };

  }
}

export function IconButton({
  icon,
  accessibilityLabel,
  variant = "outline",
  size: scale = "md",
  shape = "round",
  disabled,
  style,
  ...props
}: IconButtonProps) {
  const theme = useTheme();
  const inactive = disabled === true;
  const palette = resolvePalette(theme, variant, inactive);
  const alone = variant === "plain" && scale === "md";
  const ink = alone && !inactive ? theme.color.icon.primary : palette.foreground;
  const accent = resolveAccentGradient();
  const { box: size, reach } = iconButtonBox(scale, theme.touchTarget);

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: inactive }}
      disabled={inactive}
      // Same bargain as `Button`'s compact size: the height goes, the reach stays.
      {...(reach > 0 ? { hitSlop: reach } : {})}
      style={({ pressed }) => [
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: shape === "squircle" ? theme.radius.lg : size / 2,
          backgroundColor: palette.gradient ? "transparent" : palette.background,
          borderWidth: palette.border ? StyleSheet.hairlineWidth * 3 : 0,
          borderColor: palette.border ?? undefined,
        },
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

      <View pointerEvents="none">
        <FoundationIcon
          name={icon}
          size={alone ? "lg" : "sm"}
          strokeScale={alone ? "compact" : "default"}
          color={ink}
          decorative
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // The gradient is an absolutely positioned child, so it is clipped to the circle
  // rather than painted over its corners.
  base: { alignItems: "center", justifyContent: "center", overflow: "hidden" },
  // Opacity rather than a hover token: React Native has no hover, and the press
  // state has to read on both themes without a second palette.
  pressed: { opacity: 0.82 },
});
