# Brand and iconography

## Ownership

`@allfitone/brand` is the source of truth for the Allfit One master identity and the Allfit Space, Studio, and Backoffice product wordmarks and lockups. The product architecture is temporarily endorsed by the master brand: all three products reuse the exact Allfit One logo, and only the wordmark changes. Canonical SVG exports live in `packages/brand/assets`; React renderers use the same geometry in `packages/brand/src/react.tsx`, and package validation enforces parity between both representations.

`@allfitone/icons` owns the semantic icon vocabulary. Lucide owns the base geometry, while Allfit One owns which glyph represents each meaning, along with size and stroke rules.

Static interfaces should prefer named semantic exports such as `BackIcon` or
`SuccessIcon` so unused glyphs remain tree-shakeable. `FoundationIcon` remains
the dynamic renderer for catalogs and data-driven icon names. Both renderers
resolve through the same `iconCatalog` source mapping.

## Third-party marks

A third-party mark is someone else's identity, not part of the Allfit icon vocabulary. `@allfitone/react-native/third-party` ships Instagram's glyph so a product can share to Instagram with the mark people recognise. Its geometry comes from Simple Icons under CC0-1.0, sourced from Meta's brand resources (https://about.meta.com/brand/resources/instagram). Meta's brand guidelines govern it: shown in white, black or Instagram's gradient, never recoloured into the Allfit palette and never redrawn. Allfit's own icons stay in `@allfitone/icons`.

## Consumption

Web React projects should render brand assets from `@allfitone/react/brand` and interface icons from `@allfitone/react/icons`. Physical SVG files remain available through the underlying brand package for metadata, favicons, and export pipelines.

The canonical favicon set has two semantic variants: `ink` (ink tile with cyan
symbol, established by the landing page) and `cyan` (cyan tile with ink symbol,
established by the Design System Explorer). Consumers must use these packaged
assets instead of adapting the logo or maintaining local redraws.

Marketing surfaces take the generated kit in `packages/brand/social`: the logo and lockup on Design System tones, exported as SVG and PNG in the common social profile, post, story, link-preview, and banner sizes. The kit is derived from the canonical geometry and token colors, is validated by `npm run check`, and is not published to npm.

React Native projects should consume `@allfitone/react-native/brand`, `@allfitone/react-native/icons`, and `@allfitone/react-native/tokens`. The adapter renders canonical geometry through `react-native-svg` and preserves the same semantic Lucide names used on Web.

Food icons (`egg`, `dairy`, `grain`, `fruit`, `coffee`… 32 in all) name a food group, not a dish: a product shows the group it belongs to, so the catalogue stays a closed set that products can map to. They come from Lucide like the rest; `cheese` uses `Torus` because Lucide has no cheese glyph.

## Distribution rule

Consumer repositories must install released package versions. They must not depend on sibling checkout paths such as `../allfitone-design-system`, because that breaks isolated CI and deployment environments.

Installed package files and synchronized public assets are generated consumer copies, not additional sources of truth. Never edit them directly.

## Repository-local adoption status

- The Design System Explorer consumes `@allfitone/react` through the workspace using the same public subpaths that npm consumers will install.
- The five public packages are available from npm at `0.1.0`. External products must install an exact released version rather than a sibling checkout or copied source.
- The Explorer documents the temporary Space, Studio, and Backoffice product family. Each product uses the exact Allfit One logo and is distinguished only by its outlined product wordmark; no product-specific symbol is currently canonical.

Adoption inside Landing, Allfit Studio, Allfit Backoffice, and Allfit Space must be tracked and verified in each product repository. This repository defines the consumer contract but must not claim that an external application has migrated without evidence from that application's current source.
