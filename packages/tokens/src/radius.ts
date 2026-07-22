export const radius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  control: 10,
  lg: 12,
  xl: 16,
  "2xl": 20,
  "3xl": 24,
  "4xl": 32,
  "5xl": 40,
  full: 9999,
} as const;

export const semanticRadius = {
  control: radius.control,
  controlSmall: radius.md,
  card: radius.lg,
  panel: radius.xl,
  overlay: radius["2xl"],
  device: radius["5xl"],
  pill: radius.full,
  circle: radius.full,
} as const;

