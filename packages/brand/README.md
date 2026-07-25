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
Standard `aria-label`, `aria-labelledby`, `aria-hidden`, `role`, and `focusable`
props are also honored when a host application needs to control the SVG
semantics directly.

## Other platforms

The package root exports colors, dimensions, package-relative asset paths,
resolvable asset specifiers, and platform-neutral types. Canonical SVG files
ship under `@allfitone/brand/assets/*`.

```js
import { brandAssetFiles, brandAssetSpecifiers } from "@allfitone/brand";

brandAssetFiles.logo.cyan;
// "assets/logo/allfit-one-logo-cyan.svg" — for package filesystem tooling

import.meta.resolve(brandAssetSpecifiers.logo.cyan);
// file:///.../@allfitone/brand/assets/logo/allfit-one-logo-cyan.svg
```

React Native applications should use the existing
`@allfitone/react-native/brand` adapter, which renders the canonical geometry
through `react-native-svg`; product applications must not build a competing
brand renderer.

Never redraw, stretch, recolor, or rearrange these assets in a consuming product.

For public files required by framework metadata or export tooling:

```bash
npx allfitone-brand-assets ./public/brand/allfit-one
```

The synchronized directory is generated output. Update it through the command
instead of editing individual SVG files. The command records the files it owns
in `.allfitone-brand-assets.json`; later runs remove obsolete managed assets
without deleting consumer-owned files in the same directory.

`npm run check` verifies that the manifest version, public paths, colors,
dimensions, geometry, layout transforms, and exported SVG files remain in
canonical parity.
