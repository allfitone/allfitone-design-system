/**
 * A way out offered in a row: a tile with a glyph, what it is, and what happens.
 *
 * A plain button would fit, but a button is a verb on its own and this carries two
 * lines: the second says what pressing it does, or what is waiting behind it.
 *
 * **Three grounds, because the product draws three.** `deep` is the offer a sheet
 * exists for — «Crear una rutina»: the signal ground, a solid accent tile, a chevron.
 * `quiet` lives between sections of a screen that already has its lead — «Entrenamiento
 * libre, tienes uno en curso»: flat and outlined, the tile barely tinted, no arrow, so
 * it never competes with the carousel above it. `muted` is one card among several on a
 * sheet — «Peso», «Medidas», «Foto de progreso»: the muted ground reads against the
 * sheet's surface, and the large tile wears the tone of what it records.
 *
 * `captionTone="accent"` is for a caption that says something is waiting, not what
 * the row does. `badge` ends the row in a word instead of the chevron — «Pro».
 *
 * `tonal` is something kept behind a plan — «Lo anterior al 19 oct sigue guardado»: the
 * accent's tonal ground and edge, the mark bare. `action` is an entry of a sheet's menu
 * — «Editar entreno», «Eliminar entreno»: a quiet card, and `danger` paints the
 * destructive one red on its ground, edge, tile and name so it reads as different first.
 */

import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Badge, badgeToneColor, type BadgeTone } from "./badge.js";
import { SignalBlock } from "./gradient.js";
import { FoundationIcon, type IconName } from "./icons.js";
import { offerLook, offerPaint, type OfferEnd, type OfferTone } from "./offer-look.js";
import { Text } from "./text.js";
import { useTheme } from "./theme.js";
import { withAlpha } from "./tokens.js";

export type { OfferEnd, OfferTone } from "./offer-look.js";

export type OfferRowProps = {
  readonly icon: IconName;
  readonly label: string;
  /** What pressing it does. Without one it is a button, and there is a button for that. */
  readonly caption: string;
  /** Default `deep`. */
  readonly tone?: OfferTone;
  /** `accent` when the caption says something is waiting. Default `muted`. */
  readonly captionTone?: "muted" | "secondary" | "accent";
  /** The tone of the tile on a `muted` offer. Default `accent`. */
  readonly iconTone?: BadgeTone;
  /** Overrides the ground's own end: a chevron or nothing. */
  readonly end?: OfferEnd;
  /** A word in place of the chevron, such as «Pro». */
  readonly badge?: string;
  /** On an `action`, the destructive entry: red ground, edge, tile and name. */
  readonly danger?: boolean;
  readonly onPress: () => void;
  readonly accessibilityLabel?: string;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
};

export function OfferRow({
  icon,
  label,
  caption,
  tone = "deep",
  captionTone,
  iconTone = "accent",
  end,
  badge,
  danger,
  onPress,
  accessibilityLabel,
  testID,
  style,
}: OfferRowProps) {
  const theme = useTheme();
  const look = offerLook({ tone, end });
  const paint = offerPaint({ tone, danger });
  const toneInk = badgeToneColor(theme, iconTone);
  const dangerInk = theme.color.status.danger;
  const tileFill = {
    solid: theme.color.icon.accent,
    tonal: theme.color.accent.tonal,
    tint: withAlpha(toneInk, 0.12),
    muted: theme.color.background.surfaceMuted,
    danger: withAlpha(dangerInk, 0.15),
    none: "transparent",
  }[paint.tile];
  const glyphInk = {
    onAccent: theme.color.accent.onAccent,
    tone: toneInk,
    primary: theme.color.icon.primary,
    danger: dangerInk,
  }[paint.glyph];
  const captionInk = captionTone ?? paint.captionInk;
  const ground = {
    signal: "transparent",
    surface: theme.color.background.surface,
    muted: theme.color.background.surfaceMuted,
    tonal: theme.color.accent.tonal,
    subtle: theme.color.background.surfaceSubtle,
    danger: withAlpha(dangerInk, 0.08),
  }[paint.ground];
  const edge = {
    subtle: theme.color.border.subtle,
    accent: theme.color.accent.tonalBorder,
    danger: withAlpha(dangerInk, 1 / 3),
  }[paint.edge];

  const frame: StyleProp<ViewStyle> = [
    styles.row,
    {
      gap: look.gap,
      borderRadius: look.radius,
      paddingHorizontal: look.padding[0],
      paddingVertical: look.padding[1],
    },
    look.height > 0 ? { height: look.height } : null,
    look.edge ? { borderWidth: 1, borderColor: edge, backgroundColor: ground } : null,
  ];

  const inside = (
    <>
      {look.tile.size === 0 ? (
        <FoundationIcon name={icon} size={look.iconSize} color={glyphInk} decorative />
      ) : (
        <View
          style={[
            styles.tile,
            {
              width: look.tile.size,
              height: look.tile.size,
              borderRadius: look.tile.radius,
              backgroundColor: tileFill,
            },
            look.tile.edge ? { borderWidth: 1, borderColor: withAlpha(toneInk, 0.35) } : null,
          ]}
        >
          <FoundationIcon name={icon} size={look.iconSize} color={glyphInk} decorative />
        </View>
      )}
      <View style={styles.text}>
        <Text
          role="control"
          size={paint.label}
          {...(paint.labelInk === "danger" ? { style: { color: dangerInk } } : {})}
        >
          {label}
        </Text>
        <Text
          role="body"
          size={look.captionSize}
          color={captionInk}
          {...(look.captionLines > 0 ? { numberOfLines: look.captionLines } : {})}
        >
          {caption}
        </Text>
      </View>
      {badge !== undefined ? (
        <Badge label={badge} tone="accent" />
      ) : look.chevron ? (
        <FoundationIcon name="next" size="sm" color={theme.color.icon.secondary} decorative />
      ) : null}
    </>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel ?? (badge === undefined ? label : `${label}. Con ${badge}`)
      }
      accessibilityHint={caption}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [{ borderRadius: look.radius, opacity: pressed ? 0.7 : 1 }, style]}
    >
      {look.ground === "signal" ? (
        <SignalBlock variant="surfaceDeep" style={frame}>
          {inside}
        </SignalBlock>
      ) : (
        <View style={frame}>{inside}</View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  tile: { alignItems: "center", justifyContent: "center" },
  text: { flex: 1, gap: 2 },
});
