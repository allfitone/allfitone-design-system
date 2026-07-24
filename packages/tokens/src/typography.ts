export const typography = {
  family: {
    display: "Barlow Condensed",
    body: "Manrope",
  },
  stack: {
    display: '"Barlow Condensed", "Arial Narrow", sans-serif',
    body: '"Manrope", system-ui, -apple-system, sans-serif',
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
    "6xl": 64,
    "7xl": 80,
    "8xl": 96,
    "9xl": 128,
  },
  lineHeight: {
    display: 0.82,
    displayTight: 0.9,
    tight: 1.1,
    compact: 1.25,
    body: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    display: -0.055,
    tight: -0.025,
    normal: 0,
    utility: 0.16,
    eyebrow: 0.2,
  },
} as const;

export const typographyRole = {
  display: {
    family: "display",
    weight: "bold",
    lineHeight: "display",
    letterSpacing: "display",
  },
  heading: {
    family: "display",
    weight: "semibold",
    lineHeight: "displayTight",
    letterSpacing: "tight",
  },
  body: {
    family: "body",
    weight: "regular",
    lineHeight: "body",
    letterSpacing: "normal",
  },
  label: {
    family: "body",
    weight: "bold",
    lineHeight: "compact",
    letterSpacing: "utility",
  },
  eyebrow: {
    family: "body",
    weight: "extrabold",
    lineHeight: "compact",
    letterSpacing: "eyebrow",
  },
  /**
   * Ink & Signal v2: large data numerals (metrics, timers, KPIs) render in
   * the condensed display face with tabular figures for athletic character.
   */
  data: {
    family: "display",
    weight: "semibold",
    lineHeight: "tight",
    letterSpacing: "normal",
  },
} as const;

