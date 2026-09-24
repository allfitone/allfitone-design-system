---
"@allfitone/react-native": patch
---

Touching nothing in particular puts the keyboard away.

A `ScrollView` can be told to do this for the part of a screen it covers, but a screen is
rarely only a scroll view. A form under a header that stays put left the keyboard up with
no way to dismiss it but the return key — which a name field does not have. It belongs in
`Screen` for the same reason the top inset does: it is every screen's complaint, not one
screen's.

It observes the touch rather than claiming it. `onStartShouldSetResponder` runs bottom-up
and stops at whatever answers `true`, so a field, a button or a row being dragged is asked
first and this is never reached. Answering `false` means it never becomes the responder
either: nothing is intercepted, no gesture is blocked, and no control is added to the
accessibility tree.
