---
"@allfitone/react-native": minor
---

A sheet rises over the keyboard instead of sitting under it.

A sheet is anchored to the bottom edge, which is exactly where the keyboard appears, so any sheet holding a field was covered by the thing it asked for: Space's exercise search left one result visible once the field took focus.

The panel now lifts by the keyboard's height and its cap shrinks by the same amount, so a tall sheet does not run off the top. The lift is a transform composed with the entrance rather than a second one beside it, and the home indicator is no longer reserved while the keyboard covers it. The content wrapper shrinks rather than overflowing the cap.

`resolveSheetGeometry` is exported from `@allfitone/react-native/sheet-geometry` so the arithmetic can be asserted outside Metro.
