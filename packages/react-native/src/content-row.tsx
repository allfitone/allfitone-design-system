/**
 * A row that reports a thing, rather than choosing it.
 *
 * `SelectableRow` is the row of a list somebody is picking from: it carries `selected`
 * and answers as a checkbox. A library is not a picker — the rows are the person's own
 * routines and programmes, and pressing one opens it. Bending the selectable row into
 * this would mean a required `selected` that is always false, which is a lie the
 * screen reader repeats out loud.
 *
 * **Three lines, and the third is the one worth having.** `note` is a fact about where
 * the thing lives — «En Fuerza básica», «Sin programa» — drawn in the accent so it
 * reads as a link between two things rather than more description. Its `quiet` tone is
 * for the absence of that fact, which is still worth saying and is not an alarm.
 *
 * `preview` is whatever marks the row: a cover, a figure, a photograph, a glyph. Like
 * `SelectableTile` and `CoverTile`, this component never learns what a routine or a
 * programme is; it is handed the art already drawn.
 *
 * **`trailing` is the whole difference between reading and acting.** A chevron says the
 * row opens; an action is a second target inside the row, which needs its own label
 * because «más opciones» on nine identical rows tells a screen reader nothing.
 */

import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import type { ReactNode } from "react";

import { FoundationIcon, type IconName } from "./icons.js";
import { Text } from "./text.js";
import { useTheme } from "./theme.js";

/**
 * El cuadrado donde va el arte, y el blanco redondo de al lado.
 *
 * 56 y no 48 porque es lo que mide `CoverTile` en su tamaño pequeño, que es lo que estas
 * filas le pasan. Con 48 la ranura recortaba el azulejo por los cuatro lados y se comía
 * su borde: parecía que el componente no lo dibujaba, y lo dibujaba.
 */
const PREVIEW = 56;
const ACTION = 30;

export interface ContentRowProps {
  readonly name: string;
  readonly caption?: string;
  readonly note?: string;
  /** `quiet` for the absence of the fact the note reports. Default `accent`. */
  readonly noteTone?: "accent" | "quiet";
  readonly preview?: ReactNode;
  readonly onPress: () => void;
  /** Filled by default; `plain` for a row that is an entrance rather than a thing. */
  readonly tone?: "surface" | "plain";
  readonly trailing?:
    | { readonly kind: "chevron"; readonly tone?: "muted" | "accent" }
    | {
        readonly kind: "action";
        readonly icon: IconName;
        readonly accessibilityLabel: string;
        readonly onPress: () => void;
      };
  readonly disabled?: boolean;
  readonly accessibilityLabel?: string;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
}

export function ContentRow({
  name,
  caption,
  note,
  noteTone = "accent",
  preview,
  onPress,
  tone = "surface",
  trailing = { kind: "chevron" },
  disabled,
  accessibilityLabel,
  testID,
  style,
}: ContentRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? name}
      accessibilityHint={caption}
      accessibilityState={{ disabled: disabled === true }}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor:
            tone === "surface" ? theme.color.background.surface : "transparent",
          borderRadius: theme.semanticRadius.card,
          opacity: pressed && !disabled ? 0.7 : 1,
        },
        style,
      ]}
    >
      {preview === undefined ? null : <View style={styles.preview}>{preview}</View>}

      <View style={styles.text}>
        <Text role="control" size="md" numberOfLines={1}>
          {name}
        </Text>
        {caption === undefined ? null : (
          <Text role="body" size="xs" color="muted" numberOfLines={1}>
            {caption}
          </Text>
        )}
        {note === undefined ? null : (
          <Text
            role="control"
            size="xs"
            color={noteTone === "accent" ? "accent" : "muted"}
            numberOfLines={1}
          >
            {note}
          </Text>
        )}
      </View>

      {trailing.kind === "chevron" ? (
        <FoundationIcon
          name="next"
          size="xs"
          color={
            trailing.tone === "accent" ? theme.color.icon.accent : theme.color.icon.secondary
          }
          decorative
        />
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={trailing.accessibilityLabel}
          onPress={trailing.onPress}
          hitSlop={8}
          style={({ pressed }) => [
            styles.action,
            {
              backgroundColor: theme.color.background.surfaceMuted,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <FoundationIcon
            name={trailing.icon}
            size="xs"
            color={theme.color.icon.secondary}
            decorative
          />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12 },
  preview: {
    width: PREVIEW,
    height: PREVIEW,
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1, gap: 2 },
  action: {
    width: ACTION,
    height: ACTION,
    borderRadius: ACTION / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
