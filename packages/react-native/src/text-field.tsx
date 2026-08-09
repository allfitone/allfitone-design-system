/**
 * Text entry for React Native surfaces.
 *
 * The border carries the state, not a coloured background: on the dark canvas a
 * tinted fill reads as disabled, and Ink & Signal keeps status colour for status.
 *
 * `error` takes a message rather than a boolean. A field that turns red without
 * saying why forces the person to guess, and the message is what the copy review
 * actually needs to see. Passing an empty string still marks the field, for the
 * case where one message covers several fields — a sign-in form must not say
 * which of the two was wrong, or it reveals which addresses are registered.
 *
 * The label is a real label wired to the input, so screen readers announce it
 * instead of the placeholder, which disappears the moment typing starts.
 */

import { useState } from "react";
import {
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import { Text } from "./text.js";
import { useTheme } from "./theme.js";
import { resolveTextStyle } from "./typography-style.js";

export type TextFieldProps = Omit<TextInputProps, "style" | "placeholderTextColor"> & {
  readonly label: string;
  readonly error?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function TextField({ label, error, style, onFocus, onBlur, ...props }: TextFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  // Family, size and tracking only. `lineHeight` on a TextInput throws off
  // vertical centring on Android, and the padding compensation the display roles
  // need would push the caret off centre here.
  const entry = resolveTextStyle("body", "md");

  const invalid = error !== undefined;
  const borderColor = invalid
    ? theme.color.status.danger
    : focused
      ? theme.color.border.accent
      : theme.color.border.subtle;

  return (
    <View style={[{ gap: theme.spacing[2] }, style]}>
      <Text role="label" size="xs" color="secondary" uppercase nativeID={`${label}-label`}>
        {label}
      </Text>

      <TextInput
        {...props}
        accessibilityLabel={label}
        aria-labelledby={`${label}-label`}
        placeholderTextColor={theme.color.text.muted}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={{
          minHeight: theme.touchTarget,
          paddingHorizontal: theme.semanticSpacing.controlInsetX,
          paddingVertical: theme.semanticSpacing.controlInsetY,
          borderRadius: theme.semanticRadius.control,
          backgroundColor: theme.color.background.surfaceSubtle,
          borderColor,
          // Constant. In Yoga the border is part of the box, exactly like
          // padding, so widening it on focus resizes the field and shifts every
          // sibling below — visible as a jump each time focus moves between two
          // fields. Colour alone carries the state.
          borderWidth: 2,
          color: theme.color.text.primary,
          fontFamily: entry.fontFamily,
          fontSize: entry.fontSize,
          letterSpacing: entry.letterSpacing,
        }}
      />

      {error ? (
        <Text role="label" size="xs" color="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
