export type HexColor = `#${string}`;

export type GradientStop = Readonly<{
  color: HexColor;
  position: number;
}>;

export type Gradient = Readonly<{
  angle: number;
  stops: readonly GradientStop[];
}>;

export type GlassMaterial = Readonly<{
  fill: HexColor;
  border: HexColor;
  /** The specular edge along the top. Without it the panel reads as a flat block. */
  shine: HexColor;
  blur: number;
  saturate: number;
}>;

export type ShadowLayer = Readonly<{
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: HexColor;
}>;

export type CubicBezier = readonly [number, number, number, number];

export type SpringConfig = Readonly<{
  damping: number;
  stiffness: number;
  mass: number;
}>;

