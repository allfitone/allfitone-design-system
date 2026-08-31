---
"@allfitone/react-native": patch
---

`Sheet` now actually animates out, and slides its own height rather than the
screen's.

`visible` was handed straight to `Modal`, so dismissing unmounted the tree on the
same frame and the exit animation never ran — the panel vanished instead of
closing. It now stays mounted until the animation reports it finished.

The travel distance was 85% of the display whatever the sheet contained, so a
short one covered several hundred points in a fraction of a second and arrived
like a slam. It is measured now, and the panel fades with the backdrop.
