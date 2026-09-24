---
"@allfitone/react-native": minor
---

`Badge` takes the palette's identity tones, and will tell you what colour it painted.

Six things that differ need six colours, and none of them means anything is wrong. The
palette already draws that line for disciplines — its own comment calls them «identity
rather than status» — so a badge distinguishing one superset from another reaches for
the same six instead of borrowing `warning` and `danger`, which on the very same screen
already mean a warm-up and a set taken to failure.

`badgeToneColor` exists because a badge is not always the only thing wearing the
colour: a rule down the edge of the rows it labels has to match it, and the only
alternative was letting the consumer pass a hex, which is the door this component was
built to keep shut. `identityTone(index)` hands the six out in order.
