/**
 * The conditions something has to meet, each marked as it is met.
 *
 * A new password is the first use: at least eight characters, an upper-case and a
 * lower-case letter, a number. The list is shown before anything is typed, so the rules
 * are known up front, and each mark fills the moment its condition holds, so nobody
 * submits to find out what was missing.
 *
 * **It is not a checklist somebody ticks.** Nothing here is pressable: the marks report
 * what the input already does. That is why each item is read as «cumplida» or
 * «pendiente» rather than announced as a checkbox somebody could toggle.
 *
 * A met condition carries the accent on its mark and its words in the primary ink; one
 * still pending keeps an empty ring and muted words. Colour is never the only carrier:
 * the mark itself changes from a ring to a filled check.
 */

import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { FoundationIcon } from "./icons.js";
import { Text } from "./text.js";
import { useTheme } from "./theme.js";

const MARK = 16;

export type Requirement = {
  readonly label: string;
  readonly met: boolean;
};

export type RequirementListProps = {
  readonly requirements: readonly Requirement[];
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function RequirementList({ requirements, testID, style }: RequirementListProps) {
  const theme = useTheme();
  return (
    <View testID={testID} style={[styles.list, style]}>
      {requirements.map(({ label, met }) => (
        <View
          key={label}
          accessible
          accessibilityLabel={`${label}: ${met ? "cumplida" : "pendiente"}`}
          style={styles.item}
        >
          <View
            style={[
              styles.mark,
              {
                borderColor: met ? theme.color.icon.accent : theme.color.border.default,
                backgroundColor: met ? theme.color.icon.accent : "transparent",
              },
            ]}
          >
            {met ? (
              <FoundationIcon
                name="check"
                customSize={10}
                strokeScale="compact"
                color={theme.color.accent.onAccent}
                decorative
              />
            ) : null}
          </View>
          <Text role="body" size="sm" color={met ? "primary" : "muted"}>
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  item: { flexDirection: "row", alignItems: "center", gap: 10 },
  mark: {
    width: MARK,
    height: MARK,
    borderRadius: MARK / 2,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
