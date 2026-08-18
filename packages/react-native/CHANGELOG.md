# @allfitone/react-native

## 0.6.0

### Minor Changes

- 96449c1: Add `Checkbox`, a statement the person affirms, on the
  `@allfitone/react-native/checkbox` subpath.

  The role is `checkbox` rather than `switch`, deliberately. A switch announces
  "on/off" and promises an effect the moment it moves, while these affirmations
  land when the form is submitted — so a switch would move and do nothing. An
  affirmation is also an act rather than a preference, and preferences are the
  things people flip without reading. What was rejected is the platform checkbox's
  appearance, not its semantics: the mark fills with the accent colour, which Ink &
  Signal already reserves for selection, so an affirmed statement reads the same
  way a filled `CodeField` box does.

  The label is required and always drawn, because a mark without the sentence it
  affirms means nothing, and the sentence is the part a copy review has to see. It
  doubles as the accessible name. The mark keeps a constant border width for the
  reason `TextField` documents, and stays aligned to the first line so a statement
  that wraps does not push it out of place.

- 96449c1: Add `Sheet`, a panel that rises from the bottom edge, on the
  `@allfitone/react-native/sheet` subpath.

  Ported from the Web `Sheet`. The decisions carry over — anchored to the bottom,
  capped at 85% of the viewport, rounded on the leading corners only, over a dimmed
  backdrop — while the compound `Sheet/SheetContent/SheetHeader` API does not:
  React Native has no portal to compose against, and every native component in this
  package is a single one with props. Bottom only, because the Web variant's side
  panels suit a desktop pane and nothing on a phone.

  It exists for the exchanges that are not screens: a confirmation with nothing to
  do next, or a short form that must not lose the screen behind it. Routing those
  forces a destination the flow already had.

  Motion reads the semantic tokens and honours reduced motion, which defines a step
  at zero duration — a panel that slides anyway is what that setting exists to
  prevent. The backdrop and the Android back gesture both dismiss, so a sheet that
  carries a decision owns confirming it.

## 0.5.1

### Patch Changes

- Updated dependencies [36f5bf4]
  - @allfitone/brand@0.3.0

## 0.5.0

### Minor Changes

- c8afb63: Add `CodeField`, segmented entry for a short numeric code, on the
  `@allfitone/react-native/code-field` subpath.

  The boxes are drawn beneath a single transparent input rather than one input per
  digit: a field per digit has to simulate backspace across fields, only one of
  them receives the platform's one-time-code autofill, and a screen reader is left
  with six unlabelled inputs instead of one.

  The component sets no `returnKeyType` and does not accept one, because the iOS
  number pad has no return key and requesting one makes the platform float a loose
  button over the layout.

### Patch Changes

- 3c98648: Size every brand mark from its artwork when only one dimension is given.

  `BrandLogo`, `BrandLogoCarrier`, `BrandWordmark`, `BrandLockup`,
  `ProductWordmark` and `ProductLockup` each carried an independent default for
  `width` and `height`. Passing only one left the other at a default sized for a
  different scale, so the box came out a different shape from the `viewBox`. SVG
  does not stretch to fill it — the default `preserveAspectRatio` fits the art
  inside and centres it, so the mark rendered at the correct size but inset by half
  the slack, and stopped lining up with the text beside it.

  Nothing looked broken, which is why it survived review: the mark was never
  squashed, only nudged. Found by eye on a welcome screen where `height` alone was
  set.

## 0.4.0

### Minor Changes

- 2fc1c5d: Add the themed primitives React Native surfaces need to compose a screen without
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

### Patch Changes

- Updated dependencies [3bbaac1]
  - @allfitone/tokens@0.2.0

## 0.3.0

### Minor Changes

- 760c84e: Add outlined Allfit Space, Studio, and Backoffice wordmarks plus Web, React Native, and static SVG lockups that temporarily reuse the exact canonical Allfit One logo.

### Patch Changes

- Updated dependencies [760c84e]
  - @allfitone/brand@0.2.0

## 0.2.0

### Minor Changes

- abfe0f7: Make the semantic icon catalog authoritative across Web and Native, honor
  standard ARIA labelling, add tree-shakeable semantic React exports, and replace
  implicit numeric size and stroke overrides with validated explicit escape
  hatches.

### Patch Changes

- Updated dependencies [abfe0f7]
  - @allfitone/icons@0.2.0

## 0.1.1

### Patch Changes

- 4f7e001: Allow the platform adapters to consume compatible foundation package patches while npm versions, Git tags, and GitHub Releases are managed independently per package.
