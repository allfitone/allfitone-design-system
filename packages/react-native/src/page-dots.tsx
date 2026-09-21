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
 * fighting the others — and a fractional index works unchanged, which is what `at` is.
 *
 * **Two ways to drive it.** `active` is a whole page index and the row animates to it
 * once it changes: right for a deck that reports where it landed, and the only thing
 * needed when pages arrive one at a time. `at` is a Reanimated shared value carrying a
 * fractional index, and the row recomputes from it every frame on the UI thread: right
 * for a deck that should follow the finger, where `onMomentumScrollEnd` arrives after
 * the gesture is over and a pill that only starts moving then reads as latency. Pass
 * `active` either way — it is what the row says out loud, and a spoken position does
 * not need a value per frame.
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
import Reanimated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";

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
  /**
   * A fractional index on the UI thread — `1.37` a third of the way from the second
   * page to the third. Given, the pill follows it per frame instead of stepping.
   */
  readonly at?: SharedValue<number>;
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
  at,
  color,
  accessibilityLabel,
  reduceMotion,
  testID,
  style,
}: PageDotsProps) {
  const theme = useTheme();
  const here = Math.min(Math.max(active, 0), Math.max(0, count - 1));
  const stepped = useRef(new Animated.Value(here)).current;

  const lit = color ?? theme.color.border.accent;
  const unlit = theme.color.border.default;

  useEffect(() => {
    // Nothing to time while `at` drives the row: the finger is the clock, and a timing
    // running alongside it would be a second opinion about where the pill is.
    if (at) return;
    // `transition` rather than `feedback`: the pill is morphing across the row, not
    // answering a touch. Reduced motion keeps the change and drops the travel — which
    // page you are on is state this row exists to report, not decoration.
    const step = reduceMotion ? semanticMotion.reduced : semanticMotion.transition;
    const move = Animated.timing(stepped, {
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
  }, [at, stepped, here, reduceMotion]);

  return (
    <View
      testID={testID}
      style={[styles.row, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 1, max: count, now: here + 1 }}
    >
      {Array.from({ length: count }, (_, index) =>
        at ? (
          <FollowingDot
            key={index}
            index={index}
            at={at}
            last={Math.max(0, count - 1)}
            lit={lit}
            unlit={unlit}
            reduceMotion={reduceMotion === true}
          />
        ) : (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: stepped.interpolate({
                  inputRange: [index - 1, index, index + 1],
                  outputRange: [DOT, ACTIVE_WIDTH, DOT],
                  extrapolate: "clamp",
                }),
                backgroundColor: stepped.interpolate({
                  inputRange: [index - 1, index, index + 1],
                  outputRange: [unlit, lit, unlit],
                  extrapolate: "clamp",
                }),
              },
            ]}
          />
        ),
      )}
    </View>
  );
}

type FollowingDotProps = {
  readonly index: number;
  readonly at: SharedValue<number>;
  readonly last: number;
  readonly lit: string;
  readonly unlit: string;
  readonly reduceMotion: boolean;
};

/**
 * One dot of the continuous row. The same rule as the stepped path — width and colour
 * off the distance to the active index — resolved on the UI thread once per frame, so
 * dragging the deck never wakes the React runtime. It is a component rather than a loop
 * body because each dot owns a hook, and the row's length is the product's to change.
 */
function FollowingDot({ index, at, last, lit, unlit, reduceMotion }: FollowingDotProps) {
  const shape = useAnimatedStyle(() => {
    // Out of range is clamped, the same as `active`: a deck rubber-bands past both ends
    // and the pill has no business shrinking for a bounce.
    const here = Math.min(Math.max(at.value, 0), last);
    // Reduced motion keeps the change and drops the travel here too: the distance is
    // taken from the page the deck is nearest, so the pill lands rather than stretches.
    const from = reduceMotion ? Math.round(here) : here;
    const distance = Math.abs(from - index);
    return {
      width: interpolate(distance, [0, 1], [ACTIVE_WIDTH, DOT], Extrapolation.CLAMP),
      backgroundColor: interpolateColor(distance, [0, 1], [lit, unlit]),
    };
  }, [index, last, lit, unlit, reduceMotion]);

  return <Reanimated.View style={[styles.dot, shape]} />;
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: GAP },
  dot: { height: HEIGHT, borderRadius: HEIGHT / 2 },
});
