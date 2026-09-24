---
"@allfitone/react-native": minor
---

Add `Tabs`, the native counterpart of `@allfitone/react/tabs`: a strip of named views
with one active, marked by an accent line riding on the hairline under the labels.

It renders the labels and reports the press; the panel stays with the screen, so a
screen keeps deciding whether an unseen panel holds its scroll position and its
request. A tab carries a word and nothing else: a count beside the label reads as an
ordinal rather than a quantity.

`activeTabIndex` ships alongside as `./tab-selection`: a value matching no tab marks
nothing rather than falling back to the first, which would draw a strip that disagrees
with the panel below it.
