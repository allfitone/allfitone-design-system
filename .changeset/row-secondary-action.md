---
"@allfitone/react-native": minor
---

`SelectableRow` can carry a secondary action.

Picking a thing and reading about it are different intents, and a row that did both on one tap would do the wrong one half the time. `action` renders its own 44 pt target at the trailing edge — DT-010 measures what the finger can hit, not the glyph — with its own accessible name, while the row keeps its own.

Nothing is nested: a `checkbox` containing a second, unnamed control leaves a screen reader announcing one thing and doing another.
