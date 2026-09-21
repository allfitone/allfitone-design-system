---
"@allfitone/icons": minor
"@allfitone/react-native": minor
---

A card can be turned over.

`flip` joins the icon catalogue: circling arrows for a control that shows the other
side of something. Lucide has no two-sided glyph, so `RefreshCw` carries it, matching
what the canvas draws with Phosphor's `arrows-clockwise`.

`IconButton` gains `shape`. A control laid over content — the corner of a card, over a
photograph — reads as part of that card when it shares its corner radius and as a
floating bubble when it does not. `round` stays the default, and neither the size nor
the touch reach changes with the shape.
