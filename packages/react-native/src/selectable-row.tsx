/**
 * A row somebody adds to a set, with the mark that says it is in.
 *
 * `Checkbox` is the affirmation of a sentence and draws that sentence in body
 * text; this is a thing being chosen from a list of things, so it leads with a
 * name and carries a second line describing it. Picking exercises for a routine is
 * the first use: "Press de banca con barra" over "Pecho · Barra".
 *
 * The role is still `checkbox`, because that is what it is — several can be on at
 * once and nothing happens until the list is confirmed. A `button` would announce
 * an action that does not occur, and a `radio` would promise the opposite of
 * multiple choice.
 *
 * **The whole row is the target.** A 22 pt mark is under the 44 pt DT-010 asks
 * for, and shrinking the reach to the mark would make the name decoration. The row
 * is the control; the mark only reports.
 *
 * **It is a row, not a card.** Each one had its own border, its own ground and its
 * own rounded corners, and four hundred of them stacked read as four hundred boxes
 * rather than as one list: the eye spent its attention on the frames instead of on
 * what was inside them. Now a hairline separates one row from the next and nothing
 * else does, which is what lets the picture be the loudest thing in the row.
 *
 * **A preview is a still, and the row owns only its box.** A name is not enough to
 * place an exercise somebody has never done, so the row can carry a thumbnail of it.
 * The box, its ground and its place in the row belong here; what goes inside is the
 * consumer's, because the artwork is remote and animated and neither belongs in a
 * component library.
 *
 * **Where there is a picture, the mark rides on it.** A thumbnail small enough to
 * sit beside an empty checkbox was too small to recognise anything in, and the two
 * of them side by side spent the row's leading edge twice. So the picture takes that
 * edge at a size worth looking at and the mark becomes a badge on its corner, drawn
 * only when the row is on — `SelectableTile` already reports selection without a
 * permanent empty box. A row with no preview keeps the mark in its own column,
 * because then nothing else would say the row can be chosen.
 *
 * The badge is also what keeps selection off colour alone: the name turning accent
 * says the same thing a second time, but a mark appearing is a change of shape, and
 * DT-010 asks for one.
 *
 * **The name is not shouted, and it holds one line.** Uppercase suits a label of one
 * or two words and turns a real name — `Press de banca inclinado con mancuernas` —
 * into something that has to be decoded rather than read. And a name that wrapped
 * while its neighbour did not gave every row a different height, which is what made
 * a long list look broken. One line each, so the list is a column.
 *
 * It is set in the `control` role. The condensed roles all track negative, which is
 * right for a headline set large and closes the counters at the size a row is read —
 * the letters look stuck together. `control` is the one face in the vocabulary that is
 * both heavy enough to lead a row and set at its natural width.
 *
 * It is the wider face, so it costs: at 16 roughly a quarter of a four hundred name
 * catalogue reaches the ellipsis, against a tenth in the condensed face. The size is
 * held down to 16 for that reason — at 18 it was more than half — and the name leads
 * on weight and colour rather than on being much larger than its caption.
 *
 * **A secondary action sits outside the row's press area.** Picking an exercise and
 * reading about it are different intents, and a row that did both on one tap would do
 * the wrong one half the time. `action` renders its own 44 pt target at the trailing
 * edge, with its own accessible name, and the row keeps its own. Nothing is nested:
 * a `checkbox` that contained a second control without naming it would leave a screen
 * reader announcing one thing and doing another.
 */

import type { ReactNode } from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { FoundationIcon, type IconName } from "./icons.js";
import { Text } from "./text.js";
import { useTheme } from "./theme.js";

/** Reads as a mark beside a name without competing with it. */
const MARK_SIZE = 22;

/** The mark once it rides on a picture, where it has less room to take. */
const BADGE_SIZE = 20;

/** Big enough to tell one movement from another, small enough to stay a list. */
const PREVIEW_SIZE = 60;

const MARK_GLYPH_SIZE = 13;

const BADGE_GLYPH_SIZE = 12;

