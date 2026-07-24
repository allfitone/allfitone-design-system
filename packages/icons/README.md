# @allfitone/icons

Shared semantic icon vocabulary for Allfit One products. Lucide supplies the base geometry; this package owns which icon represents each product meaning, plus the approved size and stroke scales.

This is a foundational source package. Product applications should normally import `@allfitone/react/icons` or `@allfitone/react-native/icons` instead.

```tsx
import { FoundationIcon } from "@allfitone/icons/react";

<FoundationIcon name="back" />
<FoundationIcon name="success" aria-label="Synced" />
```

## Rules

- Import semantic names such as `back`, `success`, or `activity`; do not choose a different glyph per product.
- Decorative icons remain hidden from assistive technology. Meaningful icon-only controls require an accessible name on the control.
- Use `md` and the default stroke for standard interface controls.
- Use `sm` with the compact stroke only in dense metadata.
- Do not use brand marks as interface icons.

React Native applications should consume `@allfitone/react-native/icons`. That adapter already maps this package's semantic catalog through `lucide-react-native`, so product applications must not create a second glyph mapping.
