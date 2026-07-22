# Foundations

These rules keep Allfit Space and Allfit OS recognizably related without forcing both products into identical layouts.

## Color

### Brand primitives

| Token | Value | Role |
| --- | --- | --- |
| `color.brand.primary` | `#55EFFB` | Primary signature, active action, selected state |
| `color.brand.light` | `#68EEF4` | Hover and focus emphasis |
| `color.brand.turquoise` | `#60D1D6` | Supporting brand tone |
| `color.brand.turquoiseDark` | `#348E94` | Borders and restrained support |
| `color.brand.turquoiseDeep` | `#176D72` | Accessible accent text on light surfaces |
| `color.ink.void` | `#030713` | Core dark canvas and text on cyan |
| `color.neutral.chalk` | `#EAFFFF` | Core light canvas and text on dark |

The original landing colors remain unchanged. `turquoiseDeep` extends the family only where the existing turquoise tones do not provide enough contrast for small text on a light surface.

Dark is the default ecosystem theme. Light is a first-class semantic theme for dense administrative views, documents, and moments that need visual relief.

Rules:

- use semantic color tokens in product UI;
- reserve cyan for action, focus, selection, and a single visual emphasis;
- do not use success or warning as decorative accents;
- do not place cyan body text on light backgrounds;
- status color must always communicate status.

## Typography

- Barlow Condensed owns display, section heading, and athletic editorial moments.
- Manrope owns body copy, controls, labels, navigation, data, and long-form reading.
- Display type should be uppercase only when hierarchy or brand voice justifies it.
- Use `typographyRole` before composing a new role from primitives.
- Product body text should normally start at `typography.size.sm` or `typography.size.md`.

Letter spacing tokens are unitless `em` ratios. React Native adapters must multiply the ratio by the active font size to produce its numeric `letterSpacing` value.

## Spacing

The system uses a 4 px grid with a 2 px half-step for optical correction only.

- normal component spacing: `spacing[2]` through `spacing[6]`;
- layout spacing: `spacing[8]` and above;
- minimum interactive target: `semanticSpacing.touchTarget` (`44px`);
- avoid arbitrary values when an existing token is within 2 px of the intended result.

## Radius

Radius communicates hierarchy, not decoration.

- controls: `semanticRadius.control`;
- cards: `semanticRadius.card`;
- large structural panels: `semanticRadius.panel`;
- dialogs and floating overlays: `semanticRadius.overlay`;
- circles and pills: only `semanticRadius.circle` or `semanticRadius.pill`.

Do not make every container rounded. Dividers and alignment should carry structure before borders and radii do.

## Shadows

Shadows are structured arrays to remain portable. Web adapters may join layers into `box-shadow`; React Native adapters should map the structure to the platform capability in use.

- `control` and `card` establish separation;
- `floating`, `overlay`, and `workspace` indicate actual elevation;
- `brandGlow` is reserved for one signature visual moment;
- borders should usually do more work than shadows in dense OS interfaces.

## Motion

Motion communicates response, continuity, entry, or exit.

- feedback: immediate response to direct input;
- transition: ordinary state changes;
- enter: content arriving or expanding;
- exit: content leaving or collapsing;
- reduced: zero-duration fallback.

Use the semantic motion roles in products. Use springs for spatial movement on React Native and cubic-bezier easing for equivalent web transitions. Never require motion to understand state, and always honor reduced-motion preferences.

## Cross-platform contract

- TypeScript values are the runtime contract for both products.
- CSS variables are a generated web adapter, not a second source of truth.
- JSON is a generated tooling artifact for documentation and future Figma synchronization.
- Platform component packages may alias semantic tokens, but must not redefine primitive values.

