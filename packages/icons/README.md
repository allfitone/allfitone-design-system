# @allfitone/icons

Shared semantic icon vocabulary for Allfit One products. Lucide supplies the base geometry; this package owns which icon represents each product meaning, plus the approved size and stroke scales.

This is a foundational source package. Product applications should normally import `@allfitone/react/icons` or `@allfitone/react-native/icons` instead.

```tsx
import { BackIcon, FoundationIcon } from "@allfitone/icons/react";

// Prefer a static semantic export when the icon is known at build time.
<BackIcon decorative />

// Keep FoundationIcon for data-driven or dynamic semantic names.
<FoundationIcon name="back" decorative />
<FoundationIcon name="success" aria-label="Synced" />
<FoundationIcon name="success" aria-labelledby="sync-status" />
```

## Rules

- Import semantic names such as `back`, `success`, or `activity`; do not choose a different glyph per product.
- Decorative icons remain hidden from assistive technology. Meaningful icon-only controls require an accessible name on the control.
- Use `md` and the default stroke for standard interface controls.
- Use `sm` with the compact stroke only in dense metadata.
- Use `strokeScale="compact"` or `strokeScale="display"` instead of passing raw Lucide stroke widths.
- Exceptional dimensions must use `customSize` and `customStrokeWidth`; both reject zero, negative, and non-finite values.
- Do not use brand marks as interface icons.

```tsx
<BackIcon size="sm" strokeScale="compact" decorative />
<FoundationIcon
  name="activity"
  customSize={18}
  customStrokeWidth={1.25}
  decorative
/>
```

React Native applications should consume `@allfitone/react-native/icons`. That adapter already maps this package's semantic catalog through `lucide-react-native`, so product applications must not create a second glyph mapping.
