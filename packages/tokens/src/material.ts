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
      fill: "#0B141DB8",
      border: "#86BEC829",
      blur: 20,
      saturate: 1.3,
    },
  },
  light: {
    glass: {
      fill: "#FFFFFFBD",
      border: "#0A28321F",
      blur: 20,
      saturate: 1.3,
    },
  },
} as const satisfies Record<"dark" | "light", Record<string, GlassMaterial>>;
