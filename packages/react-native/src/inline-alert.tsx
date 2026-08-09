/**
 * Inline status message for React Native surfaces.
 *
 * Sits with the control it refers to rather than floating over the screen, so a
 * message about two fields can live between them and belong to both. A sign-in
 * failure is the case that forces this: the message must not say which of the
 * two fields was wrong, because that reveals which addresses are registered.
 *
 * Colour is never the only carrier. The icon and the text say the same thing, so
 * the message survives forced colours and colour-blind vision.
 */

import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { Circle, Path, Svg } from "react-native-svg";

import { Text } from "./text.js";
import { useTheme } from "./theme.js";

export type InlineAlertTone = "danger" | "warning" | "info" | "success";

export type InlineAlertProps = {
  readonly message: string;
  readonly tone?: InlineAlertTone;
  readonly style?: StyleProp<ViewStyle>;
};

export function InlineAlert({ message, tone = "danger", style }: InlineAlertProps) {
  const theme = useTheme();
  const accent = theme.color.status[tone];

  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.base,
        {
          gap: theme.spacing[2],
          paddingHorizontal: theme.spacing[3],
          paddingVertical: theme.spacing[3],
          borderRadius: theme.semanticRadius.controlSmall,
          borderColor: accent,
          backgroundColor: theme.color.background.surfaceSubtle,
        },
        style,
      ]}
    >
      <Svg width={16} height={16} viewBox="0 0 24 24" style={styles.icon}>
        <Circle cx={12} cy={12} r={10} stroke={accent} strokeWidth={2} fill="none" />
        <Path d="M12 7v6" stroke={accent} strokeWidth={2} strokeLinecap="round" />
        <Path d="M12 16.5h.01" stroke={accent} strokeWidth={2} strokeLinecap="round" />
      </Svg>
      <Text role="label" size="xs" style={{ flex: 1, color: accent }}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  icon: {
    marginTop: 1,
  },
});
