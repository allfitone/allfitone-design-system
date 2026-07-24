export { color, semanticColor } from "./color.js";
export { createCssVariables } from "./css.js";
export { gradient, semanticGradient } from "./gradient.js";
export { material } from "./material.js";
export { motion, semanticMotion } from "./motion.js";
export { radius, semanticRadius } from "./radius.js";
export { semanticShadow, shadow } from "./shadow.js";
export { semanticSpacing, spacing } from "./spacing.js";
export { typography, typographyRole } from "./typography.js";
export type { CubicBezier, GlassMaterial, Gradient, GradientStop, HexColor, ShadowLayer, SpringConfig } from "./types.js";
export { designSystemVersion } from "./version.js";

import { color, semanticColor } from "./color.js";
import { gradient, semanticGradient } from "./gradient.js";
import { material } from "./material.js";
import { motion, semanticMotion } from "./motion.js";
import { radius, semanticRadius } from "./radius.js";
import { semanticShadow, shadow } from "./shadow.js";
import { semanticSpacing, spacing } from "./spacing.js";
import { typography, typographyRole } from "./typography.js";
import { designSystemVersion } from "./version.js";

export const tokenBundle = {
  meta: {
    name: "Allfit One Design Tokens",
    version: designSystemVersion,
    designVersion: "2.0.0",
    theme: "ink-and-signal",
    defaultTheme: "dark",
    units: {
      dimension: "px",
      duration: "ms",
      lineHeight: "unitless",
      letterSpacing: "em",
    },
  },
  primitive: {
    color,
    gradient,
    typography,
    spacing,
    radius,
    shadow,
    motion,
  },
  semantic: {
    color: semanticColor,
    gradient: semanticGradient,
    material,
    typography: typographyRole,
    spacing: semanticSpacing,
    radius: semanticRadius,
    shadow: semanticShadow,
    motion: semanticMotion,
  },
} as const;
