---
"@allfitone/react-native": patch
---

Size every brand mark from its artwork when only one dimension is given.

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
