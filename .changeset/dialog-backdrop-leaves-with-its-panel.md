---
"@allfitone/react": patch
---

A closing dialog no longer leaves the screen blurred after its panel is gone.

`Dialog` and `AlertDialog` animated their panel and their backdrop out over
different durations: the panel used `--afo-motion-enter-duration` (320ms) and
the backdrop `--afo-motion-feedback-duration` (120ms). A CSS animation does not
hold its end state, so the backdrop finished early and **snapped back to full
opacity and blur**, where it stayed for the remaining 200ms until the panel's
animation ended and the portal unmounted. What a person saw was the dialog
closing, then the whole page sitting blurred for a beat with nothing on it.

Both surfaces now close on `--afo-motion-exit-duration` and
`--afo-motion-exit-easing` — the tokens that existed for exactly this and were
used nowhere. They leave together, and the close is quicker. Opening is
unchanged: the backdrop still lands ahead of the panel.

`Sheet` and `Drawer` share the pattern but not the defect: they close with CSS
transitions, which do hold their end state.
