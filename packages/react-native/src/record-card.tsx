/**
 * One record a person keeps, read back whole: what kind it is, her own words, the facts
 * that date it, and where it came from.
 *
 * `ContentRow` is the record in a list, one line of it and a way in. This is the record
 * once opened, where nothing is cut short and nothing is a target: the actions on it —
 * correct, delete — belong to the screen, under the card, not inside it.
 *
 * **Four bands, in the order a person checks them.** The kind on top as a tinted badge,
 * with its context beside it — a zone, a place — so she knows which record this is
 * before reading it. Her words next, in full. Then the facts as label and value, one per
 * line, between hairlines that say «these are the record's dates, not more of her text».
 * Last, the origin — who declared it and when — as a quiet badge, because provenance is
 * worth stating and is not the point.
 *
 * A fact reads as one phrase to a screen reader («Desde: 7 nov 2026»), not as two
 * stray words. The card itself stays out of the way: it is a surface, not a button.
 */

import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Badge, type BadgeTone } from "./badge.js";
import { Text } from "./text.js";
import { useTheme } from "./theme.js";

export type RecordFact = { readonly label: string; readonly value: string };

export type RecordCardProps = {
  /** The kind of record, drawn as a quiet badge in its tone. */
  readonly kind?: { readonly label: string; readonly tone?: BadgeTone };
  /** A word that places the record — a zone, a site — beside its kind. */
  readonly context?: string;
  /** The person's own words, never cut. */
  readonly body: string;
  /** Label and value lines, between hairlines. */
  readonly facts?: readonly RecordFact[];
  /** Who recorded it and when, as a quiet badge at the foot. */
  readonly origin?: string;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function RecordCard({
  kind,
  context,
  body,
  facts = [],
  origin,
  testID,
  style,
}: RecordCardProps) {
  const theme = useTheme();
  const rule = <View style={[styles.rule, { backgroundColor: theme.color.border.subtle }]} />;

  return (
    <View
      testID={testID}
      style={[
        styles.card,
        {
          backgroundColor: theme.color.background.surface,
          borderColor: theme.color.border.subtle,
          borderRadius: theme.semanticRadius.panel,
          padding: theme.spacing[4],
        },
        style,
      ]}
    >
      {kind === undefined && context === undefined ? null : (
        <View style={styles.line}>
          {kind === undefined ? null : (
            <Badge label={kind.label} tone={kind.tone ?? "accent"} variant="quiet" />
          )}
          {context === undefined ? null : (
            <Text role="control" size="xs" color="secondary">
              {context}
            </Text>
          )}
        </View>
      )}

      <Text role="control" size="md">
        {body}
      </Text>

      {facts.length === 0 ? null : (
        <>
          {rule}
          {facts.map((fact) => (
            <View
              key={fact.label}
              accessible
              accessibilityLabel={`${fact.label}: ${fact.value}`}
              style={styles.line}
            >
              <Text role="body" size="sm" color="secondary" style={styles.grow}>
                {fact.label}
              </Text>
              <Text role="control" size="sm">
                {fact.value}
              </Text>
            </View>
          ))}
        </>
      )}

      {origin === undefined ? null : (
        <>
          {rule}
          <View style={styles.origin}>
            <Badge label={origin} tone="neutral" variant="quiet" />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 14, borderWidth: 1 },
  line: { flexDirection: "row", alignItems: "center", gap: 8 },
  grow: { flex: 1 },
  rule: { height: StyleSheet.hairlineWidth * 2 },
  origin: { flexDirection: "row" },
});
