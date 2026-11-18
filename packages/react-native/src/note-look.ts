/**
 * The sizes of a `Note`, decided apart from the drawing so they can be asserted.
 *
 * `sm` is the footnote under a form; `md` sits beside content, a step up. `accent`
 * inks the mark; the tonal tile belongs to `md` only, because at the small size a
 * 34 px tile would outweigh the phrase it marks. A tile is always in the accent.
 */

export type NoteSize = "sm" | "md";

export interface NoteLook {
  readonly textSize: "xs" | "sm";
  readonly iconSize: 12 | 16;
  readonly boxed: boolean;
  readonly tile: boolean;
  readonly accent: boolean;
}

export function noteLook({
  size = "sm",
  boxed = false,
  accent = false,
  tile = false,
}: {
  readonly size?: NoteSize | undefined;
  readonly boxed?: boolean | undefined;
  readonly accent?: boolean | undefined;
  readonly tile?: boolean | undefined;
}): NoteLook {
  const tiled = size === "md" && tile;
  return size === "md"
    ? { textSize: "sm", iconSize: 16, boxed, tile: tiled, accent: accent || tiled }
    : { textSize: "xs", iconSize: 12, boxed, tile: false, accent };
}
