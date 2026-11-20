/**
 * The three grounds of an `OfferRow`, decided apart from the drawing so they can be asserted.
 *
 * `deep` is the offer a sheet exists for: the signal ground, a solid accent tile and a
 * chevron. `quiet` lives between sections of a screen that already has its lead: flat,
 * outlined, the tile barely tinted and no arrow. `muted` is a card on a sheet, one of
 * several things to record: the muted ground reads against the sheet's own surface,
 * and its large tile wears the tone of what it records. `tonal` is something kept behind
 * a plan — «Lo anterior al 19 oct sigue guardado»: the accent's tonal ground and edge, a
 * bare mark and no arrow. `action` is one entry of a sheet's menu — «Editar», «Eliminar»:
 * a quiet card whose destructive entry wears the danger ground, edge and name.
 */

export type OfferTone = "deep" | "quiet" | "muted" | "tonal" | "action";
export type OfferEnd = "chevron" | "none";

export interface OfferLook {
  readonly ground: "signal" | "surface" | "muted" | "tonal" | "subtle";
  readonly edge: boolean;
  readonly radius: number;
  /** Horizontal, vertical. */
  readonly padding: readonly [number, number];
  /** A fixed height, or 0 to follow the content. */
  readonly height: number;
  readonly gap: number;
  readonly tile: {
    readonly size: number;
    readonly radius: number;
    readonly fill: "solid" | "tonal" | "tint" | "muted" | "none";
    readonly edge: boolean;
  };
  readonly iconSize: "sm" | "md";
  readonly captionSize: "sm" | "xs";
  /** 0 lets the caption wrap. */
  readonly captionLines: number;
  readonly chevron: boolean;
}

const LOOKS: Record<OfferTone, OfferLook> = {
  deep: {
    ground: "signal",
    edge: false,
    radius: 22,
    padding: [14, 0],
    height: 74,
    gap: 12,
    tile: { size: 42, radius: 14, fill: "solid", edge: false },
    iconSize: "sm",
    captionSize: "sm",
    captionLines: 0,
    chevron: true,
  },
  quiet: {
    ground: "surface",
    edge: true,
    radius: 20,
    padding: [14, 12],
    height: 0,
    gap: 12,
    tile: { size: 36, radius: 12, fill: "tonal", edge: false },
    iconSize: "sm",
    captionSize: "sm",
    captionLines: 0,
    chevron: false,
  },
  muted: {
    ground: "muted",
    edge: true,
    radius: 22,
    padding: [14, 14],
    height: 0,
    gap: 14,
    tile: { size: 46, radius: 16, fill: "tint", edge: true },
    iconSize: "md",
    captionSize: "xs",
    captionLines: 1,
    chevron: true,
  },
  tonal: {
    ground: "tonal",
    edge: true,
    radius: 18,
    padding: [16, 16],
    height: 0,
    gap: 12,
    tile: { size: 0, radius: 0, fill: "none", edge: false },
    iconSize: "md",
    captionSize: "xs",
    captionLines: 0,
    chevron: false,
  },
  action: {
    ground: "subtle",
    edge: true,
    radius: 18,
    padding: [12, 12],
    height: 0,
    gap: 14,
    tile: { size: 36, radius: 12, fill: "muted", edge: false },
    iconSize: "sm",
    captionSize: "sm",
    captionLines: 0,
    chevron: false,
  },
};

export function offerLook({
  tone = "deep",
  end,
}: {
  readonly tone?: OfferTone | undefined;
  readonly end?: OfferEnd | undefined;
}): OfferLook {
  const base: OfferLook = LOOKS[tone];
  return end === undefined ? base : { ...base, chevron: end === "chevron" };
}

/** The inks of an offer. Only an `action` can be destructive. */
export interface OfferPaint {
  readonly ground: "signal" | "surface" | "muted" | "tonal" | "subtle" | "danger";
  readonly edge: "subtle" | "accent" | "danger";
  readonly tile: "solid" | "tonal" | "tint" | "muted" | "none" | "danger";
  /** `tone` is the `iconTone`, the accent by default. */
  readonly glyph: "onAccent" | "tone" | "primary" | "danger";
  readonly label: "md" | "sm";
  readonly labelInk: "primary" | "danger";
  readonly captionInk: "muted" | "secondary";
}

export function offerPaint({
  tone = "deep",
  danger = false,
}: {
  readonly tone?: OfferTone | undefined;
  readonly danger?: boolean | undefined;
}): OfferPaint {
  const look = LOOKS[tone];
  if (tone === "action") {
    return danger
      ? { ground: "danger", edge: "danger", tile: "danger", glyph: "danger", label: "md", labelInk: "danger", captionInk: "muted" }
      : { ground: "subtle", edge: "subtle", tile: "muted", glyph: "primary", label: "md", labelInk: "primary", captionInk: "muted" };
  }
  return {
    ground: look.ground,
    edge: tone === "tonal" ? "accent" : "subtle",
    tile: look.tile.fill,
    glyph: look.tile.fill === "solid" ? "onAccent" : "tone",
    label: tone === "tonal" ? "sm" : "md",
    labelInk: "primary",
    captionInk: look.ground === "muted" || tone === "tonal" ? "secondary" : "muted",
  };
}
