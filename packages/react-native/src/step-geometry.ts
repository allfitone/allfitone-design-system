/**
 * Where a numbered marker sits against the text it labels.
 *
 * Apart from the component for the reason the other geometry modules are: what imports
 * `react-native` cannot be asserted outside Metro, and this is the part worth asserting.
 *
 * **The problem it solves is that the two are not the same height.** A marker is a box
 * of a fixed size; a step is a paragraph whose first line is one line box tall. Aligned
 * to the top of the row they share an edge but not a centre, and the marker reads as
 * floating above its own sentence. Aligning the row to its centre instead is worse: on
 * a step that runs to three lines the marker drifts to the middle of the paragraph,
 * which is where nothing begins.
 *
 * So the row stays aligned to the top and the **marker** is nudged down to meet the
 * first line. The other direction was tried and is wrong, because of how iOS lays a
 * line out: when `lineHeight` exceeds the font size the extra space goes **above** the
 * glyph, not split around it. Body text at 14 in a 21 line box therefore already sits
 * 7 points down inside its own box, so centring the two boxes leaves the marker riding
 * visibly high — measured at 2.4 points on a device, which is plainly visible at this
 * size. What has to agree is where the ink is, not where the boxes are.
 */

/**
 * Wide enough for two digits, and close enough to the line it labels to belong to it.
 * Measured against the text on a device: at 36 the marker was twice the cap height
 * beside it and read as a button somebody forgot to make pressable. This sits just
 * above the body's own line box, which is what makes it a marker and not a control.
 */
export const STEP_MARKER_SIZE = 24;

/** A squircle: rounder than the cards on the same screen, short of a circle. */
export const STEP_MARKER_RADIUS = 8;

/**
 * What the marker drops by so its centre meets the ink of the first line.
 *
 * The glyph sits `lineHeight - fontSize` below the top of its line box and is
 * `fontSize` tall, so its centre is at `lineHeight - fontSize / 2`. The marker's is at
 * half its own height. The difference is the nudge.
 */
export function stepMarkerOffset(
  markerSize: number,
  lineHeight: number,
  fontSize: number,
): number {
  return Math.max(0, lineHeight - fontSize / 2 - markerSize / 2);
}
