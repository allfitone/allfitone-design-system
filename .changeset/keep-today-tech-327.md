---
"@allfitone/react-native": minor
---

Adds three components and four variants so Space can use the design system without changing how its screens look:

- `OfferRow`: a way out offered in a row, with three grounds: `deep`, `quiet` and `muted`.
- `StatTile`: a figure somebody picks to edit. The `stack` layout puts it under a visual; the `inline` layout puts its glyph beside it.
- `ProgressRing`: a share drawn as a ring in a tone.
- `Note outlined`: a note with an outline instead of the muted ground. Its mark is 16 at either size.
- `IconButton size="xs"`: the glyph alone; all of its touch target comes from slop.
- `Button variant="outlineDanger"`: the red label inside the subtle outline.
- In `ContentRow`, the tag beside the name never shrinks, so the name gives way first.

Further options, so Space keeps how more of its screens look:

- `OfferRow tone="tonal"`: the accent's tonal ground and edge with a bare mark, for something kept behind a plan.
- `OfferRow tone="action"`: an entry of a sheet's menu. `danger` paints the destructive entry red.
- `Badge variant="outline"`: only the edge and the word in the tone. `icon` sets a glyph before the word.
- `Chip variant="bare"`: no ground or edge until it is chosen, for a grid of many such as months.
- In `ContentRow`:
  - `size="sm"` sets the name a step down and the picture at 40.
  - `tone="outlined"` draws the row as a bordered box, with the name in body weight.
  - `captionTone="danger"` sets the caption in red.
  - `valueTone` and `valueFace="data"` set the value as plain data.
  - `iconShape="round"` puts the glyph on a disc.
  - A chevron trailing can end in the `forward` arrow.
- `DisclosureButton variant="select"`: a small label over the value, with a chevron down.
- `InlineAlert iconSize="md"`: the larger mark, for a panel that stands alone.
- `Note align="center"`.

The compact `IconButton` now lends six points of slop instead of four, so it reaches 48 on Android.
