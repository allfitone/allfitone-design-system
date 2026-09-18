/**
 * A few mutually exclusive views, drawn as one track with the chosen one filled.
 *
 * **It is not `Tabs`.** Tabs partition a subject that stays on screen: the labels sit on
 * a hairline and a mark rides under the active one, which is right when the panel below
 * is the page. This is a *control*: it sits inside a sheet or above a grid, it is small,
 * and what it changes is the thing directly under it. The filled track is what makes it
 * read as a switch rather than as navigation.
 *
 * `Tabs`'s own note warns that drawing tabs as pills promises multi-selection. That is
 * true of separate pills, which is what `Chip` already is. A segmented control is not
 * separate pills: the segments share one track with no gaps between them, and that
 * containment is exactly what says «one of these».
 *
 * **Every segment is the same width**, so the control does not resize when the words
 * change and the thumb does not move under the finger between renders.
 */

import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Text } from "./text.js";
import { useTheme } from "./theme.js";

export type SegmentItem<Value extends string = string> = {
  readonly value: Value;
  readonly label: string;
  readonly accessibilityLabel?: string;
};

export type SegmentedControlProps<Value extends string = string> = {
  readonly items: readonly SegmentItem<Value>[];
  readonly value: Value;
  readonly onChange: (value: Value) => void;
  /** Names the group for a screen reader, e.g. «Tipo de portada». */
  readonly accessibilityLabel?: string;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
};

/** Tall enough for the label plus the track's own padding to reach the 44pt target. */
const HEIGHT = 40;

const INSET = 4;

export function SegmentedControl<Value extends string = string>({
  items,
  value,
  onChange,
  accessibilityLabel,
  testID,
  style,
}: SegmentedControlProps<Value>) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={[
        styles.track,
        {
          height: HEIGHT,
          padding: INSET,
          // Concentric with the segment's: the track's corner is the segment's plus
          // the inset between them, or the two curves fight each other.
          borderRadius: theme.semanticRadius.control + INSET,
          backgroundColor: theme.color.background.surfaceMuted,
          borderColor: theme.color.border.subtle,
        },
        style,
      ]}
    >
      {items.map((item) => {
        const chosen = item.value === value;
        return (
          <Pressable
            key={item.value}
            accessibilityRole="tab"
            accessibilityLabel={item.accessibilityLabel ?? item.label}
            accessibilityState={{ selected: chosen }}
            onPress={() => onChange(item.value)}
            style={({ pressed }) => [
              styles.segment,
              {
                borderRadius: theme.semanticRadius.control,
                // Transparent rather than the track's own colour: an unchosen segment
                // is a hole in the track, not a second surface on top of it.
                backgroundColor: chosen ? theme.color.accent.tonal : "transparent",
                borderColor: chosen ? theme.color.border.accent : "transparent",
                opacity: pressed && !chosen ? 0.7 : 1,
              },
            ]}
          >
            <Text role="control" size="sm" color={chosen ? "accent" : "secondary"} numberOfLines={1}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: "row", gap: 4, borderWidth: 1 },
  segment: { flex: 1, alignItems: "center", justifyContent: "center", borderWidth: 1 },
});
