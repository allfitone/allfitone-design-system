import type { ShadowLayer } from "./types.js";

const layer = (x: number, y: number, blur: number, spread: number, color: ShadowLayer["color"]): ShadowLayer => ({
  x,
  y,
  blur,
  spread,
  color,
});

/**
 * Ink & Signal v2 — elevation is tone + one soft, large shadow.
 * Cards carry no borders; separation comes from surface tone and `card`.
 */
export const shadow = {
  none: [] as readonly ShadowLayer[],
  xs: [layer(0, 1, 2, 0, "#0307131F")],
  sm: [layer(0, 12, 32, -12, "#03071340")],
  md: [layer(0, 20, 50, -20, "#03071399")],
  lg: [layer(0, 34, 80, -24, "#0000006B")],
  xl: [layer(0, 40, 100, -28, "#00000057")],
  focus: [layer(0, 0, 0, 2, "#F2FBFC"), layer(0, 0, 0, 4, "#05090F")],
  glow: [layer(0, 0, 70, 0, "#55EFFB14")],
  glowStrong: [layer(0, 0, 42, -6, "#55EFFB80")],
} as const;

export const semanticShadow = {
  control: shadow.xs,
  card: shadow.md,
  floating: shadow.md,
  overlay: shadow.lg,
  workspace: shadow.xl,
  focus: shadow.focus,
  brandGlow: shadow.glow,
  brandGlowStrong: shadow.glowStrong,
} as const;
