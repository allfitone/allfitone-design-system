---
"@allfitone/react-native": minor
---

`Button` has a compact size, for actions that sit beside content rather than lead it.

A toolbar under a table is not the confirm of a screen, and drawing it at the same
weight makes the table look like the smaller thing. `size="sm"` is 36 points with the
label at `control sm` and tighter insets.

`IconButton` takes the same size, at the same 36 points, so a glyph and a word sit
level in one row instead of one of them being the tallest thing in it.

They give up height, never reach. `hitSlop` restores the 44 the visual no longer has,
which is the line `ACCESSIBILITY.md` draws: the target is measured on what the finger
can hit, not on what the eye can see.
