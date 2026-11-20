---
"@allfitone/react": patch
---

Two borders that only showed on a dark page: a link styled as a button now shows what its variant and size declare, and the sidebar's edge has a colour of its own.

`buttonVariants()` returned two classes for one property wherever a variant or a size changed what the base said: the border colour, the shadow, the lift, the minimum height and the icon size. `<Button>` merges its classes, so it was never affected. An anchor or a framework `Link` takes the list as it comes, and there the stylesheet's order chose the winner:

- `outline` and `secondary` links were drawn with a transparent border. On the light theme the shadow still read as a pill; on the dark theme the link read as plain text. `destructive` lost its border the same way.
- An icon inside a `sm`, `xs`, `icon-xs`, `icon-sm` or `icon-lg` link took the default 16 px instead of the size its button takes.
- `ghost` and `link` links picked up the control shadow while pressed.

No variant or size restates the base any more, so the list reads the same merged or not. `<Button>` renders exactly as before.

`Sidebar` drew its edge with a border width and no colour. The published stylesheet carries no Preflight, so the edge took the text colour: near-white on a dark sidebar, which nobody saw beside a light page and which is a bright line beside a dark one. It is `--sidebar-border` now, on both sides.
