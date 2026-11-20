/**
 * A share drawn as a ring: a muted track and an arc in a tone, with the centre left to
 * whoever uses it — a percentage, a countdown, a word.
 *
 * The ring starts at twelve o'clock and fills clockwise; a share past the whole is
 * drawn as the whole and a negative one as nothing, so a figure over its goal never
 * wraps round into a second lap that reads as less.
 */

import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { Circle, Svg } from "react-native-svg";
import type { ReactNode } from "react";

import { badgeToneColor, type BadgeTone } from "./badge.js";
import { ringArc } from "./stat-look.js";
import { useTheme } from "./theme.js";

export type ProgressRingProps = {
  readonly size: number;
  readonly stroke: number;
  /** 0 to 1. */
  readonly share: number;
  /** Default `accent`. */
  readonly tone?: BadgeTone;
  readonly children?: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
};

export function ProgressRing({
  size,
  stroke,
  share,
  tone = "accent",
  children,
  style,
}: ProgressRingProps) {
  const theme = useTheme();
  const { radius, length, filled } = ringArc(size, stroke, share);
  const centre = size / 2;
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} style={styles.turned}>
        <Circle
          cx={centre}
          cy={centre}
          r={radius}
          stroke={theme.color.background.surfaceMuted}
          strokeWidth={stroke}
          fill="none"
        />
        {filled > 0 ? (
          <Circle
            cx={centre}
            cy={centre}
            r={radius}
            stroke={badgeToneColor(theme, tone)}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${String(filled)} ${String(length)}`}
            fill="none"
          />
        ) : null}
      </Svg>
      {children === undefined ? null : <View style={styles.centre}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  turned: { transform: [{ rotate: "-90deg" }] },
  centre: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, alignItems: "center", justifyContent: "center" },
});
