export const designSystemVersion = "0.1.0" as const;

export const brandColors = {
  cyan: "#55EFFB",
  ink: "#030713",
  chalk: "#EAFFFF",
} as const;

export const brandDimensions = {
  logo: { width: 405, height: 1149, viewBox: "0 0 405 1149" },
  logoCarrier: { width: 460, height: 480, viewBox: "0 0 460 480" },
  wordmark: { width: 4047, height: 756, viewBox: "0 0 4047 756" },
  lockup: { width: 1678, height: 480, viewBox: "0 0 1678 480" },
} as const;

export const brandAssetFiles = {
  logo: {
    cyan: "assets/logo/allfit-one-logo-cyan.svg",
    ink: "assets/logo/allfit-one-logo-ink.svg",
    chalk: "assets/logo/allfit-one-logo-chalk.svg",
  },
  logoCarrier: "assets/logo/allfit-one-logo-carrier.svg",
  wordmark: {
    onDark: "assets/wordmark/allfit-one-wordmark-on-dark.svg",
    onLight: "assets/wordmark/allfit-one-wordmark-on-light.svg",
  },
  lockup: {
    onDark: "assets/lockup/allfit-one-lockup-on-dark.svg",
    onLight: "assets/lockup/allfit-one-lockup-on-light.svg",
  },
} as const;

export type BrandSurface = "dark" | "light";
export type BrandLogoVariant = keyof typeof brandAssetFiles.logo;

export { brandGeometry } from "./geometry.js";
