/**
 * How much of an `IconButton` is drawn and how much is reach.
 *
 * `md` is the platform target itself; `sm` matches `Button`'s compact height and lends
 * the rest from slop. `xs` is the glyph alone — a trash can at the end of a crowded
 * row — so the row keeps its words on one line, and all of its target is slop.
 */

export type IconButtonSize = "md" | "sm" | "xs";

const GLYPH = 16;
const COMPACT = 36;

export function iconButtonBox(
  size: IconButtonSize,
  touchTarget: number
): { readonly box: number; readonly reach: number } {
  if (size === "md") return { box: touchTarget, reach: 0 };
  // Android's 48 is the larger of the two targets, so both platforms are covered.
  const box = size === "sm" ? COMPACT : GLYPH;
  return { box, reach: Math.max(4, Math.ceil((Math.max(touchTarget, 48) - box) / 2)) };
}
