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
 *
 * **`icon` is the small mark, `preview` the picture.** A row that is told apart by
 * kind rather than by look — a pain, a limitation — carries a glyph on a quiet tile,
 * not a 56 px frame with a symbol lost in it. `tag` is a word about the row's kind set
 * beside its name, as a quiet `Badge`, so the caption stays free for the row's own
 * words.
 *
 * **A row may only report.** Without `onPress` it is not a target: no press, no chevron,
 * no inner action, and a screen reader reads it as text. «Pronto», «Sin gimnasio» and
 * a live state are facts, and a row that cannot open anything never pretends it can.
 * `value` is the row's latest figure before the chevron («70,2 kg»), small unless the
 * screen asks otherwise; a `badge` trailing says a state with the `Badge` itself.
 *
 * **`ContentGroup` puts several rows on one card**, divided by hairlines, the way a
 * settings list groups what belongs together. Rows inside it are `plain`; the group
 * owns the surface.
 */

import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { Children, createContext, useContext, type ReactNode } from "react";

import { Badge, badgeToneColor, type BadgeTone } from "./badge.js";
import type { BadgeVariant } from "./badge-look.js";
import { FoundationIcon, type IconName } from "./icons.js";
import { Text } from "./text.js";
import { useTheme } from "./theme.js";
import { withAlpha } from "./tokens.js";
import { resolveRowTrailing, rowGlyphPaint, rowValueSize, type RowValueSize } from "./row-look.js";

/** Set by `ContentGroup`, so its rows take the group's inset rather than their own card. */
const Grouped = createContext(false);

/**
 * El cuadrado donde va el arte, y el blanco redondo de al lado.
 *
 * 56 y no 48 porque es lo que mide `CoverTile` en su tamaño pequeño, que es lo que estas
 * filas le pasan. Con 48 la ranura recortaba el azulejo por los cuatro lados y se comía
 * su borde: parecía que el componente no lo dibujaba, y lo dibujaba.
 */
const PREVIEW = 56;
const GLYPH = 36;
const ACTION = 30;

export interface ContentRowProps {
  readonly name: string;
  readonly caption?: string;
  readonly note?: string;
  /** `quiet` for the absence of the fact the note reports. Default `accent`. */
  readonly noteTone?: "accent" | "quiet";
  readonly preview?: ReactNode;
  /** A glyph on a quiet tile, in place of a `preview`, for rows told apart by kind. */
  readonly icon?: IconName;
  /** A word about the row's kind, drawn beside the name as a quiet badge. */
  readonly tag?: string;
  /**
   * Tints the glyph's tile and colours the glyph; default is the accent on a quiet tile.
   * `quiet` is the secondary ink on that tile, for a settings list where no row is louder.
   */
  readonly iconTone?: BadgeTone | "quiet";
  /** The tone of `tag`. Default `accent`. */
  readonly tagTone?: BadgeTone;
  /** Without it the row only reports: it is not a target and ends in no chevron. */
  readonly onPress?: () => void;
  /** The row's latest figure, before the trailing: «70,2 kg». */
  readonly value?: string;
  /** Default `sm`, so the figure never outweighs the row's name. */
  readonly valueSize?: RowValueSize;
  /** Filled by default; `plain` for a row that is an entrance rather than a thing. */
  readonly tone?: "surface" | "plain";
  readonly trailing?: Trailing;
  readonly disabled?: boolean;
  readonly accessibilityLabel?: string;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
}

type Trailing =
  | { readonly kind: "chevron"; readonly tone?: "muted" | "accent" }
  | {
      readonly kind: "action";
      readonly icon: IconName;
      readonly accessibilityLabel: string;
      readonly onPress: () => void;
    }
  | {
      readonly kind: "badge";
      readonly label: string;
      readonly tone?: BadgeTone;
      readonly variant?: BadgeVariant;
      readonly uppercase?: boolean;
      readonly dot?: boolean;
    }
  | { readonly kind: "none" };

