---
"@allfitone/react-native": minor
---

Add the themed primitives React Native surfaces need to compose a screen without
reaching for raw tokens: font loading, a theme context, `Text`, `Button`,
`Screen`, `SignalBlock`, `Scrim`, `GlassPanel` and `BrandEntrance`.

Font loading moves into the design system. The token package names Barlow
Condensed and Manrope but ships no font files, and React Native falls back to the
platform font **silently** when a family was never registered — the whole visual
identity switches off without an error. Leaving that to each product also allowed
two surfaces to load different weights of the same family.

Roles that lead tighter than their own em box now pad the deficit back. `display`
leads at 0.82, which the web lets overflow the line box; React Native crops the
glyph to it instead and cut the tops off capitals. The padding restores the
ascender without loosening the spacing between lines.

`BrandEntrance` exists because clipping the fill needs the logo geometry, and the
foundations keep products out of `@allfitone/brand`. Built in a product it could
only clip to a rectangle, and the fill edge ran past the silhouette.

`GlassPanel` is the first consumer of the `material` tokens. Note that
`docs/FOUNDATIONS.md` reserves glass for floating chrome; the component does not
enforce that, because the boundary is a live product decision.

New peer dependencies: `expo-font`, `expo-linear-gradient`, `expo-blur` and
`react-native-safe-area-context`. The two Google Fonts packages are direct
dependencies because they carry only assets.

`Text` omits the underlying React Native `role` prop. Its value set intersects
the typographic roles at exactly `"heading"`, which silently narrowed every other
role away. `accessibilityRole` is unaffected.
