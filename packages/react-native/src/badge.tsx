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

import { badgeLook, type BadgeVariant } from "./badge-look.js";
import { Text } from "./text.js";
import { useTheme } from "./theme.js";
import { material, withAlpha } from "./tokens.js";

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
   * `tonal` tiñe el fondo con el tono y escribe la palabra en ese tono: un estado que
   * se lee sobre una fila oscura sin el brillo de un relleno sólido.
   */
  readonly variant?: BadgeVariant;
  readonly tone?: BadgeTone;
  /** Caps with the eyebrow's tracking. Default: on, except for `quiet`. */
  readonly uppercase?: boolean;
  /** A dot in the tone before the word, for a state that is live. */
  readonly dot?: boolean;
  /** Makes it a target. The badge reports the fact; pressing opens where it is set. */
  readonly onPress?: () => void;
  readonly accessibilityLabel?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function Badge({
  label,
  tone = "neutral",
  variant = "solid",
  uppercase,
  dot,
  onPress,
  accessibilityLabel,
  style,
}: BadgeProps) {
  const theme = useTheme();
  const look = badgeLook({ tone, variant, uppercase, dot });
  const toneColor = badgeToneColor(theme, tone);

  // Filled tones carry `onStatus` text; the palette picks that ink so the contrast
  // holds in both themes, which a hand-picked white or black does not.
  // El fondo de `quiet` es el del lienzo y no el del cristal: la `chip` de vidrio cuenta
  // con el desenfoque que hay detrás, y un badge no lo tiene. Al cuarenta por ciento
  // sobre una fotografía clara la píldora desaparece y deja el rótulo flotando.
  const background = {
    tone: toneColor,
    tint: withAlpha(toneColor, 0.14),
    muted: theme.color.background.surfaceMuted,
    canvas: theme.color.background.canvas,
    none: "transparent",
  }[look.fill];
  const edge = {
    fill: background,
    border: theme.color.border.default,
    chip: material[theme.name].chip.border,
    none: "transparent",
  }[look.edge];
  const ink = {
    onStatus: theme.color.status.onStatus,
    tone: toneColor,
    primary: theme.color.text.primary,
    secondary: theme.color.text.secondary,
  }[look.ink];

  const body = (
    <View style={[styles.pill, { backgroundColor: background, borderColor: edge }, style]}>
      {look.dot ? <View style={[styles.dot, { backgroundColor: ink }]} /> : null}
      {/* One line, always: a badge is one or two words by definition, and a wrapped
          one turns the row it labels into two rows. */}
      <Text
        role={look.role}
        size={look.size}
        uppercase={look.uppercase}
        numberOfLines={1}
        style={{ color: ink }}
      >
        {label}
      </Text>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    flexShrink: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  reach: { top: 10, bottom: 10, left: 8, right: 8 },
});
