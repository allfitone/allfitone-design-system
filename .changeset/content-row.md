---
"@allfitone/react-native": minor
---

`ContentRow` is the row of a library: it reports a thing instead of choosing it.

`SelectableRow` carries `selected` and answers as a checkbox, which is right for a list
somebody is picking from and wrong for the person's own routines and programmes. Bending
it would mean a required `selected` that is always false — a lie the screen reader
repeats on every row.

Three lines, and the third is the one worth having: `note` states where the thing lives
—«En Fuerza básica», «Sin programa»— in the accent, so it reads as a link between two
things rather than more description. Its `quiet` tone is for the absence of that fact,
which is still worth saying and is not an alarm.

`trailing` is the difference between reading and acting. A chevron says the row opens;
an action is a second target inside it and takes its own label, because «más opciones»
on nine identical rows tells a screen reader nothing.
