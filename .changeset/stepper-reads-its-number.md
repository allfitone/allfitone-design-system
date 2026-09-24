---
"@allfitone/react-native": minor
---

`Stepper` can say its number in words, and fill the row it leads.

A rest is counted in seconds and read in minutes. The control held both — `90` on
screen, `90` announced — and «90» is not what anybody calls a minute and a half. It
now takes a `format`, and what a screen reader says is what is drawn rather than the
raw figure underneath.

`caption` adds the quiet line under the value, for what the number is *of*, and
`grow` lets it lead a sheet instead of sitting at its own width. A formatted value
changes length as it counts — «1 min 30 s» one press, «45 s» the next — so when it
grows, the value takes what the two targets leave rather than a fixed width that one
of those readings would overflow.
