/**
 * Pure resolution of a typographic role into React Native style values.
 *
 * Separated from the component so it can be imported and asserted outside a
 * React Native runtime. The two conversions below are silent-failure territory:
 * a ratio passed through unconverted still renders text, just at the wrong size,
 * and nothing in the build would catch it.
 *
 * - `lineHeight` is a unitless ratio in the tokens; React Native wants absolute.
 * - `letterSpacing` is an `em` ratio in the tokens; React Native wants absolute.
 */

import type { TextStyle } from "react-native";

import { getNativeFontFamily, type TypographyRoleName } from "./font-family.js";
import { resolveNativeLetterSpacing, typography, typographyRole } from "./tokens.js";

export type TextSizeName = keyof typeof typography.size;

export function resolveTextStyle(role: TypographyRoleName, size: TextSizeName): TextStyle {
  const definition = typographyRole[role];
  const fontSize = typography.size[size];
  const lineHeight = fontSize * typography.lineHeight[definition.lineHeight];

  return {
    fontFamily: getNativeFontFamily(role),
    fontSize,
    lineHeight,
    letterSpacing: resolveNativeLetterSpacing(fontSize, definition.letterSpacing),
    // The display and heading roles lead tighter than their own em box — 0.82
    // for display — which is what gives stacked headlines their density. On the
    // web the ascender simply overflows the line box and still paints. React
    // Native crops the glyph to the line box instead, so the tops of capitals
    // are cut off.
    //
    // Padding the deficit gives the first ascender room without loosening the
    // spacing between lines, so the intended rhythm survives.
    paddingTop: Math.max(0, Math.ceil(fontSize - lineHeight)),
  };
}
