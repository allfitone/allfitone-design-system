---
"@allfitone/react-native": minor
---

`CoverTile` is the square a thing shows itself in, including when it has nothing.

`Monogram` is the letter a routine falls back to; this is the place that letter, a
picture or a drawing all sit in, so a list keeps the same shape whatever each row
happens to have. A row with artwork and a row without stay the same row.

The picture is `children` and it bleeds to the tile's own edges, for the reason
`SelectableTile` already gives: the Design System knows nothing about a product's
assets and must not learn one. A `source` prop would mean either bundling images into
the library or inventing a path convention for whoever consumes it.

Empty is drawn rather than left blank. A tile with nothing in it is an invitation —
this is where a cover would go — so it keeps its outline and dims it instead of
collapsing and leaving the row ragged. That is the opposite call from `SelectableTile`,
which shortens without a picture: there the height exists to hold a photograph, and
here the square is the component.

It is pressable only when given something to do. Without `onPress` it is a picture and
is announced as nothing at all, because the name it stands for is always drawn beside
it.
