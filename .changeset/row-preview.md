---
"@allfitone/react-native": minor
---

`SelectableRow` carries a still preview, and becomes a row rather than a card.

A name is not enough to place a thing somebody has never seen — picking an exercise
from a list of four hundred is the case that forced it. The row owns the box, its
ground and its place in the row; what goes inside is the consumer's, because the
artwork is remote and animated and neither belongs in a component library.

Three things followed from putting a picture in it, and all three were measured on a
real screen rather than argued:

- **The mark rides on the picture.** A thumbnail small enough to sit beside an empty
  checkbox was too small to recognise anything in, and the two of them spent the row's
  leading edge twice. The badge is drawn only when the row is on, the way
  `SelectableTile` already reported selection; a row with no preview keeps the mark in
  its own column, because then nothing else would say the row can be chosen.
- **The card is gone.** Each row bordered, filled and rounded read as four hundred
  boxes instead of one list, and the frames took the attention the pictures were put
  there to get. A hairline separates one row from the next and nothing else does.
- **The name holds one line, in sentence case, in the control face.** Uppercase turns
  a real name into something to decode rather than read, and a name that wrapped while
  its neighbour did not gave every row a different height — which is what made a long
  list look broken. The condensed roles all track negative, which closes the counters
  at the size a row is read; `control` is the one face that is both heavy enough to
  lead a row and set at its natural width. It is wider, so the size is held at 16 —
  past that, most of a four hundred name catalogue reaches the ellipsis.
