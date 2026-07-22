export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
} as const;

export const semanticSpacing = {
  controlInsetX: spacing[4],
  controlInsetY: spacing[3],
  cardInset: spacing[4],
  panelInset: spacing[6],
  sectionGap: spacing[16],
  touchTarget: spacing[11],
} as const;

