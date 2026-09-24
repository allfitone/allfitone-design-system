/**
 * A letter standing in for something that has no picture.
 *
 * A routine somebody wrote has a name and nothing else — no artwork, no icon that
 * means «Empuje» rather than «Pierna». In a week of seven cells there is no room for
 * a name anyway, so the first letter does the work a thumbnail would do elsewhere:
 * it makes two rows tellable apart at a glance, and it makes the same routine
 * recognisable in the grid and in the list below it.
 *
 * **It is not an avatar and not a `Badge`.** It borrows an avatar's circle, but an
 * avatar stands for a person and falls back to initials when a photograph is missing;
 * nothing here ever has a photograph.
 * A badge states a fact in words. This is a mark: it carries no meaning of its own,
 * only identity, and its whole job is to be the same mark every time for the same
 * name.
 *
 * **The tone is identity, never status.** `DT-009` keeps colour for what colour says,
 * and «which of these is which» is exactly what the palette's identity tones are for.
 * Like `Badge`, it takes a tone and never a colour.
 */

import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { badgeToneColor, type BadgeTone } from "./badge.js";
import { Text } from "./text.js";
import { useTheme } from "./theme.js";

export type MonogramSize = "sm" | "md";

export type MonogramProps = {
  /** The whole name. The mark is derived from it so two callers cannot disagree. */
  readonly name: string;
  readonly tone?: BadgeTone;
  readonly size?: MonogramSize;
  readonly style?: StyleProp<ViewStyle>;
};

const BOX = { sm: 28, md: 36 } as const;

export function Monogram({ name, tone = "accent", size = "md", style }: MonogramProps) {
  const theme = useTheme();
  const side = BOX[size];
  const color = badgeToneColor(theme, tone);

  return (
    <View
      // Decorative on purpose: the name it stands for is always drawn or announced
      // beside it, and a screen reader spelling out «E» adds a letter to read and
      // nothing to understand.
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.box,
        { width: side, height: side, borderRadius: side / 2, borderColor: color },
        // Tonal rather than filled: seven of these in a row of days would otherwise be
        // seven solid blocks, and the week is meant to be read as one thing.
        { backgroundColor: theme.color.accent.tonal },
        style,
      ]}
    >
      <Text role="control" size={size === "sm" ? "xs" : "sm"} style={{ color }}>
        {markOf(name)}
      </Text>
    </View>
  );
}

/**
 * The first letter that is actually a letter.
 *
 * A routine called «3 días fuerza» would otherwise be marked with a digit, which reads
 * as a position in the list rather than as a name. A name with no letters at all keeps
 * whatever it starts with, because an empty mark is worse than an odd one.
 */
export function markOf(name: string): string {
  const trimmed = name.trim();
  const letter = [...trimmed].find((character) => character.toLowerCase() !== character.toUpperCase());
  return (letter ?? trimmed[0] ?? "·").toUpperCase();
}

const styles = StyleSheet.create({
  box: { alignItems: "center", justifyContent: "center", borderWidth: 1 },
});
