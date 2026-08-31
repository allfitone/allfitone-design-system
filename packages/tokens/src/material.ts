import type { GlassMaterial } from "./types.js";

/**
 * Ink & Signal v2 — translucent materials.
 *
 * Glass is reserved for floating chrome only (tab bars, top bars, overlays,
 * theme toggles). Content cards use solid ink surfaces — see semanticColor.
 *
 * **Two materials, not one.** `glass` floats over the canvas, where the thing
 * behind it is a colour and the fill can afford to be heavy. `chip` floats over a
 * photograph, where the thing behind it is the reason the screen works: at the
 * same opacity it reads as a sticker, so it is lighter and its edge is brighter.
 * Using the chrome material on imagery is the mistake this split exists to stop.
 *
 * `shine` is the specular edge along the top. Drop it and the panel flattens into
 * a tinted rectangle immediately — it is not decoration, it is what says the
 * surface is lit.
 *
 * Web: backdrop-filter blur + saturate. React Native: expo-blur intensity
 * derived from `blur`, fill applied as overlay color.
 */
export const material = {
  dark: {
    glass: {
      fill: "#0B141DA8",
      border: "#F2FBFC2E",
      shine: "#F2FBFC1A",
      blur: 26,
      saturate: 1.3,
    },
    chip: {
      fill: "#0A1B2266",
      border: "#F2FBFC33",
      shine: "#F2FBFC1A",
      blur: 26,
      saturate: 1.3,
    },
  },
  light: {
    glass: {
      fill: "#FFFFFFA8",
      border: "#0A283226",
      shine: "#FFFFFF66",
      blur: 26,
      saturate: 1.3,
    },
    chip: {
      // The same chip in both themes: it sits on a photograph, and a photograph is
      // not a theme.
      fill: "#0A1B2266",
      border: "#F2FBFC33",
      shine: "#F2FBFC1A",
      blur: 26,
      saturate: 1.3,
    },
  },
} as const satisfies Record<"dark" | "light", Record<string, GlassMaterial>>;
