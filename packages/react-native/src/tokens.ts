import { semanticColor, semanticSpacing, typography } from "@allfitone/tokens";

export * from "@allfitone/tokens";

export type NativePlatform = "ios" | "android";
export type ThemeName = keyof typeof semanticColor;
export type LetterSpacingName = keyof typeof typography.letterSpacing;

export const nativeTouchTarget = {
  ios: semanticSpacing.touchTargetIos,
  android: semanticSpacing.touchTargetAndroid,
} as const;

export function getNativeTouchTarget(platform: NativePlatform) {
  return nativeTouchTarget[platform];
}

export function getNativeTheme(theme: ThemeName) {
  return semanticColor[theme];
}

export function resolveNativeLetterSpacing(fontSize: number, role: LetterSpacingName) {
  return fontSize * typography.letterSpacing[role];
}
