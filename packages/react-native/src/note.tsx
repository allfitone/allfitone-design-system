/**
 * One quiet phrase with a mark: what happens when this is saved, what something is
 * for, what is coming.
 *
 * **It is not an `InlineAlert`.** An alert reports a state — something failed, needs
 * attention, went through — and wears that state's colour. A note reports nothing
 * going wrong or right; it explains. Drawing it as an info alert would tint every form
 * in the product blue for sentences that are not news.
 *
 * **Two sizes, because there are two places.** `sm` is the footnote under a form, set
 * in the smallest body step so it reads after the fields and never before them. `md`
 * sits beside content, a step up, where the note is part of what the screen says.
 *
 * `boxed` gives the note the muted ground, for the one that answers what was just
 * chosen — «you train at home with little equipment» — so it reads as a reply rather
 * than as the form's small print. `accent` inks the mark, for what a paid plan opens;
 * `tile` sets it in the tonal tile, for something on its way, and only `md` has room.
 *
 * `outlined` is the panel a section ends on — «your photos are only yours» — drawn with
 * an outline rather than a ground, its mark at 16 beside the small phrase. `align="center"`
 * sits a note in the middle of what it closes, such as «Solo tú la ves» under a camera.
 *
 * The mark is decorative: the phrase says everything, and a screen reader reads only it.
 */

import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import type { ReactNode } from "react";

import { FoundationIcon, type IconName } from "./icons.js";
import { noteAlign, noteLook, type NoteSize } from "./note-look.js";
import { Text } from "./text.js";
import { useTheme } from "./theme.js";

export type { NoteSize } from "./note-look.js";

export type NoteProps = {
  readonly children: ReactNode;
  /** The mark before the phrase. Default `info`. */
  readonly icon?: IconName;
  /** `sm` under a form (default); `md` beside content. */
  readonly size?: NoteSize;
  /** The muted ground, for a note that answers what was just chosen. */
  readonly boxed?: boolean;
  /** Inks the mark in the accent. */
  readonly accent?: boolean;
  /** The mark in the tonal tile, for something on its way. Drawn at `md` only. */
  readonly tile?: boolean;
  /** An outline instead of the muted ground, for a note that stands alone in a section. */
  readonly outlined?: boolean;
  /** `center` sits the note in the middle of what it closes, such as «Solo tú la ves». */
  readonly align?: "start" | "center";
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function Note({
  children,
  icon = "info",
  size,
  boxed,
  accent,
  tile,
  outlined,
  align,
  testID,
  style,
}: NoteProps) {
  const theme = useTheme();
  const placed = noteAlign(align);
  const look = noteLook({ size, boxed, accent, tile, outlined });
  const mark = (
    <FoundationIcon
      name={icon}
      size={look.iconSize === 16 ? "sm" : "xs"}
      color={look.accent ? theme.color.icon.accent : theme.color.icon.secondary}
      decorative
    />
  );

  return (
    <View
      testID={testID}
      style={[
        styles.note,
        look.textSize === "sm" ? styles.medium : styles.small,
        look.boxed
          ? [styles.boxed, { backgroundColor: theme.color.background.surfaceMuted }]
          : null,
        look.outlined ? [styles.outlined, { borderColor: theme.color.border.subtle }] : null,
        { justifyContent: placed.justify },
        style,
      ]}
    >
      {look.tile ? (
        <View
          style={[
            styles.tile,
            {
              backgroundColor: theme.color.accent.tonal,
              borderColor: theme.color.accent.tonalBorder,
            },
          ]}
        >
          {mark}
        </View>
      ) : (
        <View style={look.textSize === "xs" && !look.outlined ? styles.smallMark : null}>
          {mark}
        </View>
      )}
      <Text
        role="body"
        size={look.textSize}
        color="secondary"
        style={placed.grow ? styles.phrase : null}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  note: { flexDirection: "row" },
  small: { alignItems: "flex-start", gap: 8 },
  medium: { alignItems: "center", gap: 12 },
  // Centres a 12 mark on the first line of 12 type set at 1.5.
  smallMark: { marginTop: 3 },
  boxed: { borderRadius: 14, padding: 14 },
  outlined: { alignItems: "center", gap: 10, borderWidth: 1, borderRadius: 18, padding: 14 },
  tile: {
    width: 34,
    height: 34,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  phrase: { flex: 1 },
});
