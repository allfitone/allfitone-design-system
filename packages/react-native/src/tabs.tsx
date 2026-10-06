/**
 * A few named views of the same subject, with one showing at a time.
 *
 * The native counterpart of `@allfitone/react/tabs`, and it carries the same visual
 * sentence: the labels sit on a hairline, the active one takes full-strength ink, and a
 * short accent mark rides on the line underneath it. The web adapter builds that from
 * Base UI; here there is no primitive to build on, so the roles are declared directly.
 *
 * **It is a strip, not a container.** It renders the labels and reports which one was
 * pressed; the panel underneath belongs to the screen. A compound component that owned
 * the panels would have to own their mounting too, and on a phone that decides for the
 * screen whether an unseen panel keeps its scroll position and its network request —
 * which is a screen's decision, not a control's.
 *
 * **It is not a chip row.** Chips filter: several can be on, and the set is the answer.
 * Tabs partition: exactly one is on, and the others still exist. Drawing tabs as pills
 * would promise multi-selection, which is why the mark is a line and not a fill.
 *
 * **A tab carries a word and nothing else.** A count beside the label was tried and
 * removed: a bare number next to a noun reads as an ordinal — "variants, the first
 * one" — not as a quantity, and the first person to see it asked what the number was.
 * A label that has to be explained is not a label.
 */

import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Text } from "./text.js";
import { useTheme } from "./theme.js";
import {
  activeTabIndex,
  INDICATOR_HEIGHT,
  TAB_MIN_HEIGHT,
  tabLabelStyle,
  type TabLabelStyle,
} from "./tab-selection.js";

export type { TabLabelStyle };

export type TabItem<Value extends string = string> = {
  readonly value: Value;
  readonly label: string;
  readonly accessibilityLabel?: string;
};

export type TabsProps<Value extends string = string> = {
  readonly items: readonly TabItem<Value>[];
  readonly value: Value;
  readonly onChange: (value: Value) => void;
  /** Names the group for a screen reader, e.g. "Secciones del ejercicio". */
  readonly accessibilityLabel?: string;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
  /**
   * `eyebrow` (the default) draws section names in the overline role; `control` draws
   * labels written in sentence case at the control role, without the wide tracking.
   */
  readonly labelStyle?: TabLabelStyle;
};

// Generic over the value so a screen's own union survives the round trip and the
// handler needs no cast back.
export function Tabs<Value extends string>({
  items,
  value,
  onChange,
  accessibilityLabel,
  testID,
  style,
  labelStyle,
}: TabsProps<Value>) {
  const theme = useTheme();
  const label = tabLabelStyle(labelStyle);
  const active = activeTabIndex(
    items.map((item) => item.value),
    value,
  );

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={[styles.list, { borderBottomColor: theme.color.border.subtle }, style]}
    >
      {items.map((item, index) => {
        const selected = index === active;
        return (
          <Pressable
            key={item.value}
            onPress={() => onChange(item.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={item.accessibilityLabel ?? item.label}
            style={styles.tab}
          >
            <Text role={label.role} size={label.size} color={selected ? "primary" : "muted"}>
              {item.label}
            </Text>
            {/* On the hairline, not above it, so the line looks marked rather than doubled. */}
            <View
              style={[
                styles.indicator,
                {
                  backgroundColor: selected ? theme.color.border.accent : "transparent",
                  bottom: -StyleSheet.hairlineWidth,
                },
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { flexDirection: "row", borderBottomWidth: StyleSheet.hairlineWidth },
  // Equal shares: two tabs that hug their words leave the strip looking unfinished.
  tab: { flex: 1, minHeight: TAB_MIN_HEIGHT, alignItems: "center", justifyContent: "center" },
  indicator: {
    position: "absolute",
    left: 0,
    right: 0,
    height: INDICATOR_HEIGHT,
    borderRadius: INDICATOR_HEIGHT / 2,
  },
});
