---
"@allfitone/react": minor
---

Make `app.css` deliver the browser reset it documents, without overriding the components.

Tailwind is imported as `theme.css` and `utilities.css` only, so Preflight never lands and every heading, paragraph and list kept its user-agent margins. Those margins do not collapse inside flex or grid, so they added to whatever `gap` a component declared: a dialog's designed 10px title-to-description gap measured 41px. Consuming applications had been resetting it by hand.

The reset sits in a new `afo-base` layer, and `styles.css` pins the layer order below `utilities`. Unlayered it would have flattened the spacing components set on themselves — `AccessPanelDescription` declares `mt-5` and rendered at 0.

`button`, `input`, `select` and `textarea` now take `font-family`, `font-size` and `line-height` from the page instead of the `font` shorthand. The shorthand also reset `font-weight`, and being unlayered it beat the `font-extrabold` in the button's own base class: every real button rendered at the body weight, while a link styled with `buttonVariants()` kept 800 because the selector never matched an anchor.

`Button` now specifies `font-normal`, which is what applications have rendered all along. Buttons themselves are unchanged; a link styled as a button stops being heavier than the buttons beside it.
