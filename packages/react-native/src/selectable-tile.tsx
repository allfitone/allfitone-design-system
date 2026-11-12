/**
 * A picture, a name and how many — chosen by tapping it.
 *
 * `Chip` is a word and `SelectableRow` is a line in a list; this is for a set
 * somebody recognises by sight before they read it. Equipment is the first use:
 * a barbell is faster to find as a barbell than as the word "barra".
 *
 * **The picture is `children`, and it runs to the tile's own edges.** The Design
 * System knows nothing about a product's assets and must not learn: a `source` prop
 * here would mean either bundling images into the library or inventing a path
 * convention for the consumer. The caller passes an `Image`, an icon, or whatever it
 * has; the tile gives it a band across its full width and clips it to its own corners.
 *
 * A smaller picture floating inside the tile read as a photograph cut out and pasted
 * onto it — two rounded rectangles, one inside the other, with the artwork's own
 * ground visible as a second surface. Bleeding it to the edges makes one card with a
 * picture rather than a card holding a picture.
 *
 * `count` says how much is behind the tile — nine exercises, four routines — and
 * is the difference between a filter somebody trusts and one they try blind. It is
 * set in the `control` role, like everything else somebody reads while scanning a
 * screen; `data` is the condensed face and tracks for a running clock, which is not
 * what a count that never changes while the screen is up needs.
 *
 * The role is `checkbox` for the same reason `SelectableRow` uses it: several can
 * be on at once and nothing lands until the set is applied.
 *
 * **A tile with no picture is shorter, not empty.** The height exists to hold a
 * picture; keeping it when none arrives draws a void with a word at the bottom of it,
 * and a grid where some things have artwork and some do not reads as broken rather
 * than as incomplete. Tiles on the same line still stretch to each other, so a row
 * that mixes the two stays a row.
 *
 * **With an `icon` it is an option card**: a glyph, a name and a line saying what the
 * option means, set to the left. That is the shape for a few kinds somebody must tell
 * apart by meaning rather than by sight — a pain, a limitation, a recovery — where the
 * caption is the reason the card exists. Cards on one line share the tallest one's
 * height, so a caption of two lines never leaves its neighbours short.
 *
 * `choice="single"` makes it a radio: picking one replaces the other, and the screen
 * reader says so. The default stays `multiple`, the equipment case.
 */

import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { FoundationIcon, type IconName } from "./icons.js";
import { Text } from "./text.js";
import { useTheme } from "./theme.js";

/** Tall enough for a picture, a name of two lines and a number under it. */
const MIN_HEIGHT = 134;

/** The tile's own, so a grid is a grid rather than eighteen consumer decisions. */
const PICTURE_HEIGHT = 96;

/** The inset the words keep, which the picture deliberately does not. */
const INSET = 8;

/** Without a picture there is nothing to make room for, so the tile stops pretending. */
const MIN_HEIGHT_BARE = 76;

