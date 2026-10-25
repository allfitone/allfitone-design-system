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
 *
 * **`size="sm"`** is the same control inside a card: a 28 track that fits its labels
 * instead of stretching, for a chart's range or a photo's view. Its targets still reach
 * the platform minimum through `hitSlop`; see `segmented-geometry.ts`.
 */

import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { segmentedGeometry, type SegmentedSize } from "./segmented-geometry.js";
import { Text } from "./text.js";
import { useTheme } from "./theme.js";

export type { SegmentedSize } from "./segmented-geometry.js";

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
  /** `md` (default) splits a screen; `sm` sits inside a card and fits its labels. */
  readonly size?: SegmentedSize;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function SegmentedControl<Value extends string = string>({
  items,
  value,
  onChange,
  accessibilityLabel,
  size = "md",
  testID,
  style,
}: SegmentedControlProps<Value>) {
  const theme = useTheme();
  // 48 for `md`: above the 44 floor, not just under it. The track's four of padding
  // once left a 40 control «almost» there, and almost is not the floor.
  const geometry = segmentedGeometry(size);
  const small = size === "sm";
  const radius = small ? geometry.height / 2 - geometry.inset : theme.semanticRadius.control;

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={[
        styles.track,
        small ? styles.fitted : null,
        {
          height: geometry.height,
          padding: geometry.inset,
          gap: geometry.gap,
          // Concentric with the segment's: the track's corner is the segment's plus
          // the inset between them, or the two curves fight each other.
          borderRadius: radius + geometry.inset,
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
            hitSlop={geometry.hitSlop}
            onPress={() => onChange(item.value)}
            style={({ pressed }) => [
              styles.segment,
              small ? { flex: 0, minWidth: geometry.minSegmentWidth, paddingHorizontal: 8 } : null,
              {
                borderRadius: radius,
                // Transparent rather than the track's own colour: an unchosen segment
                // is a hole in the track, not a second surface on top of it.
                backgroundColor: chosen ? theme.color.accent.tonal : "transparent",
                borderColor: chosen ? theme.color.border.accent : "transparent",
                opacity: pressed && !chosen ? 0.7 : 1,
              },
            ]}
          >
            <Text
              role="control"
              size={geometry.labelSize}
              color={chosen ? "accent" : "secondary"}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: "row", borderWidth: 1 },
  fitted: { alignSelf: "flex-start" },
  segment: { flex: 1, alignItems: "center", justifyContent: "center", borderWidth: 1 },
});
