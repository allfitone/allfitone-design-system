---
"@allfitone/icons": minor
"@allfitone/react-native": minor
---

Add `Chip` and `Stepper` to the React Native adapter, and four icons.

`Chip` is the pill a filter row and an option sheet are both made of: a word, a
selected state carried by the accent, and a target big enough to hit while walking.
`Stepper` is a small whole number adjusted by one, with the bounds disabling the
targets rather than clamping silently — a `+` that keeps answering the same number
reads as broken.

New icons: `rest` (Moon), `locked` (Lock), `explore` (Compass) and `subtract`
(Minus). `subtract` exists because `remove` is a trash can: it deletes a thing,
while a stepper takes one away from a number. Those are different acts and a
stepper drawn with a trash can invites somebody to delete the programme.
