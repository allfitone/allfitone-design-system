---
"@allfitone/react-native": minor
---

`Badge` states what kind of thing a row is.

A set can be a warm-up, a working set, one taken to failure or a drop set, and four
words in a dense table have to be told apart before they are read. That is a fact
about the row, not a choice offered on it, which is why this is not `Chip`: a chip
is pressed to decide something and stays on; a badge reports, and pressing it — when
it is pressed at all — opens where the fact is set.

Two things are deliberately closed:

- **No colour input.** The tone is a semantic slot from the palette and nothing else,
  so `DT-009`'s rule that colour carries meaning survives contact with a component
  whose whole job is to be colourful. The build fails on a hex literal in the file.
- **The ink comes from `status.onStatus`.** Picking white or black by hand reads fine
  in the theme it was written in and fails in the other one.

It is the one place caps belong, in the `eyebrow` role: one or two words scanned at a
glance, which is the opposite of the names the library just moved out of uppercase.
