/**
 * Font loading for React Native surfaces.
 *
 * The token package names two families — Barlow Condensed and Manrope — but
 * ships no font files. On the web the browser resolves a family name against
 * whatever is installed or linked; React Native cannot. A name that was never
 * registered falls back to the platform font **silently**, which switches the
 * whole visual identity off without raising a single error.
 *
 * Loading therefore belongs to the design system rather than to each product:
 * two surfaces loading different weights of the same family is a divergence
 * nobody notices until the screens sit side by side.
 *
 * Only the seven faces `typographyRole` actually resolves to are loaded. Every
 * additional face is bundle weight paid on every cold start, so a role that
 * needs a new weight adds it here deliberately.
 */

import {
  BarlowCondensed_600SemiBold,
  BarlowCondensed_700Bold,
  BarlowCondensed_800ExtraBold_Italic,
} from "@expo-google-fonts/barlow-condensed";
import { Manrope_400Regular, Manrope_700Bold, Manrope_800ExtraBold } from "@expo-google-fonts/manrope";
import { useFonts } from "expo-font";

export {
  getNativeFontFamily,
  getRoleFontWeight,
  nativeFontFamily,
  type NativeFontFamily,
  type TypographyRoleName,
} from "./font-family.js";

const fontAssets = {
  BarlowCondensed_600SemiBold,
  BarlowCondensed_700Bold,
  BarlowCondensed_800ExtraBold_Italic,
  Manrope_400Regular,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} as const;

export type FontLoadingState = {
  readonly loaded: boolean;
  readonly error: Error | null;
};

/**
 * Loads every face the design system needs.
 *
 * Render nothing meaningful until `loaded` is true. Text drawn before the faces
 * register lays out with the platform font and reflows when they arrive, which
 * reads as a flash of restyled content.
 */
export function useAllfitFonts(): FontLoadingState {
  const [loaded, error] = useFonts(fontAssets);
  return { loaded, error: error ?? null };
}
