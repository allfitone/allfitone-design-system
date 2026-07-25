# Brand and iconography

## Ownership

`@allfitone/brand` is the source of truth for the Allfit One logo, wordmark, and lockups. Canonical SVG exports live in `packages/brand/assets`; React renderers are generated from the same geometry in `packages/brand/src/react.tsx`.

`@allfitone/icons` owns the semantic icon vocabulary. Lucide owns the base geometry, while Allfit One owns which glyph represents each meaning, along with size and stroke rules.

## Consumption

Web React projects should render brand assets from `@allfitone/react/brand` and interface icons from `@allfitone/react/icons`. Physical SVG files remain available through the underlying brand package for metadata, favicons, and export pipelines.

React Native projects should consume `@allfitone/react-native/brand`, `@allfitone/react-native/icons`, and `@allfitone/react-native/tokens`. The adapter renders canonical geometry through `react-native-svg` and preserves the same semantic Lucide names used on Web.

## Distribution rule

Consumer repositories must install released package versions. They must not depend on sibling checkout paths such as `../allfitone-design-system`, because that breaks isolated CI and deployment environments.

Installed package files and synchronized public assets are generated consumer copies, not additional sources of truth. Never edit them directly.

## Repository-local adoption status

- The Design System Explorer consumes `@allfitone/react` through the workspace using the same public subpaths that npm consumers will install.
- The five public packages are available from npm at `0.1.0`. External products must install an exact released version rather than a sibling checkout or copied source.
- The Explorer documents a provisional Allfit OS mark, wordmark, and lockup for review. They are not canonical exports from `@allfitone/brand` yet.

Adoption inside Landing, Allfit OS, and Allfit Space must be tracked and verified in each product repository. This repository defines the consumer contract but must not claim that an external application has migrated without evidence from that application's current source.
