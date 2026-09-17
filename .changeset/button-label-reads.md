---
"@allfitone/react-native": minor
---

`Button`'s label moves to `control md`.

It was set two steps below the names it sits next to. On the routine editor the
exercise is drawn at 16 and «Añadir ejercicio» right underneath it at 14, which reads
as a smaller, lesser thing rather than as the action on the list above it — and a
button is not secondary to the rows it acts on.

`Badge` also holds its label to one line and may shrink. It exists for one or two
words scanned in a dense row; a wrapped badge turns the row it labels into two rows,
which is the layout bug it was introduced to avoid.
