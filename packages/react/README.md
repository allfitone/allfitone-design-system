# @allfitone/react

React and Next.js adapters for the Allfit One foundations. Import explicit subpaths so applications only include the capabilities they use.

```tsx
import { BrandLockup } from "@allfitone/react/brand";
import { FoundationIcon } from "@allfitone/react/icons";
import { semanticColor } from "@allfitone/react/tokens";
import "@allfitone/react/tokens.css";
import "@allfitone/react/styles.css";

import { Button } from "@allfitone/react/components/button";
import { Dialog } from "@allfitone/react/components/dialog";
```

## Entry points

- `@allfitone/react/brand`: accessible SVG logo, wordmark, and lockup components.
- `@allfitone/react/icons`: semantic Lucide icon component and icon metadata.
- `@allfitone/react/tokens`: typed platform-neutral token values.
- `@allfitone/react/tokens.css`: generated Web token variables and theme selectors.
- `@allfitone/react/styles.css`: compiled Tailwind 4 component utilities and the ALLFIT ONE shadcn bridge.
- `@allfitone/react/components/*`: explicit component subpaths; there is no all-components barrel.
- `@allfitone/react/lib/utils`: public `cn` class-composition utility.

The package root contains platform metadata only. This prevents accidental broad component imports and keeps bundle analysis predictable.

## Component contract

The component API follows shadcn composition on Base UI while its visual variants, tokens, target sizes, focus treatment, and accessibility defaults belong to ALLFIT ONE. Import CSS once at the application root, place `tokens.css` before `styles.css`, and change themes with `data-afo-theme="dark|light"` on the document element.

Available public component subpaths are `alert-dialog`, `badge`, `button`, `card`, `checkbox`, `dialog`, `empty`, `field`, `icon-button`, `input`, `label`, `radio-group`, `select`, `sheet`, `skeleton`, `sonner`, `spinner`, `switch`, `tabs`, `textarea`, and `tooltip`. `separator` is also public because it is a compositional dependency of `Field`.

Loading actions compose a named `Spinner` inside a disabled `Button`; components do not expose an `isLoading` prop. Icon-only actions use `IconButton`, whose TypeScript contract requires `aria-label`.
