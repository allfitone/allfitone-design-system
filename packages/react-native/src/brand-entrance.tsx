/**
 * Brand entrance for React Native surfaces.
 *
 * The mark fills with liquid rather than fading. It is a single closed stroke,
 * so clipping the rising body to its own path reads as fluid climbing inside the
 * shape.
 *
 * This has to live in the design system, not in a product. Clipping needs the
 * logo geometry, and `docs/FOUNDATIONS.md` keeps products out of the brand
 * package precisely so the mark cannot be reconstructed by hand. A first attempt
 * in an app clipped to a rectangle instead, and the fill edge visibly ran past
 * the silhouette.
 *
 * What sells it as liquid is the surface, not the rise. Two crests drift across
 * each other at different speeds and amplitudes; a single crest reads as a
 * moving decoration, and a straight edge reads as a progress bar. The crests are
 * drawn several periods wide and translated by exactly one period, so the loop
 * has no seam.
 *
 * Everything animates an SVG attribute, so none of it can use the native driver.
 * The cost is bounded: the whole sequence is under two seconds and runs once.
 */

import { useEffect, useRef } from "react";
import { Animated, Easing, type StyleProp, type ViewStyle } from "react-native";
import { ClipPath, Defs, G, Path, Rect, Svg } from "react-native-svg";

import { brandColors, brandDimensions, brandGeometry } from "@allfitone/brand";

const AnimatedG = Animated.createAnimatedComponent(G);

const VIEW_WIDTH = brandDimensions.logo.width;
const VIEW_HEIGHT = brandDimensions.logo.height;

/** One period equals the mark's width, which is what makes the loop seamless. */
const PERIOD = VIEW_WIDTH;
const CREST_DEPTH = 90;

/**
 * A crest spanning five periods, so translating by one leaves the shape looking
 * identical and there is always geometry beyond both edges of the viewBox.
 */
function crestPath(amplitude: number): string {
  const startX = -PERIOD * 2;
  const half = PERIOD / 2;
  const quarter = PERIOD / 4;

  let d = `M ${startX} ${amplitude}`;
  for (let period = 0; period < 5; period += 1) {
    d += ` q ${quarter} ${-amplitude} ${half} 0 t ${half} 0`;
  }
  const endX = startX + PERIOD * 5;
  return `${d} L ${endX} ${CREST_DEPTH} L ${startX} ${CREST_DEPTH} Z`;
}

const FRONT_CREST = crestPath(30);
const BACK_CREST = crestPath(46);

export type BrandEntranceProps = {
  readonly width?: number;
  readonly height?: number;
  readonly durationMs?: number;
  readonly reduceMotion?: boolean;
  readonly onFilled?: () => void;
  readonly accessibilityLabel?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function BrandEntrance({
  width = 64,
  height = 182,
  durationMs = 1500,
  reduceMotion = false,
  onFilled,
  accessibilityLabel,
  style,
}: BrandEntranceProps) {
  // Vertical offset in viewBox units, so the geometry stays resolution
  // independent and the caller only chooses a rendered size.
  const level = useRef(new Animated.Value(VIEW_HEIGHT)).current;
  const frontDrift = useRef(new Animated.Value(0)).current;
  const backDrift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) {
      level.setValue(0);
      onFilled?.();
      return;
    }

    const rise = Animated.timing(level, {
      toValue: 0,
      duration: durationMs,
      easing: Easing.bezier(0.5, 0, 0.25, 1),
      useNativeDriver: false,
    });

    // Opposite directions at unrelated speeds: crests moving together read as
    // one shape sliding, not as a surface.
    const drift = (value: Animated.Value, to: number, duration: number) =>
      Animated.loop(
        Animated.timing(value, {
          toValue: to,
          duration,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      );

    const front = drift(frontDrift, -PERIOD, 1100);
    const back = drift(backDrift, PERIOD, 1700);

    front.start();
    back.start();
    rise.start(({ finished }) => {
      if (finished) onFilled?.();
    });

    return () => {
      rise.stop();
      front.stop();
      back.stop();
    };
  }, [level, frontDrift, backDrift, durationMs, reduceMotion, onFilled]);

  return (
    <Svg
      width={width}
      height={height}
      viewBox={brandDimensions.logo.viewBox}
      style={style}
      {...(accessibilityLabel
        ? { accessible: true, accessibilityLabel, accessibilityRole: "image" as const }
        : { accessible: false })}
    >
      <Defs>
        <ClipPath id="brand-entrance-mask">
          <Path d={brandGeometry.logoPath} />
        </ClipPath>
      </Defs>

      {/* The empty vessel. Visible enough to read as a container waiting to be
          filled — fainter than this and it looked like a broken partial mark. */}
      <Path d={brandGeometry.logoPath} fill={brandColors.cyan} opacity={0.16} />
      <Path
        d={brandGeometry.logoPath}
        fill="none"
        stroke={brandColors.cyan}
        strokeWidth={10}
        opacity={0.4}
      />

      <G clipPath="url(#brand-entrance-mask)">
        <AnimatedG y={level}>
          {/* Drawn back to front: the deeper crest reads as liquid behind the
              surface rather than as a second outline. */}
          <AnimatedG x={backDrift}>
            <Path d={BACK_CREST} fill={brandColors.cyan} opacity={0.45} />
          </AnimatedG>
          <AnimatedG x={frontDrift}>
            <Path d={FRONT_CREST} fill={brandColors.cyan} />
          </AnimatedG>
          <Rect
            x={-PERIOD}
            y={CREST_DEPTH - 1}
            width={VIEW_WIDTH * 3}
            height={VIEW_HEIGHT * 2}
            fill={brandColors.cyan}
          />
        </AnimatedG>
      </G>
    </Svg>
  );
}
