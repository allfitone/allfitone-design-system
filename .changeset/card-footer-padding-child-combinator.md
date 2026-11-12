---
"@allfitone/react": patch
---

A card keeps its own bottom padding when the card nested inside it has a footer.

`Card` drops its bottom padding when it has a footer, because the footer supplies its own. The rule was written as `:has([data-slot=card-footer])`, and `:has()` matches a **descendant** — so any card that merely *contained* a card with a footer lost its padding too, however deep the nesting. In Allfit Studio the panel holding a client's card measured `padding-bottom: 0px` against the 20px on its sibling panels, and the footer causing it was two levels down. The rule now looks at the card's own children: `:has(> [data-slot=card-footer])`.

The same declaration was also repeated behind `data-[size=sm]`, which said nothing the first copy did not — `size="sm"` only changes the spacing scale. It is gone.
