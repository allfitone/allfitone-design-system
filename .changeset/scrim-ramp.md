---
"@allfitone/react-native": minor
---

`Scrim` gains `onset`, and ramps through two intermediate stops instead of going
straight from clear to opaque.

A linear fade reads as a band with an edge you can point at. Ramping the alpha
ahead of the geometry is what makes it read as light leaving the photograph,
which is what a scrim is for. `onset` lets a caller say where the image stops
being untouched; it defaults to where it always was.
