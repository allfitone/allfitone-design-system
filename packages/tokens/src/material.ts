import type { GlassMaterial } from "./types.js";

/**
 * Ink & Signal v2 — translucent materials.
 *
 * Glass is reserved for floating chrome only (tab bars, top bars, overlays,
 * theme toggles). Content cards use solid ink surfaces — see semanticColor.
 *
 * Web: backdrop-filter blur + saturate. React Native: expo-blur intensity
 * derived from `blur`, fill applied as overlay color.
 */
export const material = {
  dark: {
    glass: {
      fill: "#0B141DA8",
      border: "#F2FBFC2E",
      blur: 26,
      saturate: 1.3,
    },
  },
  light: {
    glass: {
      fill: "#FFFFFFA8",
      border: "#0A283226",
      blur: 26,
      saturate: 1.3,
    },
  },
} as const satisfies Record<"dark" | "light", Record<string, GlassMaterial>>;