export function ContentRow({
  name,
  caption,
  note,
  noteTone = "accent",
  preview,
  icon,
  tag,
  iconTone,
  tagTone = "accent",
  onPress,
  value,
  valueSize,
  tone = "surface",
  trailing,
  disabled,
  accessibilityLabel,
  testID,
  style,
}: ContentRowProps) {
  const theme = useTheme();
  const grouped = useContext(Grouped);
  const end = resolveRowTrailing(onPress !== undefined, trailing);
  const paint = rowGlyphPaint(iconTone);
  const glyphInk =
    paint === "accent"
      ? theme.color.icon.accent
      : paint === "quiet"
        ? theme.color.icon.secondary
        : badgeToneColor(theme, iconTone as BadgeTone);
  const glyphGround =
    paint === "tone" ? withAlpha(glyphInk, 0.14) : theme.color.background.surfaceMuted;
  const frame = [
    styles.base,
    grouped ? styles.grouped : null,
    {
      backgroundColor:
        tone === "surface" && !grouped ? theme.color.background.surface : "transparent",
      borderRadius: grouped ? 0 : theme.semanticRadius.card,
    },
  ];

  const body = (
    <>
      {preview === undefined ? null : <View style={styles.preview}>{preview}</View>}
      {icon === undefined ? null : (
        <View style={[styles.glyph, { backgroundColor: glyphGround }]}>
          <FoundationIcon name={icon} size="sm" color={glyphInk} decorative />
        </View>
      )}

      <View style={[styles.text, grouped ? styles.groupedText : null]}>
        <View style={styles.title}>
          <Text
            role="control"
            size={icon === undefined ? "md" : "sm"}
            numberOfLines={1}
            style={styles.shrink}
          >
            {name}
          </Text>
          {tag === undefined ? null : <Badge label={tag} tone={tagTone} variant="quiet" />}
        </View>
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

      {value === undefined ? null : (
        <Text role="poster" size={rowValueSize(valueSize)} color="accent" numberOfLines={1}>
          {value}
        </Text>
      )}

      {end.kind === "chevron" ? (
        <FoundationIcon
          name="next"
          size="xs"
          color={end.tone === "accent" ? theme.color.icon.accent : theme.color.icon.secondary}
          decorative
        />
      ) : end.kind === "badge" ? (
        <Badge {...badgeOf(end)} style={styles.badge} />
      ) : end.kind === "action" ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={end.accessibilityLabel}
          onPress={end.onPress}
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
            name={end.icon}
            size="xs"
            color={theme.color.icon.secondary}
            decorative
          />
        </Pressable>
      ) : null}
    </>
  );

  if (onPress === undefined) {
    const spoken = [name, caption, note, value, end.kind === "badge" ? end.label : undefined];
    return (
      <View
        accessible
        accessibilityLabel={accessibilityLabel ?? spoken.filter(Boolean).join(". ")}
        testID={testID}
        style={[...frame, style]}
      >
        {body}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? name}
      accessibilityHint={caption}
      accessibilityState={{ disabled: disabled === true }}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [...frame, { opacity: pressed && !disabled ? 0.7 : 1 }, style]}
    >
      {body}
    </Pressable>
  );
}

/** The trailing's badge props, without the `kind` that only the row reads. */
function badgeOf({ kind: _kind, ...badge }: Extract<Trailing, { kind: "badge" }>) {
  return badge;
}

/**
 * Several rows on one card, divided by hairlines. The rows inside take the group's inset
 * and lose their own surface, so a row reads the same here whatever `tone` it was given.
 */
export function ContentGroup({
  children,
  style,
}: {
  readonly children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  const rows = Children.toArray(children);
  return (
    <View
      style={[
        styles.group,
        {
          backgroundColor: theme.color.background.surface,
          borderColor: theme.color.border.subtle,
          borderRadius: theme.semanticRadius.panel,
        },
        style,
      ]}
    >
      <Grouped.Provider value>
        {rows.map((row, index) => (
          <View key={index}>
            {index > 0 ? (
              <View style={[styles.divider, { backgroundColor: theme.color.border.subtle }]} />
            ) : null}
            {row}
          </View>
        ))}
      </Grouped.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12 },
  grouped: { paddingHorizontal: 0, paddingVertical: 14 },
  preview: {
    width: PREVIEW,
    height: PREVIEW,
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1, gap: 2 },
  groupedText: { gap: 3 },
  title: { flexDirection: "row", alignItems: "center", gap: 8 },
  shrink: { flexShrink: 1 },
  badge: { alignSelf: "center" },
  glyph: {
    width: GLYPH,
    height: GLYPH,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  group: { borderWidth: 1, overflow: "hidden", paddingHorizontal: 16, paddingVertical: 2 },
  divider: { height: StyleSheet.hairlineWidth * 2 },
  action: {
    width: ACTION,
    height: ACTION,
    borderRadius: ACTION / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