/** The floor for a row with no picture; one with a preview is taller on its own. */
const MIN_HEIGHT = 56;

/** The whole target, not the glyph: DT-010 measures what the finger can hit. */
const ACTION_SIZE = 44;

/** A second target deserves a glyph somebody can aim at, not a hint of one. */
const ACTION_GLYPH = "md";

export type SelectableRowProps = {
  /** What is being chosen. Leads the row and is the accessible name. */
  readonly name: string;
  /** What it is, in one line. Absent when there is nothing worth saying. */
  readonly caption?: string;
  /** A still thumbnail of the thing. The box is this component's; the content is yours. */
  readonly preview?: ReactNode;
  readonly selected: boolean;
  readonly onPress: () => void;
  /** A second, different intent — reading about the thing rather than choosing it. */
  readonly action?: {
    readonly icon: IconName;
    readonly accessibilityLabel: string;
    readonly onPress: () => void;
  };
  readonly disabled?: boolean;
  readonly accessibilityLabel?: string;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function SelectableRow({
  name,
  caption,
  preview,
  selected,
  onPress,
  action,
  disabled,
  accessibilityLabel,
  testID,
  style,
}: SelectableRowProps) {
  const theme = useTheme();

  const ink = () => {
    if (disabled) return "disabled" as const;
    return selected ? ("accent" as const) : ("primary" as const);
  };

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel ?? name}
      accessibilityHint={caption}
      accessibilityState={{ checked: selected, disabled: disabled === true }}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        {
          borderBottomColor: theme.color.border.subtle,
          opacity: pressed && !disabled ? 0.7 : 1,
        },
        style,
      ]}
    >
      {preview === undefined ? (
        <View
          style={[
            styles.mark,
            {
              borderColor: selected ? theme.color.border.accent : theme.color.border.default,
              backgroundColor: selected ? theme.color.action.primary : "transparent",
            },
          ]}
        >
          {selected ? (
            <FoundationIcon
              name="check"
              customSize={MARK_GLYPH_SIZE}
              color={theme.color.action.onPrimary}
              decorative
            />
          ) : null}
        </View>
      ) : (
        <View>
          <View
            style={[
              styles.preview,
              { backgroundColor: theme.color.background.surfaceSubtle },
            ]}
          >
            {preview}
          </View>

          {selected ? (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: theme.color.action.primary,
                  // The ground the list sits on, so the badge reads as cut out of it.
                  borderColor: theme.color.background.canvas,
                },
              ]}
            >
              <FoundationIcon
                name="check"
                customSize={BADGE_GLYPH_SIZE}
                color={theme.color.action.onPrimary}
                decorative
              />
            </View>
          ) : null}
        </View>
      )}

      <View style={styles.body}>
        <Text role="control" size="md" numberOfLines={1} color={ink()}>
          {name}
        </Text>
        {caption === undefined ? null : (
          <Text role="body" size="sm" color="muted" numberOfLines={1}>
            {caption}
          </Text>
        )}
      </View>

      {action === undefined ? null : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={action.accessibilityLabel}
          disabled={disabled}
          onPress={action.onPress}
          style={({ pressed }) => [styles.action, { opacity: pressed && !disabled ? 0.6 : 1 }]}
        >
          <FoundationIcon
            name={action.icon}
            size={ACTION_GLYPH}
            color={disabled ? theme.color.text.disabled : theme.color.icon.secondary}
            decorative
          />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  preview: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: 10,
    overflow: "hidden",
  },
  badge: {
    position: "absolute",
    right: -4,
    bottom: -4,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  mark: {
    width: MARK_SIZE,
    height: MARK_SIZE,
    flexBasis: MARK_SIZE,
    flexGrow: 0,
    flexShrink: 0,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, gap: 2, minWidth: 0 },
  action: {
    width: ACTION_SIZE,
    height: ACTION_SIZE,
    alignItems: "center",
    justifyContent: "center",
    // Eats into the row's own inset rather than widening it, so the row keeps its height.
    marginRight: -10,
  },
});
