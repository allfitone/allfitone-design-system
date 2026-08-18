---
"@allfitone/react-native": minor
---

Add `Sheet`, a panel that rises from the bottom edge, on the
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
