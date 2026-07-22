export { color, semanticColor } from "./color.js";
export { createCssVariables } from "./css.js";
export { motion, semanticMotion } from "./motion.js";
export { radius, semanticRadius } from "./radius.js";
export { semanticShadow, shadow } from "./shadow.js";
export { semanticSpacing, spacing } from "./spacing.js";
export { typography, typographyRole } from "./typography.js";
export type { CubicBezier, HexColor, ShadowLayer, SpringConfig } from "./types.js";

import { color, semanticColor } from "./color.js";
import { motion, semanticMotion } from "./motion.js";
import { radius, semanticRadius } from "./radius.js";
import { semanticShadow, shadow } from "./shadow.js";
import { semanticSpacing, spacing } from "./spacing.js";
import { typography, typographyRole } from "./typography.js";

export const tokenBundle = {
  meta: {
    name: "Allfit One Design Tokens",
    version: "0.1.0",
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
    typography,
    spacing,
    radius,
    shadow,
    motion,
  },
  semantic: {
    color: semanticColor,
    typography: typographyRole,
    spacing: semanticSpacing,
    radius: semanticRadius,
    shadow: semanticShadow,
    motion: semanticMotion,
  },
} as const;

