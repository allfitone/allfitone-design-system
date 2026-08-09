---
"@allfitone/tokens": minor
---

Add the `control` typographic role: body family, extrabold, normal tracking.

Sentence-case controls — buttons, links, tabs — had no role of their own and
were reaching for `label`, which tracks at 0.16em. That spacing is correct for
uppercase micro-labels and unreadable on a phrase: at 14px it puts 2.24px
between every letter.

The web adapter had already worked around the gap by styling its button with
`font-extrabold` and no role at all, so the two platforms were diverging
silently. This gives both something correct to point at.
