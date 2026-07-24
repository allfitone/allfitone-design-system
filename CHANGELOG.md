# Allfit One Design System changelog

## 0.1.0

Initial public release of the Ink & Signal design system.

### Foundations

- Added platform-neutral color, gradient, material, typography, spacing, radius, shadow, and motion tokens.
- Added dark and light semantic themes with validated WCAG contrast pairs.
- Added generated TypeScript, CSS, and JSON token outputs.
- Added canonical brand assets, geometry, and semantic iconography.
- Established a 12 px minimum visible-text contract and platform-safe touch targets.

### Platform packages

- Added React and React Native adapters over the same tokens, brand geometry, and icon catalog.
- Added accessible React components, including keyboard, focus, reduced-motion, and forced-colors behavior.
- Added native theme, touch-target, and letter-spacing helpers.

### Release metadata

- All public packages ship at the same global version.
- Every package exports `designSystemVersion`.
- Tokens also expose the version through `tokenBundle.meta.version`, `tokens.json`, and `--afo-design-system-version`.
