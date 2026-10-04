# Allfit One social media and banner kit

Ready-to-upload images of the Allfit One logo and lockup on Design System
tones. Every file is generated from the canonical brand geometry: the mark and
the outlined wordmark are the ones `BrandLockup` renders, and every background
colour is a token from `@allfitone/tokens`. Nothing here is redrawn.

The tone directories and `manifest.json` are generated output. Do not edit the
files by hand; change `scripts/social-assets.mjs` and run:

```bash
npm run generate:social --workspace @allfitone/brand
```

`npm run check` fails when the committed files drift from the generator.

## Files

Each tone directory holds every format as an SVG (vector, editable) and a PNG
(ready for upload) named `allfit-one-<format>-<tone>`:

```
social/
  ink/             allfit-one-link-preview-ink.png, .svg, …
  surface-deep/
  ambient-dark/
  chalk/
  white/
  ambient-light/
  manifest.json    the tones, formats, and files, for tooling
```

## Formats

| Format | Size | Mark | Platforms |
| --- | --- | --- | --- |
| `avatar` | 1080 × 1080 | logo | Profile picture on Instagram, X, LinkedIn, Facebook, and YouTube |
| `square` | 1080 × 1080 | lockup | Instagram and Facebook feed, LinkedIn image post |
| `story` | 1080 × 1920 | lockup | Instagram and Facebook stories, reel covers, TikTok |
| `link-preview` | 1200 × 630 | lockup | Open Graph and X card images for shared links |
| `x-header` | 1500 × 500 | lockup | X (Twitter) profile header |
| `linkedin-banner` | 1584 × 396 | lockup | LinkedIn profile and company page banner |
| `facebook-cover` | 1640 × 624 | lockup | Facebook page cover |
| `youtube-banner` | 2560 × 1440 | lockup | YouTube channel art; the lockup sits inside the 1546 × 423 safe area |

The avatar carries the logo alone because the lockup does not read inside a
small circular crop. Every other format centres the lockup with generous clear
space so platform crops and overlaid profile pictures do not touch it.

## Tones

| Tone | Surface | Background |
| --- | --- | --- |
| `ink` | dark | Flat brand ink, `color.ink.void`. The default dark tone. |
| `surface-deep` | dark | The `gradient.surfaceDeep` ink gradient used by large cards. |
| `ambient-dark` | dark | Dark canvas, `color.ink.carbon`, under the ambient backdrop blooms. |
| `chalk` | light | Flat brand chalk, `color.neutral.chalk`. The default light tone. |
| `white` | light | Pure white for platforms that frame images on white. |
| `ambient-light` | light | Light canvas, `color.neutral.canvasLight`, under the ambient backdrop blooms. |

Dark tones use the on-dark lockup (chalk `ALLFIT`, cyan `ONE`); light tones use
the on-light lockup (ink `ALLFIT`, cyan `ONE`). The ambient tones reproduce the
three blooms of the React Native `AmbientBackdrop` at its own opacities, without
the dot grid, which reads as a pattern at banner scale.

There is deliberately no tone on the signal gradient or on flat cyan: the mark
and `ONE` are cyan, and the brand package ships no monochrome lockup.

## Usage rules

- Upload the PNG as is. Do not crop into the lockup, add effects, or recolour.
- Pick the tone that matches the surrounding platform surface. When in doubt use
  `ink` on dark interfaces and `chalk` or `white` on light ones.
- Use the SVG when a platform or tool accepts vectors, or to export another size
  with the same layout.
- Product-specific social assets are not part of this kit: Space, Studio, and
  Backoffice reuse the exact Allfit One logo and only their wordmark differs.
