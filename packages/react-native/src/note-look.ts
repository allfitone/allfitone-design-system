/**
 * The sizes of a `Note`, decided apart from the drawing so they can be asserted.
 *
 * `sm` is the footnote under a form; `md` sits beside content, a step up. `accent`
 * inks the mark; the tonal tile belongs to `md` only, because at the small size a
 * 34 px tile would outweigh the phrase it marks. A tile is always in the accent.
 * `outlined` stands the note alone as a panel, so even the small one draws a 16 mark.
 */

export type NoteSize = "sm" | "md";

export interface NoteLook {
  readonly textSize: "xs" | "sm";
  readonly iconSize: 12 | 16;
  readonly boxed: boolean;
  readonly tile: boolean;
  readonly accent: boolean;
  /** Outlined instead of muted, as a panel of its own; the mark grows to 16. */
  readonly outlined: boolean;
}

export function noteLook({
  size = "sm",
  boxed = false,
  accent = false,
  tile = false,
  outlined = false,
}: {
  readonly size?: NoteSize | undefined;
  readonly boxed?: boolean | undefined;
  readonly accent?: boolean | undefined;
  readonly tile?: boolean | undefined;
  readonly outlined?: boolean | undefined;
}): NoteLook {
  const tiled = size === "md" && tile;
  const ground = boxed && !outlined;
  return size === "md"
    ? { textSize: "sm", iconSize: 16, boxed: ground, tile: tiled, accent: accent || tiled, outlined }
    : { textSize: "xs", iconSize: outlined ? 16 : 12, boxed: ground, tile: false, accent, outlined };
}

/** A centred note sits in the middle of what it closes, its phrase only as wide as it is. */
export function noteAlign(align: "start" | "center" | undefined): {
  readonly justify: "flex-start" | "center";
  readonly grow: boolean;
} {
  return align === "center" ? { justify: "center", grow: false } : { justify: "flex-start", grow: true };
}
