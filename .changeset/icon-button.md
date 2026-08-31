---
"@allfitone/react-native": minor
---

`IconButton` — a round action carried by a glyph alone.

Three screens had each drawn their own circle for closing, going back and opening
notifications, which is three sizes, three borders and three hit areas of the same
control. It resolves to the platform touch target rather than to whatever a canvas
happened to draw, and `accessibilityLabel` is required with no way to opt out: an
icon-only control says nothing to a screen reader without one, and
`docs/ACCESSIBILITY.md` makes that a launch condition.
