---
"@allfitone/react-native": minor
---

`SegmentedControl` picks one of a few views, drawn as one track.

It is not `Tabs`. Tabs partition a subject that stays on screen: the labels sit on a
hairline and a mark rides under the active one, which is right when the panel below is
the page. This is a control — it sits inside a sheet or above a grid, it is small, and
what it changes is the thing directly under it.

`Tabs` warns that drawing tabs as pills promises multi-selection. That is true of
separate pills, which is what `Chip` already is. A segmented control is not separate
pills: the segments share one track with no gaps, and that containment is what says
«one of these». The segments are equal width so the control does not resize when the
words change.
