---
"@allfitone/tokens": minor
"@allfitone/react-native": patch
---

Bring the glass material to the values the approved canvases use.

The fill was `#0B141DB8` and the canvas draws `#0B141DA8` — six per cent more
opaque than intended, which on a phone reads as a tinted block rather than as a
lit surface. The edge was a cyan-tinted `#86BEC829`; the canvas uses a neutral
`#F2FBFC2E`, and the tint was fighting the accent it sat beside. Blur moves from
20 to 26 for the same reason, and the React Native intensity is re-calibrated
against it.

Worth knowing before reaching for this: glass shows what is behind it, so over a
flat surface it will always look near-solid. It reads as glass when content passes
under it — a scrolling list, a photograph — and that is the situation it is for.
