---
"@allfitone/tokens": minor
---

Add `2xs` (10px) to the type scale.

The scale stopped at 12px and the app's chrome does not. Tab labels, the badge on
a card and the smallest eyebrows are all drawn at 9 to 10px in the approved
canvases, and rendering them at 12 was visibly wrong on a phone: four tab labels
at 12px do not fit a floating bar without touching each other, and "Comida"
overflowed its own button.

It is the floor and it is chrome only. Below `xs` the scale stops being readable
as body text, so nothing narrative may use it — the docblock says so where the
value is, because a size token cannot enforce its own boundary.
