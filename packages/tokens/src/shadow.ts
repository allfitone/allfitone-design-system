import type { ShadowLayer } from "./types.js";

const layer = (x: number, y: number, blur: number, spread: number, color: ShadowLayer["color"]): ShadowLayer => ({
  x,
  y,
  blur,
  spread,
  color,
});

export const shadow = {
  none: [] as readonly ShadowLayer[],
  xs: [layer(0, 1, 2, 0, "#0307131F")],
  sm: [layer(0, 6, 18, -6, "#03071329")],
  md: [layer(0, 18, 55, -18, "#0307133D")],
  lg: [layer(0, 34, 80, -24, "#0000006B")],
  xl: [layer(0, 40, 100, -28, "#00000057")],
  focus: [layer(0, 0, 0, 2, "#EAFFFF"), layer(0, 0, 0, 4, "#030713")],
  glow: [layer(0, 0, 70, 0, "#55EFFB14")],
  glowStrong: [layer(0, 0, 34, 0, "#55EFFB59")],
} as const;

export const semanticShadow = {
  control: shadow.xs,
  card: shadow.sm,
  floating: shadow.md,
  overlay: shadow.lg,
  workspace: shadow.xl,
  focus: shadow.focus,
  brandGlow: shadow.glow,
  brandGlowStrong: shadow.glowStrong,
} as const;
