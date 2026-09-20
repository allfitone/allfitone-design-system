import type { HexColor } from "./types.js";

/**
 * Ink & Signal v2 primitives.
 *
 * Ink surfaces moved from teal-tinted panels to desaturated blue-gray ink —
 * calmer ground so the cyan signal is the only thing that speaks. Brand cyan
 * ramp is unchanged.
 */
export const color = {
  brand: {
    primary: "#55EFFB",
    light: "#6FF3FD",
    turquoise: "#60D1D6",
    turquoiseDark: "#348E94",
    turquoiseDeep: "#176D72",
    turquoiseInk: "#0E6E76",
  },
  ink: {
    void: "#030713",
    carbon: "#05090F",
    panel: "#0B141D",
    secondary: "#111D28",
    muted: "#16242F",
    onSignal: "#06282B",
  },
  neutral: {
    white: "#FFFFFF",
    salt: "#F2FBFC",
    chalk: "#EAFFFF",
    mist: "#F2FAFA",
    frost: "#E0EDED",
    canvasLight: "#EDF6F6",
    steel: "#9DB4BC",
    slate: "#7A929A",
    ash: "#5A707A",
    graphite: "#5F7680",
    ashDeep: "#536A73",
    slateSoft: "#6B838C",
    haze: "#A9BFC4",
    abyss: "#3A4C55",
    inkText: "#0A1B22",
    inkSoft: "#456069",
    black: "#000000",
  },
  feedback: {
    success: "#3DDC97",
    successDeep: "#087A52",
    warning: "#F2B84B",
    warningDeep: "#8C5D08",
    danger: "#E54444",
    dangerSoft: "#FF6B6B",
    dangerStrong: "#C72C35",
    info: "#6FA8FF",
    infoDeep: "#2D6FD6",
    ember: "#FB923C",
    emberDeep: "#B4520A",
    sport: "#B490F5",
    sportDeep: "#7C5CC9",
  },
} as const satisfies Record<string, Record<string, HexColor>>;

export const semanticColor = {
  dark: {
    background: {
      canvas: color.ink.carbon,
      surface: color.ink.panel,
      surfaceSubtle: color.ink.secondary,
      surfaceMuted: color.ink.muted,
      inverse: color.neutral.salt,
    },
    text: {
      primary: color.neutral.salt,
      secondary: color.neutral.steel,
      muted: color.neutral.slate,
      disabled: color.neutral.graphite,
      inverse: color.ink.carbon,
      accent: color.brand.primary,
      danger: color.feedback.dangerSoft,
      success: color.feedback.success,
    },
    icon: {
      primary: color.neutral.salt,
      secondary: color.neutral.steel,
      accent: color.brand.primary,
      inverse: color.ink.carbon,
    },
    border: {
      subtle: "#86BEC824",
      default: color.neutral.ash,
      strong: color.brand.turquoiseDark,
      accent: color.brand.primary,
    },
    action: {
      primary: color.brand.primary,
      primaryHover: color.brand.light,
      onPrimary: color.ink.onSignal,
      secondary: color.ink.secondary,
      secondaryHover: color.ink.muted,
      onSecondary: color.neutral.salt,
      disabled: color.ink.muted,
      onDisabled: color.neutral.graphite,
    },
    accent: {
      tonal: "#55EFFB17",
      tonalBorder: "#55EFFB38",
      // El filo de una tarjeta que **es** la pantalla, no una fila dentro de ella. Al
      // 22 % de `tonalBorder` una tarjeta de trescientos puntos se deshace contra el
      // lienzo; al 100 % de `border.accent` se convierte en un botón. Éste es el único
      // borde que se ve desde lejos sin pedir la vez.
      edge: "#55EFFB73",
      onAccent: color.ink.onSignal,
      onAccentMuted: "#06282BA8",
    },
    wheel: {
      near: color.neutral.slate,
      far: color.neutral.abyss,
    },
    // One per discipline, and they are identity rather than status: the carousel is a
    // row of things that differ, and a single accent across six cards would say they
    // are the same thing six times. Five reuse a feedback primitive because the hue is
    // already in the system — what changes is what it means here.
    discipline: {
      strength: color.brand.primary,
      highIntensity: color.feedback.warning,
      endurance: color.feedback.ember,
      combat: color.feedback.dangerSoft,
      wellbeing: color.feedback.success,
      rhythm: color.feedback.sport,
    },
    focus: {
      ring: color.brand.light,
    },
    status: {
      success: color.feedback.success,
      warning: color.feedback.warning,
      danger: color.feedback.danger,
      info: color.feedback.info,
      sport: color.feedback.sport,
      onStatus: color.ink.carbon,
    },
  },
  light: {
    background: {
      canvas: color.neutral.canvasLight,
      surface: color.neutral.white,
      surfaceSubtle: color.neutral.mist,
      surfaceMuted: color.neutral.frost,
      inverse: color.neutral.inkText,
    },
    text: {
      primary: color.neutral.inkText,
      secondary: color.neutral.inkSoft,
      muted: color.neutral.ashDeep,
      disabled: color.neutral.slate,
      inverse: color.neutral.salt,
      accent: color.brand.turquoiseInk,
      danger: color.feedback.dangerStrong,
      success: color.feedback.successDeep,
    },
    icon: {
      primary: color.neutral.inkText,
      secondary: color.neutral.inkSoft,
      accent: color.brand.turquoiseInk,
      inverse: color.neutral.salt,
    },
    border: {
      subtle: "#0A28321F",
      default: color.neutral.graphite,
      strong: color.brand.turquoiseInk,
      accent: color.brand.turquoiseDark,
    },
    action: {
      primary: color.brand.primary,
      primaryHover: color.brand.light,
      onPrimary: color.ink.onSignal,
      secondary: color.neutral.white,
      secondaryHover: color.neutral.mist,
      onSecondary: color.neutral.inkText,
      disabled: color.neutral.frost,
      onDisabled: color.neutral.slate,
    },
    accent: {
      tonal: "#0E6E7614",
      tonalBorder: "#0E6E7633",
      // Más opaco que en oscuro: sobre blanco, un cian translúcido se lava, y lo que
      // en el tema oscuro separa por brillo aquí tiene que separar por densidad.
      edge: "#0E6E767A",
      onAccent: color.ink.onSignal,
      onAccentMuted: "#06282BA8",
    },
    wheel: {
      near: color.neutral.slateSoft,
      far: color.neutral.haze,
    },
    discipline: {
      strength: color.brand.turquoiseInk,
      highIntensity: color.feedback.warningDeep,
      endurance: color.feedback.emberDeep,
      combat: color.feedback.dangerStrong,
      wellbeing: color.feedback.successDeep,
      rhythm: color.feedback.sportDeep,
    },
    focus: {
      ring: color.brand.turquoiseInk,
    },
    status: {
      success: color.feedback.successDeep,
      warning: color.feedback.warningDeep,
      danger: color.feedback.dangerStrong,
      info: color.feedback.infoDeep,
      sport: color.feedback.sportDeep,
      onStatus: color.neutral.white,
    },
  },
} as const;
