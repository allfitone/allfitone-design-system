/**
 * Where you are in a deck, and how many there are.
 *
 * The active dot is a stretched pill rather than a bigger circle. Size alone is a weak
 * signal at four points tall — you have to compare it against its neighbours to read it
 * — while length is legible without comparing anything, and it points along the axis
 * the deck actually moves.
 *
 * **It is a label, not a control.** Tapping a dot to jump is a target four points tall
 * that nobody can hit reliably, and offering it would put the deck's only affordance
 * behind a miss. The deck is swiped; this says where the swipe got to.
 *
 * **One value drives every dot.** Each one reads its own width and colour off the
 * distance to the active index, so there is a single animation rather than one per dot
 * fighting the others — and a fractional index would work unchanged if a deck ever
 * wanted the pill to follow the finger.
 *
 * `width` is animated rather than `scaleX`, which is the one case where that is right:
 * scaling a four-point pill along one axis smears its corners into ovals. Six of them
 * relaying out once per page is a single layout pass, not a per-frame cost.
 *
 * The whole row is one accessibility element, because six separate dots read out as six
 * unlabelled images. `accessibilityValue` carries the position, which is the only thing
 * here anybody needs spoken.
 */

import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { useTheme } from "./theme.js";
import { semanticMotion } from "./tokens.js";

const DOT = 8;
const ACTIVE_WIDTH = 26;
const HEIGHT = 4;
const GAP = 8;

export type PageDotsProps = {
  readonly count: number;
  /** Zero-based. Out of range is clamped rather than drawn as nothing. */
  readonly active: number;
  /** Defaults to the accent. A deck whose pages have their own colour passes it here. */
  readonly color?: string;
  /** Names the deck, e.g. `Disciplinas`. */
  readonly accessibilityLabel: string;
  readonly reduceMotion?: boolean;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function PageDots({
  count,
  active,
  color,
  accessibilityLabel,
  reduceMotion,
  testID,
  style,
}: PageDotsProps) {
  const theme = useTheme();
  const here = Math.min(Math.max(active, 0), Math.max(0, count - 1));
  const at = useRef(new Animated.Value(here)).current;

  const lit = color ?? theme.color.border.accent;
  const unlit = theme.color.border.default;

  useEffect(() => {
    // `transition` rather than `feedback`: the pill is morphing across the row, not
    // answering a touch. Reduced motion keeps the change and drops the travel — which
    // page you are on is state this row exists to report, not decoration.
    const step = reduceMotion ? semanticMotion.reduced : semanticMotion.transition;
    const move = Animated.timing(at, {
      toValue: here,
      duration: step.duration,
      easing: Easing.bezier(...(step.easing as [number, number, number, number])),
      // Width and colour are neither transform nor opacity, so this one cannot be
      // native. It runs once per page rather than per frame, which is what makes that
      // acceptable — and `scaleX` on a four-point pill smears its corners into ovals.
      useNativeDriver: false,
    });
    move.start();
    return () => move.stop();
  }, [at, here, reduceMotion]);

  return (
    <View
      testID={testID}
      style={[styles.row, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 1, max: count, now: here + 1 }}
    >
      {Array.from({ length: count }, (_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              width: at.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [DOT, ACTIVE_WIDTH, DOT],
                extrapolate: "clamp",
              }),
              backgroundColor: at.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [unlit, lit, unlit],
                extrapolate: "clamp",
              }),
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: GAP },
  dot: { height: HEIGHT, borderRadius: HEIGHT / 2 },
});
