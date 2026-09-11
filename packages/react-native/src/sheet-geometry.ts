/**
 * Where a sheet sits when the keyboard is up.
 *
 * A sheet is anchored to the bottom edge, which is exactly where the keyboard
 * appears, so a sheet that takes typing is covered by the thing it asked for. The
 * search sheet in Space was the first: focusing the field left one result visible.
 *
 * Kept here rather than inside `sheet.tsx` because that module imports
 * `react-native` and cannot be executed outside Metro. This is the part worth
 * defending, so it is the part that stays assertable.
 *
 * **The panel is lifted with a transform, never by moving its edge.** `bottom` and
 * `height` are layout, and a keyboard that animates open would re-run Yoga every
 * frame; `translateY` is free. The cap has to move too, or a tall sheet lifted by
 * the keyboard's height runs off the top of the screen.
 */

/** Enough of the screen behind stays visible that its context is not lost. */
export const MAX_HEIGHT_RATIO = 0.85;

export interface SheetGeometry {
  /** How far up the panel travels to clear the keyboard. */
  readonly lift: number;
  /** The tallest the panel may be, measured against what the keyboard leaves. */
  readonly maxHeight: number;
  /** Air under the last line: the home indicator, unless the keyboard covers it. */
  readonly paddingBottom: number;
}

export function resolveSheetGeometry(input: {
  readonly screenHeight: number;
  readonly keyboardHeight: number;
  readonly safeAreaBottom: number;
  readonly basePadding: number;
}): SheetGeometry {
  const keyboard = Math.max(0, input.keyboardHeight);
  return {
    lift: keyboard,
    maxHeight: Math.max(0, input.screenHeight - keyboard) * MAX_HEIGHT_RATIO,
    // The home indicator is under the keyboard, so reserving for it as well would
    // leave the panel floating a strip above the keys.
    paddingBottom: (keyboard > 0 ? 0 : input.safeAreaBottom) + input.basePadding,
  };
}
