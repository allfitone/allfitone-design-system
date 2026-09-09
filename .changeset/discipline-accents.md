---
"@allfitone/tokens": minor
---

Add `semanticColor.discipline`, and the `ember` and `turquoiseInk` primitives behind it.

Six accents, one per training discipline, in both themes. They are **identity, not
status**: the discipline carousel is a row of things whose whole argument is that they
differ, and drawing six cards in the one brand accent would say they are the same thing
six times. Five of them reuse a feedback hue that is already in the system — what is new
is what the hue means in this context, which is exactly what a semantic token is for.

`ember` and `emberDeep` are the only new primitives: no existing hue read as endurance
without colliding with `warning`.

`turquoiseInk` is a tidy-up that came with them. `#0E6E76` was written out four times
across the light theme — an accent, a strong accent, a ring — and a literal repeated four
times is a token that has not been named yet.
