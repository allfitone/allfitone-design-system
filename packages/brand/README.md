# @allfitone/brand

Canonical Allfit One logo, wordmark, and lockup assets.

This is a foundational source package. Product applications should normally import `@allfitone/react/brand` or `@allfitone/react-native/brand` instead.

## React

```tsx
import { BrandLockup, BrandLogo, BrandLogoCarrier, BrandWordmark } from "@allfitone/brand/react";

<BrandLockup surface="dark" title="Allfit One" />
<BrandLogo variant="cyan" />
<BrandLogoCarrier title="Allfit One" />
<BrandWordmark surface="light" title="Allfit One" />
```

Omit `title` only when the asset is decorative and the surrounding control already has an accessible name.

## Other platforms

The package root exports colors, dimensions, asset paths, and platform-neutral types. Canonical SVG files ship under `@allfitone/brand/assets/*`; React Native projects can consume them through the project's approved SVG transformer or build a native adapter from the exported geometry.

Never redraw, stretch, recolor, or rearrange these assets in a consuming product.

For public files required by framework metadata or export tooling:

```bash
npx allfitone-brand-assets ./public/brand/allfit-one
```

The synchronized directory is generated output. Update it through the command instead of editing individual SVG files.
