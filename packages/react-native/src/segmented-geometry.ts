/**
 * How big a segmented control is, apart from the component for the reason the other
 * geometry modules are: what imports `react-native` cannot be asserted outside Metro.
 *
 * **Two sizes, one control.** `md` splits a screen in two and is touched standing up, so
 * every segment is a full target by itself. `sm` sits inside a card, beside the label of
 * what it changes — a chart's range, a photo's view — where a 48 track would outweigh
 * the figure it serves.
 *
 * **Small is drawn small, not made small to the finger.** The `sm` segment is 24 tall;
 * `hitSlop` reaches past it to the platform's 48 target, so what the eye reads as a
 * compact switch the thumb still hits as a button.
 */

export type SegmentedSize = "md" | "sm";

export interface SegmentedGeometry {
  /** The track, border included. */
  readonly height: number;
  /** Between the track and the chosen segment, on every side. */
  readonly inset: number;
  /** The gap between segments. */
  readonly gap: number;
  /** Each segment's narrowest, for labels as short as «1M». */
  readonly minSegmentWidth: number;
  readonly labelSize: "sm" | "2xs";
  /** Added on every side, so the touch target is the segment plus twice this. */
  readonly hitSlop: number;
}

const GEOMETRY: Readonly<Record<SegmentedSize, SegmentedGeometry>> = {
  md: { height: 48, inset: 4, gap: 4, minSegmentWidth: 0, labelSize: "sm", hitSlop: 4 },
  sm: { height: 28, inset: 2, gap: 2, minSegmentWidth: 34, labelSize: "2xs", hitSlop: 12 },
};

export function segmentedGeometry(size: SegmentedSize): SegmentedGeometry {
  return GEOMETRY[size];
}
