/**
 * A figure somebody picks in order to edit it: a macro of a nutrition goal, fibre, water.
 *
 * **Two layouts, for the two rows a goal draws.** `stack` puts a visual — usually a
 * `ProgressRing` — over the figure, its label in the tone and a small mode under it,
 * three to a row. `inline` is the glyph in the tone, the name and the value side by
 * side, two to a row, with a «+» when the figure has no goal yet: the tile is then an
 * invitation to set one.
 *
 * The chosen tile wears the accent edge, half a point thicker, and the tile never grows
 * with it, so the row does not shift under the thumb. The label is required and is what
 * a screen reader says: the figure and the mode are already in it.
 */

import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import type { ReactNode } from "react";

import { badgeToneColor, type BadgeTone } from "./badge.js";
import { FoundationIcon, type IconName } from "./icons.js";
import { statTileLook, type StatLayout } from "./stat-look.js";
import { Text } from "./text.js";
import { useTheme } from "./theme.js";

export type { StatLayout } from "./stat-look.js";

/** Opens the condensed numerals, which touch at the role's own tracking. */
const FIGURE_TRACKING = 0.01;

export type StatTileProps = {
  /** The nutrient's name: «Proteína», «Fibra». */
  readonly label: string;
  /** `stack` (default) or `inline`. */
  readonly layout?: StatLayout;
  /** The colour of what it measures: the label on a stack, the glyph inline. */
  readonly tone?: BadgeTone;
  /** Stack: the figure, «110» or «—». Inline: the value line, «25 g» or «Sin meta». */
  readonly value: string;
  /** Stack only: the unit after the figure, «g». */
  readonly unit?: string;
  /** Stack only: the drawing over the figure, such as a `ProgressRing`. */
  readonly visual?: ReactNode;
  /** Stack only: the mode under the label, «Exacta», «Sin meta». */
  readonly mode?: string;
  /** Inline only: the glyph before the name. */
  readonly icon?: IconName;
  /** Inline only: no goal yet, so the tile ends in a «+». */
  readonly empty?: boolean;
  readonly selected?: boolean;
  readonly onPress?: () => void;
  readonly accessibilityLabel: string;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function StatTile({
  label,
  layout = "stack",
  tone = "accent",
  value,
  unit,
  visual,
  mode,
  icon,
  empty = false,
  selected = false,
  onPress,
  accessibilityLabel,
  testID,
  style,
}: StatTileProps) {
  const theme = useTheme();
  const look = statTileLook({ layout, selected });
  const ink = badgeToneColor(theme, tone);
  const frame = [
    styles.tile,
    {
      flexDirection: look.direction,
      alignItems: look.align,
      borderRadius: look.radius,
      padding: look.padding,
      gap: look.gap,
      backgroundColor: theme.color.background.surface,
      borderColor: look.edge === "accent" ? theme.color.border.accent : theme.color.border.subtle,
      borderWidth: look.edgeWidth,
    },
  ];

  const body =
    layout === "stack" ? (
      <>
        {visual}
        <Text
          role="poster"
          tracking={FIGURE_TRACKING}
          size="xl"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {value}
          {unit === undefined ? null : (
            <Text role="body" size="xs" color="muted">
              {` ${unit}`}
            </Text>
          )}
        </Text>
        <Text role="control" size="sm" style={{ color: ink }}>
          {label}
        </Text>
        {mode === undefined ? null : (
          <View style={[styles.mode, { backgroundColor: theme.color.background.surfaceMuted }]}>
            <Text role="body" size="2xs" color="secondary">
              {mode}
            </Text>
          </View>
        )}
      </>
    ) : (
      <>
        {icon === undefined ? null : (
          <FoundationIcon name={icon} size="md" color={ink} decorative />
        )}
        <View style={styles.grow}>
          <Text role="control" size="md">
            {label}
          </Text>
          <Text role="body" size="sm" color="secondary">
            {value}
          </Text>
        </View>
        {empty ? (
          <FoundationIcon name="add" size="md" color={theme.color.icon.secondary} decorative />
        ) : null}
      </>
    );

  if (onPress === undefined) {
    return (
      <View accessible accessibilityLabel={accessibilityLabel} testID={testID} style={[...frame, style]}>
        {body}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [...frame, { opacity: pressed ? 0.8 : 1 }, style]}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1 },
  grow: { flex: 1 },
  mode: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
});
