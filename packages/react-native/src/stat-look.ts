/**
 * The frame of a `StatTile` and the arc of a `ProgressRing`, apart from the drawing.
 *
 * A stat tile is a figure somebody picks in order to edit it: `stack` puts a visual over
 * the figure, its label and its mode, three to a row; `inline` is the glyph, the name
 * and the value side by side, two to a row. The chosen one wears the accent edge, a
 * half point thicker, and never grows, so the row does not shift under the thumb.
 */

export type StatLayout = "stack" | "inline";

export interface StatTileLook {
  readonly direction: "column" | "row";
  readonly align: "center";
  readonly radius: number;
  readonly padding: number;
  readonly gap: number;
  readonly edge: "subtle" | "accent";
  readonly edgeWidth: number;
}

export function statTileLook({
  layout = "stack",
  selected = false,
}: {
  readonly layout?: StatLayout | undefined;
  readonly selected?: boolean | undefined;
}): StatTileLook {
  const edge = selected ? "accent" : "subtle";
  const edgeWidth = selected ? 1.5 : 1;
  return layout === "stack"
    ? { direction: "column", align: "center", radius: 22, padding: 12, gap: 6, edge, edgeWidth }
    : { direction: "row", align: "center", radius: 20, padding: 14, gap: 10, edge, edgeWidth };
}

/** The circle a ring is drawn on, and how much of it its share fills. */
export function ringArc(
  size: number,
  stroke: number,
  share: number
): { readonly radius: number; readonly length: number; readonly filled: number } {
  const radius = (size - stroke) / 2;
  const length = 2 * Math.PI * radius;
  return { radius, length, filled: Math.max(0, Math.min(1, share)) * length };
}
