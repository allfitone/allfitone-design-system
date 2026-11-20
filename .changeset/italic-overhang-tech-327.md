---
"@allfitone/react-native": patch
---

Italic roles such as `poster` pad their right edge by a share of the font size. A leaning face overhangs its own advance, and React Native clipped the overhang, so the last figure of a number like «86» lost its edge.
