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
  /**
   * Air between the safe area and the first thing on a screen. The safe area only
   * clears the hardware; content that starts the instant it ends reads as pinned to
   * the notch.
   *
   * 12 read as pinned on a device and 16 still did — every screen looked shoved
   * against the top of the phone at once, which is the tell that this is one number
   * and not a hundred layouts. 20 is where it stopped. Judged on a phone in the hand
   * rather than on an artboard, which is the only place this reads wrong.
   */
  screenTop: spacing[5],
  sectionGap: spacing[16],
  touchTarget: spacing[11],
  touchTargetWeb: spacing[11],
  touchTargetIos: spacing[11],
  touchTargetAndroid: spacing[12],
} as const;
