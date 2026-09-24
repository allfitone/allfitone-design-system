---
"@allfitone/tokens": minor
"@allfitone/react-native": patch
---

`withAlpha` and `transparent` restate a token colour at a different opacity.

A fade has two ends, and the one that is "not there" still has a colour. Reaching
for the keyword `transparent` makes it transparent *black*, so the ramp travels
through a darkness that is in no palette — a dirty band over imagery, and a colour
nobody chose in the middle of an animation. `Scrim` already worked around this by
appending `00` by hand; now there is one named way to do it, and it refuses
anything that is not a token colour rather than producing a plausible wrong one.
