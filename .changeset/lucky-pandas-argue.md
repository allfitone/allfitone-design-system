---
"@allfitone/react": patch
---

Let a `Select` popup outgrow its trigger.

`SelectContent` was pinned to the trigger's width with `w-(--anchor-width)`, so a select in a narrow container could not display its own options: at 272px, Studio's sidebar rail gave the popup 166px, which no real organization name fits. Shortening the labels helps a short name and cannot help a long one.

The trigger's width is the floor now rather than the ceiling, and `--available-width` — the room Base UI reports between the trigger and the edge of the viewport — is the new ceiling, so the popup grows to its content and stops there.
