---
"@allfitone/react-native": minor
---

`Button` accepts an `icon`.

Actions whose meaning is carried by a glyph as well as a word had no way to say so,
so a product hand-rolled a `Pressable` to get one — and with it a different
typography: Barlow Condensed at the display role, whose −0.055em tracking made the
label read visibly cramped beside every real button in the app. The component is
what decides how an action looks, and the way to keep that true is for it to cover
the case rather than for the case to go around it.

The icon is always decorative. The label already names the action, and announcing
both would make every button read twice to a screen reader.
