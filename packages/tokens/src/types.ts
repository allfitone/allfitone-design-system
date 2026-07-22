export type HexColor = `#${string}`;

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

