---
"@allfitone/tokens": minor
"@allfitone/react": minor
"@allfitone/react-native": minor
---

Ink & Signal — design system v2.

Tokens:

- New `gradient` / `semanticGradient` tokens (`signal`, `signalDeep`) — the single accent block allowed per screen, emitted to CSS as `--afo-gradient-*`.
- New `material` tokens (glass fill/border/blur/saturate per theme) for floating chrome only (tab bars, top bars, overlays), emitted as `--afo-material-glass-*` per theme.
- Ink surface ramp desaturated from teal-tinted panels to blue-gray ink (`ink.carbon/panel/secondary/muted`) so the cyan signal is the only accent that speaks. Brand cyan ramp unchanged.
- Semantic palettes rebuilt for dark and light (new `accent.tonal/onAccent` group, `status.sport`), all 32 WCAG contrast pairs validated.
- Elevation v2: cards are borderless — separation via surface tone + one soft large shadow (`semanticShadow.card` → `md`). `glowStrong` tuned for CTAs.
- `semanticRadius.action` (pill) added; `card` → 16, `panel` → 20.
- New `typographyRole.data`: large metrics render in Barlow Condensed semibold with tabular figures.

React:

- `Button` is pill-shaped via `--afo-radius-action`.
- `Card` drops its border and relies on tone + shadow.
