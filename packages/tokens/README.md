# `@allfitone/tokens`

Cross-platform design tokens for Next.js/React and React Native.

## Units

- spacing, radius, font size, and shadow geometry use density-independent numeric pixels;
- duration uses milliseconds;
- line height and letter spacing use unitless ratios;
- colors use six- or eight-digit hexadecimal values for web and React Native compatibility;
- shadows are structured arrays so each platform can adapt them without parsing CSS.

## TypeScript

```ts
import {
  color,
  semanticRadius,
  spacing,
  semanticColor,
  typography,
} from "@allfitone/tokens";

const nativeCard = {
  backgroundColor: semanticColor.dark.background.surface,
  borderRadius: semanticRadius.card,
  padding: spacing[4],
};
```

## CSS

```ts
import "@allfitone/tokens/css";
```

Dark is the default theme. Add `data-afo-theme="light"` to a containing element to switch semantic variables.

```css
.card {
  color: var(--afo-color-text-primary);
  background: var(--afo-color-background-surface);
  border-radius: var(--afo-radius-card);
  box-shadow: var(--afo-shadow-card);
}
```

## Typography

The package defines family names and metrics but does not bundle font files. Each product must load:

- Barlow Condensed: display and athletic editorial roles;
- Manrope: body, control, label, and data roles.

## Motion

Motion communicates continuity and response. It must not become ambient decoration. Use `semanticMotion` instead of choosing primitive durations directly, and honor reduced-motion preferences.
