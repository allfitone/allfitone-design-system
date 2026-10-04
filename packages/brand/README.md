# @allfitone/brand

Canonical Allfit One logo, wordmark, and lockup assets.

This is a foundational source package. Product applications should normally import `@allfitone/react/brand` or `@allfitone/react-native/brand` instead.

## React

```tsx
import {
  BrandLockup,
  BrandLogo,
  BrandWordmark,
  ProductLockup,
  ProductWordmark,
} from "@allfitone/brand/react";

<BrandLockup surface="dark" title="Allfit One" />
<BrandLogo variant="cyan" />
<BrandWordmark surface="light" title="Allfit One" />
<ProductWordmark product="studio" surface="dark" title="Allfit Studio" />
<ProductLockup product="backoffice" surface="light" title="Allfit Backoffice" />
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
// "assets/logo/allfit-one-logo-cyan.svg"

brandAssetFiles.favicon.ink;
// "assets/favicon/allfit-one-favicon-ink.svg"

brandAssetFiles.favicon.cyan;
// "assets/favicon/allfit-one-favicon-cyan.svg"

import.meta.resolve(brandAssetSpecifiers.logo.cyan);
// file:///.../@allfitone/brand/assets/logo/allfit-one-logo-cyan.svg
```

Use `favicon.ink` for the dark Allfit One application tile established by the
landing page, and `favicon.cyan` for the high-visibility cyan tile established
by the Design System Explorer. Both variants preserve their existing
proportions and are intended for browser metadata, manifests, bookmarks, and
install surfaces.

React Native applications should use the existing
`@allfitone/react-native/brand` adapter, which renders the canonical geometry
through `react-native-svg`; product applications must not build a competing
brand renderer.

Never redraw, stretch, recolor, or rearrange these assets in a consuming product.

## Product family

Space, Studio, and Backoffice temporarily reuse the exact Allfit One logo. Their product name is the only visual difference: `ALLFIT SPACE`, `ALLFIT STUDIO`, or `ALLFIT BACKOFFICE`.

Product descriptors are outlined vectors and do not require a font at runtime. Use `BrandLogo` when only the shared symbol is needed, and use `ProductWordmark` or `ProductLockup` when the product name must be explicit. Product-specific symbols are not part of the current canonical asset set.

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

## Social media and banner kit

`social/` holds ready-to-upload SVG and PNG images of the logo and lockup on
Design System tones, in the common profile, post, story, link-preview, and
banner sizes. See `social/README.md` for the formats and tones. The kit is
generated from the canonical geometry and token colors and is kept in the
repository rather than published to npm:

```bash
npm run generate:social --workspace @allfitone/brand
```
