# Platform packages

Allfit One separates shared design decisions from platform rendering. The React and React Native packages expose parallel public APIs while consuming the same canonical tokens, brand geometry, and semantic icon catalog.

## Package topology

| Layer | Package | Responsibility |
| --- | --- | --- |
| Foundation | `@allfitone/tokens` | Platform-neutral values, CSS generation, and JSON output |
| Foundation | `@allfitone/brand` | Canonical SVG assets, geometry, colors, and low-level renderers |
| Foundation | `@allfitone/icons` | Semantic icon names, source glyphs, sizes, and stroke rules |
| Platform | `@allfitone/react` | React/Next.js brand, icons, typed tokens, generated CSS, and Base UI components |
| Platform | `@allfitone/react-native` | Native SVG brand, native Lucide icons, typed tokens, and platform helpers |

Product applications depend on one platform package. Tooling and the platform packages may depend on foundation packages directly.

## React and Next.js

```tsx
import { BrandLockup } from "@allfitone/react/brand";
import { FoundationIcon } from "@allfitone/react/icons";
import { semanticColor } from "@allfitone/react/tokens";
import "@allfitone/react/tokens.css";
import "@allfitone/react/styles.css";
import { Button } from "@allfitone/react/components/button";
```

Rules:

- Use explicit subpaths; the root export contains metadata only.
- Import token CSS and component CSS once at the application root, in that order.
- Import each component from its explicit `/components/{name}` subpath; do not add an all-components barrel.
- Components render standard accessible SVG and remain compatible with React Server Components unless a consumer adds client behavior.
- SVG geometry is static module data; it is not recreated during rendering.
- The package must remain side-effect free except for `tokens.css` and `styles.css`.

## React Native

```tsx
import { BrandLockup } from "@allfitone/react-native/brand";
import { FoundationIcon } from "@allfitone/react-native/icons";
import { getNativeTheme, getNativeTouchTarget } from "@allfitone/react-native/tokens";

const theme = getNativeTheme("dark");

<BrandLockup surface="dark" accessibilityLabel="Allfit One" />;
<FoundationIcon name="activity" color={theme.icon.primary} decorative />;
```

Rules:

- Install compatible `react-native-svg` native code in the consuming application.
- Expo applications use `npx expo install react-native-svg` so Expo selects the compatible native version.
- Brand components use canonical geometry rather than copied SVG strings.
- Icons use the same semantic names as Web and require an explicit color token.
- Native letter spacing is derived by multiplying the unitless token by the active font size.
- Touch targets resolve to `44pt` on iOS and `48dp` on Android.
- Meaningful brand images require `accessibilityLabel`; decorative images and icons remain outside the accessibility tree.

## Export parity

| Capability | React | React Native |
| --- | --- | --- |
| Logo, wordmark, lockup | `/brand` | `/brand` |
| Semantic icons | `/icons` | `/icons` |
| Typed tokens | `/tokens` | `/tokens` |
| Theme values | `/tokens` | `/tokens` |
| CSS variables | `/tokens.css` | Not applicable |
| Web component styles | `/styles.css` | Not applicable |
| Web components | `/components/{name}` | Not applicable |
| Native touch-target helper | Not applicable | `/tokens` |
| Native letter-spacing helper | Not applicable | `/tokens` |

New semantic components should use matching export names and prop meaning across platforms. Platform-specific props may differ when the underlying accessibility or rendering API differs.

## Version and release contract

- The first public release was `0.1.0`.
- Public packages follow independent semantic versions. A change to one package does not publish untouched packages.
- Every public package exports its own package-manifest version through `designSystemVersion`.
- `@allfitone/tokens` additionally exposes the Tokens package version in `tokenBundle.meta.version`, generated `tokens.json`, and `--afo-design-system-version`.
- Every `0.x.y` release is a Design System beta. The first official Design
  System release will be `1.0.0`, after both products have been validated in
  market.
- The Explorer communicates only the shared maturity major (`v0` during beta);
  it does not expose package-local minor or patch versions in the interface.
- Release foundation packages before platform packages.
- Platform packages declare compatible foundation ranges as runtime dependencies and React/platform runtimes as peer dependencies where appropriate.
- A compatible foundation patch does not force an adapter release. Changesets bumps a dependent adapter only when its internal range must change.
- A platform package release must pass TypeScript, its output validator, package dry-run inspection, and at least one consumer build.

Recommended publish order:

1. `@allfitone/tokens`
2. `@allfitone/brand`
3. `@allfitone/icons`
4. `@allfitone/react`
5. `@allfitone/react-native`

## Consumer policy

- Allfit OS and the landing should install an exact released `@allfitone/react` version when they adopt the Design System.
- Allfit Space installs `@allfitone/react-native` when its application scaffold is created.
- Do not use sibling filesystem dependencies in product repositories.
- Do not copy source components into product repositories.
- Consumer overrides may compose layout and behavior but must not redefine primitive tokens, brand geometry, or semantic icon meaning.
