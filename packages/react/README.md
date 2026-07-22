# @allfitone/react

React and Next.js adapters for the Allfit One foundations. Import explicit subpaths so applications only include the capabilities they use.

```tsx
import { BrandLockup } from "@allfitone/react/brand";
import { FoundationIcon } from "@allfitone/react/icons";
import { semanticColor } from "@allfitone/react/tokens";
import "@allfitone/react/tokens.css";
```

## Entry points

- `@allfitone/react/brand`: accessible SVG logo, wordmark, and lockup components.
- `@allfitone/react/icons`: semantic Lucide icon component and icon metadata.
- `@allfitone/react/tokens`: typed platform-neutral token values.
- `@allfitone/react/tokens.css`: generated Web token variables and theme selectors.

The package root contains platform metadata only. This prevents accidental broad component imports and keeps bundle analysis predictable.
