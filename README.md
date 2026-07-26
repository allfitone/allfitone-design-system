# Allfit One Design System

The shared visual foundation for Allfit One, Allfit Space, Allfit OS, and the public landing experience.

> **Beta:** Every `0.x.y` release belongs to the beta maturity line. The first
> official Design System release will be `1.0.0`, after both products have been
> validated in market. Package versions remain independent, while the Explorer
> communicates the current maturity line simply as `v0`.

## Current scope

This foundation release contains shared foundations, canonical brand assets, accessible Web components, and a visual explorer:

- color primitives and dark/light semantic themes;
- typography foundations for Barlow Condensed and Manrope;
- a shared 4 px spacing system;
- radius, elevation, and brand glow tokens;
- duration, easing, and spring motion tokens;
- generated TypeScript, CSS, and JSON outputs;
- canonical logo, wordmark, and lockup renderers;
- a semantic Lucide icon vocabulary for product interfaces;
- a Base UI and shadcn-compatible React component layer;
- an Ink & Signal v2 signature built from one gradient signal surface, pulse marks, athletic numerals, and tick-ring progress;
- responsive dark/light reference pages for reviewing foundations and components in context.

Platform adapters are separated so Web and native applications share decisions without sharing incompatible rendering code. React components live only in `@allfitone/react`; product repositories consume public package subpaths rather than copying component source.

Public npm releases use the `@allfitone` organization, independent package versions, Changesets, and an approval-gated OIDC workflow. Bootstrap and normal release instructions live in [Releasing public packages](docs/RELEASING.md).

## Packages

| Package | Purpose |
| --- | --- |
| `@allfitone/react` | React and Next.js foundations plus accessible Web components |
| `@allfitone/react-native` | React Native brand, icon, token, and platform helpers |
| `@allfitone/brand` | Canonical logo, wordmark, lockups, SVG assets, and React renderers |
| `@allfitone/icons` | Semantic icon catalog, sizing rules, and React adapter |
| `@allfitone/tokens` | Platform-neutral source tokens and generated web/tooling outputs |

## Apps

| App | Purpose |
| --- | --- |
| `@allfitone/docs` | Private Next.js visual explorer; `/` redirects to foundations at `/ui-foundation`, with the component catalog at `/components` |

Usage rules and the rationale behind each scale live in [Foundations](docs/FOUNDATIONS.md). Accessibility requirements live in [Accessibility](docs/ACCESSIBILITY.md). Web component contracts live in [Web components](docs/WEB-COMPONENTS.md), with remaining component and product-pattern work tracked in [Web UI pending work](docs/WEB-UI-PENDING.md). Platform packaging and public imports live in [Platform packages](docs/PLATFORM-PACKAGES.md). Brand ownership and adoption rules live in [Brand and iconography](docs/BRAND-AND-ICONOGRAPHY.md).

## Commands

```bash
npm install
npm run dev
npm run build
npm run check
npm run check:e2e
```

## Source-of-truth rule

Edit token definitions under `packages/tokens/src`, brand sources under `packages/brand`, and icon semantics under `packages/icons/src`. Do not hand-edit generated `dist` files or consumer asset copies.

The existing landing palette is preserved exactly. New success and warning colors are functional UI colors, not additional brand accents.
