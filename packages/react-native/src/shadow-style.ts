/**
 * Conversion from the token shadow layers to React Native style values.
 *
 * Pure, so it can be asserted outside a React Native runtime: a wrong shadow
 * still renders something plausible, which is exactly the failure nothing else
 * would catch.
 *
 * Two things do not survive the crossing and are worth knowing before reaching
 * for a token here:
 *
 * - **Only the first layer is used.** iOS takes one shadow per view, so a
 *   multi-layer token is approximated by its first layer rather than silently
 *   composited into something the designer never specified.
 * - **Spread is dropped.** React Native has no equivalent, and folding it into
 *   the radius changes the falloff rather than the size.
 *
 * Android ignores all of it and uses `elevation`, derived from the offset and
 * blur because that is the only lever the platform exposes.
 */

import { Platform, type ViewStyle } from "react-native";

import { semanticShadow } from "./tokens.js";

export type SemanticShadowName = keyof typeof semanticShadow;

function alphaOf(hex: string): number {
  // Token colours carry alpha as a trailing pair; without it they are opaque.
  return hex.length === 9 ? parseInt(hex.slice(7, 9), 16) / 255 : 1;
}

export function resolveShadowStyle(name: SemanticShadowName): ViewStyle {
  const [first] = semanticShadow[name];
  if (!first) return {};

  if (Platform.OS === "android") {
    // Elevation is a single number, so it has to stand in for offset and blur
    // at once. Half the blur tracks the visual weight closely enough at the
    // sizes the tokens use.
    return { elevation: Math.max(1, Math.round(first.blur / 2)) };
  }

  return {
    shadowColor: first.color.slice(0, 7),
    shadowOffset: { width: first.x, height: first.y },
    shadowOpacity: alphaOf(first.color),
    shadowRadius: first.blur,
  };
}
