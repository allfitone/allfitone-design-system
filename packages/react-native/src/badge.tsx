/**
 * A word that says what kind of thing something is.
 *
 * **It is not a Chip and the difference is what it does, not how it looks.** A chip
 * is a choice: you press it, it stays on, and the row it lives in is a question. A
 * badge states a fact about the row it sits on — the set is a warm-up, the plan is
 * free, the session was missed — and pressing it, when it can be pressed at all,
 * opens the place where that fact is changed rather than changing it.
 *
 * **Uppercase here, and only here.** The library spent a whole review taking caps off
 * names and phrases, because a name in caps is decoded rather than read. A badge is
 * the opposite case: one or two words, never prose, that must be told apart at a
 * glance in a dense table. That is exactly the `eyebrow` role's job — 0.2em of
 * tracking is what keeps caps legible at 10px instead of welding them together.
 *
 * **Tone is meaning, not decoration.** `DT-009` reserves colour for what a colour
 * says, so a consumer picks the tone whose sense matches — not the hue it likes. The
 * tones are the semantic slots the palette already has; there is no free colour here
 * on purpose, because the moment a badge takes a hex it becomes a sticker.
 *
 * `neutral` is the default and is drawn as an outline. It is the tone for the
 * ordinary case, which in a list of four kinds is the one that should recede: colour
 * spent on the default leaves nothing to spend on the exception.
 */

import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Text } from "./text.js";
import { useTheme } from "./theme.js";
import { material } from "./tokens.js";

export type BadgeTone =
  | "neutral"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "sport"
  // Identity, not status. The palette keeps these six for telling one thing from
  // another — which discipline, which superset — where nothing is going wrong and a
  // status colour would say that it is.
  | "strength"
  | "highIntensity"
  | "endurance"
  | "combat"
  | "wellbeing"
  | "rhythm";

const IDENTITY = [
  "strength",
  "highIntensity",
  "endurance",
  "combat",
  "wellbeing",
  "rhythm",
] as const;

export type IdentityTone = (typeof IDENTITY)[number];

/**
 * The colour a tone paints with, for a consumer that has to match something to it —
 * a rule down the edge of the rows a badge labels, and nothing else it could ask.
 */
export function badgeToneColor(theme: ReturnType<typeof useTheme>, tone: BadgeTone): string {
  if (tone === "neutral") return theme.color.border.default;
  if (tone === "accent") return theme.color.icon.accent;
  if ((IDENTITY as readonly string[]).includes(tone)) {
    return theme.color.discipline[tone as IdentityTone];
  }
  return theme.color.status[tone as "success" | "warning" | "danger" | "info" | "sport"];
}

/** The identity tones in order, for anything that has to hand them out one by one. */
export function identityTone(index: number): IdentityTone {
  return IDENTITY[index % IDENTITY.length] as IdentityTone;
}

export type BadgeProps = {
  readonly label: string;
  /**
   * `solid` rellena con el color del estado y es el que se escanea en una tabla.
   * `quiet` es para lo que va **encima de una fotografía**: toma el material `chip`,
   * que el sistema reserva exactamente para eso, y se lee como una frase en caja baja
   * en vez de como una etiqueta a gritos.
   */
  readonly variant?: "solid" | "quiet";
  readonly tone?: BadgeTone;
  /** Makes it a target. The badge reports the fact; pressing opens where it is set. */
  readonly onPress?: () => void;
  readonly accessibilityLabel?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function Badge({
  label,
  tone = "neutral",
  variant = "solid",
  onPress,
  accessibilityLabel,
  style,
}: BadgeProps) {
  const theme = useTheme();

  // Filled tones carry `onStatus` text; the palette picks that ink so the contrast
  // holds in both themes, which a hand-picked white or black does not.
  const filled = variant === "solid" && tone !== "neutral";
  const chip = material[theme.name].chip;
  const quiet = variant === "quiet";
  const background = quiet ? chip.fill : filled ? badgeToneColor(theme, tone) : "transparent";
  const edge = quiet ? chip.border : filled ? background : theme.color.border.default;
  const ink = quiet
    ? tone === "neutral"
      ? theme.color.text.primary
      : badgeToneColor(theme, tone)
    : filled
      ? theme.color.status.onStatus
      : theme.color.text.secondary;

  const body = (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: background,
          borderColor: edge,
        },
        style,
      ]}
    >
      {/* One line, always: a badge is one or two words by definition, and a wrapped
          one turns the row it labels into two rows. */}
      {quiet ? (
        <Text role="control" size="xs" numberOfLines={1} style={{ color: ink }}>
          {label}
        </Text>
      ) : (
        <Text role="eyebrow" size="2xs" uppercase numberOfLines={1} style={{ color: ink }}>
          {label}
        </Text>
      )}
    </View>
  );

  if (!onPress) return body;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      // The pill is short by design, so the reach is added rather than the height:
      // `ACCESSIBILITY.md` measures what the finger hits, not what the eye sees.
      hitSlop={styles.reach}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    flexShrink: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  reach: { top: 10, bottom: 10, left: 8, right: 8 },
});