export type SelectableTileProps = {
  readonly name: string;
  /** How many things this tile stands for. Absent when the count means nothing. */
  readonly count?: number;
  readonly selected: boolean;
  readonly onPress: () => void;
  readonly disabled?: boolean;
  /** The picture. An `Image`, an icon, anything the caller already has. */
  readonly children?: React.ReactNode;
  /** Draws an option card: this glyph, the name and `caption`, set to the left. */
  readonly icon?: IconName;
  /** What the option means, under its name. Only drawn on an option card. */
  readonly caption?: string;
  /** `single` answers as a radio; `multiple`, the default, as a checkbox. */
  readonly choice?: "multiple" | "single";
  readonly accessibilityLabel?: string;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function SelectableTile({
  name,
  count,
  selected,
  onPress,
  disabled,
  children,
  icon,
  caption,
  choice = "multiple",
  accessibilityLabel,
  testID,
  style,
}: SelectableTileProps) {
  const theme = useTheme();
  if (icon !== undefined) {
    return (
      <OptionCard
        name={name}
        icon={icon}
        caption={caption}
        selected={selected}
        onPress={onPress}
        disabled={disabled}
        choice={choice}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
        style={style}
      />
    );
  }
  // `null` and `undefined` both mean "the caller had nothing", and a consumer
  // choosing between them should not change the tile's shape.
  const bare = children === undefined || children === null;

  const border = () => {
    if (disabled) return theme.color.action.disabled;
    return selected ? theme.color.border.accent : theme.color.border.subtle;
  };

  const background = () => {
    if (disabled) return theme.color.background.surfaceSubtle;
    return selected ? theme.color.accent.tonal : theme.color.background.surface;
  };

  return (
    <Pressable
      accessibilityRole={choice === "single" ? "radio" : "checkbox"}
      accessibilityLabel={accessibilityLabel ?? name}
      accessibilityState={
        choice === "single"
          ? { selected, disabled: disabled === true }
          : { checked: selected, disabled: disabled === true }
      }
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: bare ? MIN_HEIGHT_BARE : MIN_HEIGHT,
          borderColor: border(),
          backgroundColor: background(),
          // Thicker when chosen, and the picture is inset by the difference so the
          // card does not grow and the grid does not shift under the thumb.
          borderWidth: selected ? 1.5 : 1,
          opacity: pressed && !disabled ? 0.7 : 1,
        },
        style,
      ]}
    >
      {bare ? null : (
        <View style={[styles.picture, { backgroundColor: theme.color.background.surfaceSubtle }]}>
          {children}
        </View>
      )}

      <View style={styles.words}>
        <Text
          role="control"
          size="sm"
          align="center"
          numberOfLines={2}
          color={disabled ? "disabled" : selected ? "accent" : "primary"}
        >
          {name}
        </Text>

        {count === undefined ? null : (
          <Text role="body" size="sm" color={selected ? "secondary" : "muted"}>
            {String(count)}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

function OptionCard({
  name,
  icon,
  caption,
  selected,
  onPress,
  disabled,
  choice,
  accessibilityLabel,
  testID,
  style,
}: {
  readonly name: string;
  readonly icon: IconName;
  readonly caption: string | undefined;
  readonly selected: boolean;
  readonly onPress: () => void;
  readonly disabled: boolean | undefined;
  readonly choice: "multiple" | "single";
  readonly accessibilityLabel: string | undefined;
  readonly testID: string | undefined;
  readonly style: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  const on = selected && disabled !== true;
  return (
    <Pressable
      accessibilityRole={choice === "single" ? "radio" : "checkbox"}
      accessibilityLabel={accessibilityLabel ?? (caption ? `${name}: ${caption}` : name)}
      accessibilityState={
        choice === "single"
          ? { selected, disabled: disabled === true }
          : { checked: selected, disabled: disabled === true }
      }
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.card,
        {
          borderColor: disabled
            ? theme.color.action.disabled
            : on
              ? theme.color.border.accent
              : theme.color.border.subtle,
          backgroundColor: on ? theme.color.accent.tonal : theme.color.background.surfaceSubtle,
          opacity: pressed && !disabled ? 0.7 : 1,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.glyph,
          { backgroundColor: on ? theme.color.icon.accent : theme.color.background.surface },
        ]}
      >
        <FoundationIcon
          name={icon}
          size="sm"
          color={on ? theme.color.accent.onAccent : theme.color.icon.secondary}
          decorative
        />
      </View>
      <Text
        role="control"
        size="sm"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
        color={disabled ? "disabled" : on ? "accent" : "primary"}
      >
        {name}
      </Text>
      {caption === undefined ? null : (
        <Text role="body" size="xs" color="muted">
          {caption}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 12,
  },
  glyph: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  base: {
    borderRadius: 16,
    flexDirection: "column",
    alignItems: "center",
    // The picture is pinned to the top rather than centred with the words: centring
    // moved it up whenever a name took two lines, so pictures in one row sat at
    // different heights.
    justifyContent: "flex-start",
    // The picture reaches the border, so the corners have to be cut here.
    overflow: "hidden",
    paddingBottom: 10,
  },
  picture: {
    width: "100%",
    height: PICTURE_HEIGHT,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  words: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingTop: 9,
    paddingHorizontal: INSET,
  },
});
