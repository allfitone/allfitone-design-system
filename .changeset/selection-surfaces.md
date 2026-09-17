---
"@allfitone/react-native": minor
---

Three controls for choosing from a set: `SelectableRow`, `SelectableTile` and `DisclosureButton`.

`Chip` is a word and `Checkbox` is the affirmation of a sentence, drawn in body text. Neither fits a thing being chosen from a list of things, which needs a name and a line describing it, or a thing recognised by sight before it is read.

- **`SelectableRow`** — a mark, a name and an optional caption. The whole row is the target, because a 22 pt mark is under what DT-010 asks for and shrinking the reach to it would make the name decoration.
- **`SelectableTile`** — a picture, a name and a count. The picture is `children`: the library knows nothing about a product's assets and must not learn, so there is no `source` prop and no path convention imposed on the consumer. The count renders in the `data` role, so a grid does not jitter as its numbers change. The picture runs to the tile's own edges: a smaller one floating inside read as a photograph cut out and pasted on, two rounded rectangles with the artwork's ground visible as a second surface. A tile given no picture is shorter rather than empty, because keeping the height draws a void with a word at the bottom of it — and a grid where some things have artwork and some do not should read as incomplete, not as broken. The name is sentence case in the control role and the count is not bold: a number that shouts as loud as the thing it counts is a number nobody reads past.
- **`DisclosureButton`** — a label, the value it is currently set to, and a tap that opens the screen that sets it. The value is part of the control and its accessible value, so nobody has to open it to find out what it is doing.

All three carry `checkbox` or `button` semantics honestly: several `SelectableRow` or `SelectableTile` can be on at once and nothing lands until the set is applied, while `DisclosureButton` chooses nothing and only navigates.
