import type { HexColor } from "./types.js";

export const color = {
  brand: {
    primary: "#55EFFB",
    light: "#68EEF4",
    turquoise: "#60D1D6",
    turquoiseDark: "#348E94",
    turquoiseDeep: "#176D72",
  },
  ink: {
    void: "#030713",
    panel: "#071923",
    secondary: "#0A2029",
    muted: "#102B34",
  },
  neutral: {
    white: "#FFFFFF",
    chalk: "#EAFFFF",
    mist: "#F3FFFF",
    frost: "#D9F4F4",
    black: "#000000",
  },
  feedback: {
    success: "#3DDC97",
    warning: "#F2B84B",
    danger: "#E54444",
    info: "#55EFFB",
  },
} as const satisfies Record<string, Record<string, HexColor>>;

export const semanticColor = {
  dark: {
    background: {
      canvas: color.ink.void,
      surface: color.ink.panel,
      surfaceSubtle: color.ink.secondary,
      surfaceMuted: color.ink.muted,
      inverse: color.neutral.chalk,
    },
    text: {
      primary: color.neutral.chalk,
      secondary: "#EAFFFFB8",
      muted: "#EAFFFF73",
      disabled: "#EAFFFF59",
      inverse: color.ink.void,
      accent: color.brand.primary,
    },
    icon: {
      primary: color.neutral.chalk,
      secondary: "#EAFFFF8F",
      accent: color.brand.primary,
      inverse: color.ink.void,
    },
    border: {
      subtle: "#68EEF421",
      default: "#348E9473",
      strong: color.brand.turquoiseDark,
      accent: color.brand.primary,
    },
    action: {
      primary: color.brand.primary,
      primaryHover: color.brand.light,
      onPrimary: color.ink.void,
      secondary: color.ink.secondary,
      secondaryHover: color.ink.muted,
      onSecondary: color.neutral.chalk,
      disabled: color.ink.muted,
      onDisabled: "#EAFFFF59",
    },
    focus: {
      ring: color.brand.light,
    },
    status: {
      success: color.feedback.success,
      warning: color.feedback.warning,
      danger: color.feedback.danger,
      info: color.feedback.info,
      onStatus: color.ink.void,
    },
  },
  light: {
    background: {
      canvas: color.neutral.chalk,
      surface: color.neutral.white,
      surfaceSubtle: color.neutral.mist,
      surfaceMuted: color.neutral.frost,
      inverse: color.ink.void,
    },
    text: {
      primary: color.ink.void,
      secondary: "#071923B8",
      muted: "#0719238F",
      disabled: "#07192366",
      inverse: color.neutral.chalk,
      accent: color.brand.turquoiseDeep,
    },
    icon: {
      primary: color.ink.void,
      secondary: "#071923A3",
      accent: color.brand.turquoiseDeep,
      inverse: color.neutral.chalk,
    },
    border: {
      subtle: "#0307131F",
      default: "#348E9466",
      strong: color.brand.turquoiseDeep,
      accent: color.brand.turquoiseDark,
    },
    action: {
      primary: color.brand.primary,
      primaryHover: color.brand.light,
      onPrimary: color.ink.void,
      secondary: color.neutral.white,
      secondaryHover: color.neutral.mist,
      onSecondary: color.ink.void,
      disabled: color.neutral.frost,
      onDisabled: "#07192366",
    },
    focus: {
      ring: color.brand.turquoiseDeep,
    },
    status: {
      success: color.feedback.success,
      warning: color.feedback.warning,
      danger: color.feedback.danger,
      info: color.feedback.info,
      onStatus: color.ink.void,
    },
  },
} as const;

