# Allfit One Design System

The shared visual foundation for Allfit One, Allfit Space, Allfit OS, and the public landing experience.

## Current scope

This first foundation release contains shared foundations, canonical brand assets, and a visual explorer:

- color primitives and dark/light semantic themes;
- typography foundations for Barlow Condensed and Manrope;
- a shared 4 px spacing system;
- radius, elevation, and brand glow tokens;
- duration, easing, and spring motion tokens;
- generated TypeScript, CSS, and JSON outputs;
- canonical logo, wordmark, and lockup renderers;
- a semantic Lucide icon vocabulary for product interfaces;
- a responsive dark/light reference page for reviewing every foundation in context.

Platform adapters are separated so Web and native applications share decisions without sharing incompatible rendering code. Product UI components should be added after the foundations are exercised in both products.

## Packages

| Package | Purpose |
| --- | --- |
| `@allfitone/react` | React and Next.js brand, icon, token, and CSS adapters |
| `@allfitone/react-native` | React Native brand, icon, token, and platform helpers |
| `@allfitone/brand` | Canonical logo, wordmark, lockups, SVG assets, and React renderers |
| `@allfitone/icons` | Semantic icon catalog, sizing rules, and React adapter |
| `@allfitone/tokens` | Platform-neutral source tokens and generated web/tooling outputs |

## Apps

| App | Purpose |
| --- | --- |
| `@allfitone/docs` | Visual foundation explorer for reviewing tokens in context |

Usage rules and the rationale behind each scale live in [Foundations](docs/FOUNDATIONS.md). Accessibility requirements live in [Accessibility](docs/ACCESSIBILITY.md). Platform packaging and public imports live in [Platform packages](docs/PLATFORM-PACKAGES.md). Brand ownership and adoption rules live in [Brand and iconography](docs/BRAND-AND-ICONOGRAPHY.md).

## Commands

```bash
npm install
npm run dev
npm run build
npm run check
```

## Source-of-truth rule

Edit token definitions under `packages/tokens/src`, brand sources under `packages/brand`, and icon semantics under `packages/icons/src`. Do not hand-edit generated `dist` files or consumer asset copies.

The existing landing palette is preserved exactly. New success and warning colors are functional UI colors, not additional brand accents.
