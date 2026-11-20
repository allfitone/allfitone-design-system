/**
 * One datum about the person: what it is, what it says, and where it came from.
 *
 * **Three lines, in the reading order of a form, not of a list.** `ContentRow` leads
 * with a name and puts its fact under it; a datum leads with the question («Peso»)
 * because the answer only means something under it. Bending `ContentRow` into this
 * would turn its name into a caption and its caption into a title, so it is its own row.
 *
 * **The origin is a badge on purpose** — the tonal one, in sentence case — because it
 * is a fact about the datum, not a caption of it. `versions` sits beside it in the
 * accent, a second target with its own label, because it is the one thing on the row
 * that opens something other than the editor.
 *
 * Unanswered, the row reads «Sin responder» and offers «Responder»: the question is
 * found where its answer will live. It goes inside `ContentGroup`, which rules it.
 */

import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useContext } from "react";

import { Badge } from "./badge.js";
import { Grouped } from "./content-row.js";
import { datumLines } from "./datum-look.js";
import { FoundationIcon } from "./icons.js";
import { Text } from "./text.js";
import { useTheme } from "./theme.js";

export type DatumRowProps = {
  /** What the datum is: «Peso», «Dónde entrenas». */
  readonly label: string;
  /** The answer. Absent, the row reads «Sin responder» and offers «Responder». */
  readonly value?: string;
  /** Where the answer came from: «Declarado por ti». */
  readonly origin?: string;
  /** The other versions of the datum, as a second target beside the origin. */
  readonly versions?: { readonly label: string; readonly onPress: () => void };
  /** Edits the datum, or answers it when it has no value. */
  readonly onPress: () => void;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function DatumRow({
  label,
  value,
  origin,
  versions,
  onPress,
  testID,
  style,
}: DatumRowProps) {
  const theme = useTheme();
  const grouped = useContext(Grouped);
  const lines = datumLines({ value, origin });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={[label, lines.value, lines.origin, versions?.label]
        .filter(Boolean)
        .join(". ")}
      accessibilityHint={lines.answered ? "Cambiar" : "Responder"}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.row,
        grouped ? styles.grouped : styles.alone,
        { opacity: pressed ? 0.7 : 1 },
        style,
      ]}
    >
      <View style={styles.text}>
        <Text role="body" size="xs" color="secondary">
          {label}
        </Text>
        <Text role="control" size="sm" color={lines.answered ? "primary" : "muted"}>
          {lines.value}
        </Text>
        <View style={styles.meta}>
          {lines.origin ? (
            <Badge label={lines.origin} variant="tonal" uppercase={false} />
          ) : null}
          {lines.answer ? (
            <Text role="control" size="xs" color="accent">
              {lines.answer}
            </Text>
          ) : null}
          {versions ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${versions.label} de ${label}`}
              hitSlop={8}
              onPress={versions.onPress}
            >
              <Text role="control" size="xs" color="accent">
                {versions.label}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
      <FoundationIcon name="next" size="xs" color={theme.color.icon.secondary} decorative />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  grouped: { paddingVertical: 14 },
  alone: { padding: 12 },
  text: { flex: 1, gap: 3 },
  meta: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 3 },
});
