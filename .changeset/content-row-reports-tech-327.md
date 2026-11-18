---
"@allfitone/react-native": minor
---

`ContentRow` can now only report. Without `onPress` it is not a target: it draws no chevron or inner action, and a screen reader reads it as text. It also gains `value`, the row's figure before the trailing, small by default with `valueSize` (`sm`, `md`, `lg`); a `badge` trailing that draws a `Badge`; a `none` trailing; and `iconTone="quiet"`, the secondary ink on the muted tile. Rows that open keep their look.

`Badge` gains the `tonal` variant, which tints its ground with the tone and inks the word in it, as the web status badges do. It also gains `uppercase`, which defaults to on except for `quiet`, and `dot`, a dot in the tone before the word. The `solid` and `quiet` defaults do not change.
