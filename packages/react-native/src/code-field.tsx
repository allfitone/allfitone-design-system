/**
 * Segmented entry for a short numeric code.
 *
 * One input, several boxes. The obvious alternative — one `TextInput` per digit
 * — has to simulate backspace across fields, fights the platform's one-time-code
 * autofill because only one field receives it, and hands a screen reader six
 * unlabelled inputs instead of one. So a single transparent input covers the row
 * and the boxes are drawn beneath it, hidden from assistive technology.
 *
 * Only digits survive. A code is numeric, and a stray letter would render a box
 * the person cannot clear from a number pad.
 *
 * No `returnKeyType` is accepted and none is set. The iOS number pad has no
 * return key, so asking for one makes the platform float a loose button over the
 * layout — which is exactly the bug this component was extracted to stop
 * repeating.
 *
 * A filled box takes the accent border and an empty one stays subtle, which is
 * the whole state model: progress is the only thing worth showing, and the
 * keyboard already says the field has focus.
 *
 * `label` is the accessible name and is never drawn. Six boxes under a sentence
 * that already says a code was sent need no caption, and printing one would put
 * a heading above every use. Screen readers still announce it, because it is set
 * on the real input.
 */

import { useRef } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import { Text } from "./text.js";
import { useTheme } from "./theme.js";

const DEFAULT_LENGTH = 6;

/**
 * Taller than wide, so six boxes fit across a narrow phone without turning into
 * squares that waste vertical space.
 */
const BOX_ASPECT_RATIO = 0.78;

export type CodeFieldProps = Omit<
  TextInputProps,
  | "style"
  | "value"
  | "onChangeText"
  | "maxLength"
  | "multiline"
  | "keyboardType"
  | "inputMode"
  | "returnKeyType"
  | "secureTextEntry"
> & {
  /** Accessible name for the input. Never rendered. */
  readonly label: string;
  readonly value: string;
  /** Receives digits only, never longer than `length`. */
  readonly onChangeText: (value: string) => void;
  readonly length?: number;
  /**
   * Marks the field and shows the message. An empty string marks without
   * explaining, for the case where one message covers the whole form.
   */
  readonly error?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function CodeField({
  label,
  value,
  onChangeText,
  length = DEFAULT_LENGTH,
  error,
  style,
  editable,
  onFocus,
  onBlur,
  ...props
}: CodeFieldProps) {
  const theme = useTheme();
  const input = useRef<TextInput>(null);

  const digits = value.replace(/[^0-9]/gu, "").slice(0, length);
  const invalid = error !== undefined;

  const borderFor = (filled: boolean) => {
    if (invalid) return theme.color.status.danger;
    return filled ? theme.color.border.accent : theme.color.border.subtle;
  };

  return (
    <View style={[{ gap: theme.spacing[2] }, style]}>
      {/* Tapping anywhere on the row focuses the input, including the gaps. */}
      <Pressable
        accessible={false}
        onPress={() => input.current?.focus()}
        disabled={editable === false}
      >
        <View
          style={[styles.row, { gap: theme.spacing[2] }]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {Array.from({ length }, (_, index) => (
            <View
              key={index}
              style={{
                flex: 1,
                aspectRatio: BOX_ASPECT_RATIO,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.color.background.surfaceSubtle,
                borderRadius: theme.semanticRadius.panel,
                borderColor: borderFor(index < digits.length),
                // Constant, for the reason `TextField` documents: in Yoga the
                // border is part of the box, so changing its width would resize
                // every box as the code is typed.
                borderWidth: 2,
              }}
            >
              {index < digits.length ? (
                <Text role="control" size="2xl">
                  {digits[index]}
                </Text>
              ) : null}
            </View>
          ))}
        </View>

        <TextInput
          {...props}
          ref={input}
          value={digits}
          onChangeText={(next) => {
            onChangeText(next.replace(/[^0-9]/gu, "").slice(0, length));
          }}
          editable={editable}
          maxLength={length}
          keyboardType="number-pad"
          inputMode="numeric"
          // Invisible rather than absent: the platform will not autofill a code
          // into a field it cannot see, and a real input is what makes paste,
          // selection and the accessibility label work.
          caretHidden
          selectionColor="transparent"
          accessibilityLabel={label}
          onFocus={onFocus}
          onBlur={onBlur}
          style={[StyleSheet.absoluteFill, styles.input]}
        />
      </Pressable>

      {error ? (
        <Text role="label" size="xs" color="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  input: {
    color: "transparent",
    // Android draws its own underline on an unstyled TextInput.
    padding: 0,
  },
});
