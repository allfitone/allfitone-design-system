---
"@allfitone/react-native": minor
---

Add `Checkbox`, a statement the person affirms, on the
`@allfitone/react-native/checkbox` subpath.

The role is `checkbox` rather than `switch`, deliberately. A switch announces
"on/off" and promises an effect the moment it moves, while these affirmations
land when the form is submitted — so a switch would move and do nothing. An
affirmation is also an act rather than a preference, and preferences are the
things people flip without reading. What was rejected is the platform checkbox's
appearance, not its semantics: the mark fills with the accent colour, which Ink &
Signal already reserves for selection, so an affirmed statement reads the same
way a filled `CodeField` box does.

The label is required and always drawn, because a mark without the sentence it
affirms means nothing, and the sentence is the part a copy review has to see. It
doubles as the accessible name. The mark keeps a constant border width for the
reason `TextField` documents, and stays aligned to the first line so a statement
that wraps does not push it out of place.
