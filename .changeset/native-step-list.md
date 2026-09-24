---
"@allfitone/react-native": minor
---

Add `StepList`: an ordered set of instructions, each numbered in a marker of its own.

The marker is deliberately not a chip. A chip on the same screen is pressable and says
so with an accent border; a marker carries the accent only on the numeral and keeps a
subtle border, so a sequence is never mistaken for a set of controls.

It owns the alignment, which is what a product kept getting wrong by hand: the numeral
is set in the condensed face and leads tighter than the body text beside it, so the row
stays top-aligned and the text drops by half the difference. Centring the row instead
drifts the marker into the middle of a three-line step, where nothing begins.
