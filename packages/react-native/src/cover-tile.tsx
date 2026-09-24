/**
 * The square a thing shows itself in, and the square it shows when it has nothing.
 *
 * `Monogram` is the letter a routine falls back to; this is the place that letter, a
 * picture or a drawing all sit in, so a list does not change shape depending on what
 * each row happens to have. A row with artwork and a row without stay the same row.
 *
 * **The picture is `children` and it runs to the tile's own edges**, for the same
 * reason `SelectableTile` does it: the Design System knows nothing about a product's
 * assets and must not learn. A `source` prop would mean either bundling images into
 * the library or inventing a path convention for whoever consumes it.
 *
 * **Emptiness is `children` being `null` or `undefined`, nothing cleverer.** A child
 * component that renders nothing is still an element, so a caller that always passes one
 * is never empty and its hint is never drawn. Whoever knows there is nothing to show has
 * to say so by passing nothing.
 *
 * **Empty is drawn, not left blank.** A tile with nothing in it is an invitation —
 * this is where a cover would go — so it keeps its outline and dims it, rather than
 * collapsing and leaving the row ragged. That is the opposite call from
 * `SelectableTile`, which shortens when it has no picture: there the height exists to
 * hold a photograph, and here the square *is* the component.
 *
 * **Pressable only when somebody gave it something to do.** Without `onPress` it is a
 * picture and is announced as nothing at all, because the name it stands for is always
 * drawn beside it.
 */

import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { useTheme } from "./theme.js";

export type CoverTileSize = "xs" | "sm" | "md";

export type CoverTileProps = {
  readonly size?: CoverTileSize;
  /** What it shows. An `Image`, an icon, a drawing — or nothing, which is a state. */
  readonly children?: React.ReactNode;
  /** Drawn in place of the content when there is none, to say what would go here. */
  readonly hint?: React.ReactNode;
  /** Absent makes it a picture rather than a control, which is a state and not a gap. */
  readonly onPress?: (() => void) | undefined;
  /** Marks it as the one chosen, in a set where one of several is. */
  readonly selected?: boolean;
  readonly accessibilityLabel?: string;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
};

/** Small enough for a list row, large enough for a field to sit beside. */
// `xs` is for a row whose height is the tile's own: at 56 the list stood taller
// than what it held ever asked for.
const BOX = { xs: 44, sm: 56, md: 72 } as const;

/** The corner follows the box, so the three sizes read as the same shape. */
const RADIUS = { xs: 14, sm: 18, md: 20 } as const;

export function CoverTile({
  size = "md",
  children,
  hint,
  onPress,
  selected = false,
  accessibilityLabel,
  testID,
  style,
}: CoverTileProps) {
  const theme = useTheme();
  const side = BOX[size];
  // `null` and `undefined` both mean the caller had nothing, and choosing between
  // them should not change the tile. The hint is not content: a tile showing what
  // would go here is still an empty tile, and still draws the emptier outline.
  const empty = children === undefined || children === null;
  const shown = empty ? hint : children;

  const border = () => {
    if (selected) return theme.color.border.accent;
    return empty ? theme.color.border.default : theme.color.border.subtle;
  };

  const box = [
    styles.box,
    {
      width: side,
      height: side,
      borderRadius: RADIUS[size],
      borderColor: border(),
      // Thicker when chosen, and never wider, so a grid does not shift under the thumb.
      borderWidth: selected ? 1.5 : 1,
      // `surfaceMuted` and not `surface`, because a tile also lives inside a sheet and a
      // sheet *is* `surface`: filled with it, the square vanished into its own panel.
      // Muted reads against the canvas and against the panel, which is the whole job.
      // Empty keeps no fill at all, so an invitation does not look like a thing.
      backgroundColor: selected
        ? theme.color.accent.tonal
        : empty
          ? "transparent"
          : theme.color.background.surfaceMuted,
    },
    style,
  ];

  if (onPress === undefined) {
    return (
      <View
        accessible={false}
        importantForAccessibility="no-hide-descendants"
        style={box}
        testID={testID}
      >
        {shown}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected }}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [...box, { opacity: pressed ? 0.7 : 1 }]}
    >
      {shown}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: "center", justifyContent: "center", overflow: "hidden" },
});
