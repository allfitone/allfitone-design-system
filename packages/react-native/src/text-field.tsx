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
 *
 * It is set in the `control` role, sentence case, like every other name a person
 * reads while filling something in. `label` is the uppercase micro-label role and
 * its 0.16em tracking pulls a phrase apart at 12px.
 *
 * **`hideLabel` drops the drawn label and keeps the spoken one**, the same bargain
 * `Sheet` makes with `hideTitle`. It is for the field whose placeholder already says
 * what it is — a search box above the list it filters — where the label repeats the
 * placeholder and costs a line on a panel that is short of them. The name a screen
 * reader announces does not change, because nothing about the field changed.
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
  /** Draws no label. It is still announced, so this is a layout choice, not a cut. */
  readonly hideLabel?: boolean;
  readonly error?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function TextField({
  label,
  hideLabel = false,
  error,
  style,
  onFocus,
  onBlur,
  ...props
}: TextFieldProps) {
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
      {hideLabel ? null : (
        <Text role="control" size="sm" color="secondary" nativeID={`${label}-label`}>
          {label}
        </Text>
      )}

      <TextInput
        {...props}
        accessibilityLabel={label}
        // Sin etiqueta dibujada no hay nada a lo que apuntar, y un `aria-labelledby`
        // colgando deja el campo sin nombre en lugar de con dos.
        aria-labelledby={hideLabel ? undefined : `${label}-label`}
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
