# Allfit One reusable brand assets

This directory contains the canonical reusable SVG exports derived from the current Allfit One identity.

## Asset families

- `logo/`: the custom forward-leaning “1” mark.
- `wordmark/`: the outlined `ALLFIT ONE` wordmark, without the logo.
- `lockup/`: the logo carrier and outlined wordmark together.

## Variants

- Use `on-light` when the surrounding surface is light.
- Use `on-dark` when the surrounding surface is dark.
- Use the cyan logo by default. The ink and chalk logos are monochrome alternatives for constrained contexts.

All files have transparent backgrounds. The wordmark lettering is converted to vector outlines, so these SVGs do not depend on an installed or embedded font and can be reused across Next.js, React Native, design tools, and export pipelines.

## Brand colors

- Electric cyan: `#55EFFB`
- Black blue: `#030713`
- Cool chalk: `#EAFFFF`

## Usage rules

- Preserve the SVG aspect ratio.
- Do not stretch, skew, redraw, recolor, or rearrange the assets.
- Keep the cyan emphasis on `ONE` in the primary wordmark and lockup.
- Prefer the standalone logo for compact square or vertical placements.
- Prefer the wordmark when the symbol is already visible nearby.
- Prefer the lockup for primary brand identification.
- Provide “Allfit One” as accessible text when the asset is decorative or its internal title is not exposed by the host platform.

The pre-existing files in `public/brand/` remain available for social avatars, Open Graph, WhatsApp, and backwards compatibility.

