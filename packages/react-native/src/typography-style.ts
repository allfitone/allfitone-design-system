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
 * - `data` promises tabular figures and nothing was setting them.
 */

import type { TextStyle } from "react-native";

import { getNativeFontFamily, type TypographyRoleName } from "./font-family.js";
import { resolveNativeLetterSpacing, typography, typographyRole } from "./tokens.js";

export type TextSizeName = keyof typeof typography.size;

/**
 * `tracking` opens a role's letter spacing for one use, as an `em` ratio that
 * replaces the token's. Left out, the role keeps its own: every product sees the
 * same type unless one of them asks, at the call site, for something else.
 */
export interface TextStyleOptions {
  readonly tracking?: number | undefined;
}

export function resolveTextStyle(
  role: TypographyRoleName,
  size: TextSizeName,
  options: TextStyleOptions = {},
): TextStyle {
  const definition = typographyRole[role];
  const fontSize = typography.size[size];
  const lineHeight = fontSize * typography.lineHeight[definition.lineHeight];

  return {
    fontFamily: getNativeFontFamily(role),
    fontSize,
    lineHeight,
    // The `data` role exists for metrics, timers and KPIs, and its token says it renders
    // with tabular figures. Nothing was asking for them, so a running clock reflowed on
    // every tick — `00:09` to `00:10` is two glyphs of different width in proportional
    // figures, and the whole row shifts under the eye that is reading it.
    ...(role === "data" ? { fontVariant: ["tabular-nums" as const] } : {}),
    letterSpacing:
      options.tracking === undefined
        ? resolveNativeLetterSpacing(fontSize, definition.letterSpacing)
        : fontSize * options.tracking,
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
