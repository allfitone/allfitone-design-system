/**
 * The mapping from typographic role to registered font family.
 *
 * Kept apart from the loader so it carries no native dependency and can be
 * asserted outside a React Native runtime. The strings are matched literally by
 * the platform, so they are contract, not labels: renaming one detaches every
 * role that points at it and the text silently falls back to the system face.
 */

import { typography, typographyRole } from "./tokens.js";

export type TypographyRoleName = keyof typeof typographyRole;

export const nativeFontFamily = {
  displaySemibold: "BarlowCondensed_600SemiBold",
  displayBold: "BarlowCondensed_700Bold",
  bodyRegular: "Manrope_400Regular",
  bodyBold: "Manrope_700Bold",
  bodyExtrabold: "Manrope_800ExtraBold",
} as const;

export type NativeFontFamily = (typeof nativeFontFamily)[keyof typeof nativeFontFamily];

const roleFamily: Record<TypographyRoleName, NativeFontFamily> = {
  display: nativeFontFamily.displayBold,
  heading: nativeFontFamily.displaySemibold,
  data: nativeFontFamily.displaySemibold,
  body: nativeFontFamily.bodyRegular,
  label: nativeFontFamily.bodyBold,
  control: nativeFontFamily.bodyExtrabold,
  eyebrow: nativeFontFamily.bodyExtrabold,
};

/**
 * Products should reach for `<Text role="…">` instead. This is exported for the
 * cases a raw `TextStyle` is unavoidable, such as a third-party surface.
 */
export function getNativeFontFamily(role: TypographyRoleName): NativeFontFamily {
  return roleFamily[role];
}

/**
 * The weight the token declares for a role.
 *
 * Never apply this as `fontWeight`: combined with a custom `fontFamily`, Android
 * synthesises a face and renders visibly heavier than the real one. It exists so
 * a caller can assert which weight a role resolves to.
 */
export function getRoleFontWeight(role: TypographyRoleName): number {
  return typography.weight[typographyRole[role].weight];
}
