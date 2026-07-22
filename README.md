# Allfit One Design System

The shared visual foundation for Allfit One, Allfit Space, Allfit OS, and the public landing experience.

## Current scope

This first foundation release contains the shared design tokens and a visual explorer:

- color primitives and dark/light semantic themes;
- typography foundations for Barlow Condensed and Manrope;
- a shared 4 px spacing system;
- radius, elevation, and brand glow tokens;
- duration, easing, and spring motion tokens;
- generated TypeScript, CSS, and JSON outputs;
- a responsive dark/light reference page for reviewing every foundation in context.

The package intentionally does not contain React or React Native components yet. Components should be added only after the foundations are exercised in both products.

## Packages

| Package | Purpose |
| --- | --- |
| `@allfitone/tokens` | Platform-neutral source tokens and generated web/tooling outputs |

## Apps

| App | Purpose |
| --- | --- |
| `@allfitone/docs` | Visual foundation explorer for reviewing tokens in context |

Usage rules and the rationale behind each scale live in [Foundations](docs/foundations.md).

## Commands

```bash
npm install
npm run dev
npm run build
npm run check
```

## Source-of-truth rule

Edit files under `packages/tokens/src`. Do not hand-edit anything under `packages/tokens/dist`; those files are generated.

The existing landing palette is preserved exactly. New success and warning colors are functional UI colors, not additional brand accents.
