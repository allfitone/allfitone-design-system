---
"@allfitone/react-native": minor
---

Add `CodeField`, segmented entry for a short numeric code, on the
`@allfitone/react-native/code-field` subpath.

The boxes are drawn beneath a single transparent input rather than one input per
digit: a field per digit has to simulate backspace across fields, only one of
them receives the platform's one-time-code autofill, and a screen reader is left
with six unlabelled inputs instead of one.

The component sets no `returnKeyType` and does not accept one, because the iOS
number pad has no return key and requesting one makes the platform float a loose
button over the layout.
