---
"@allfitone/react": patch
---

The published stylesheet no longer ships rules that only a test ever named.

Tailwind's automatic source detection reaches `packages/react/tests`, so a test that asserts a class string by name had that string extracted as a real candidate and emitted into `dist/styles.css`. Three rules were travelling in the package that way, none of them applied by any component: `.fade-in` and `.fade-out`, named by two negative assertions in `popover.test.tsx`, and `:has([data-slot=card-footer])` — the descendant form of the card footer rule that `0.16.1` had just fixed, put back by the very test asserting the card no longer carries it.

Dead CSS is cheap; a misleading stylesheet is not. Anyone checking that fix by reading the published CSS would have found the defective selector still there.

`@source not "../../tests"` stops it. Nothing a component renders changes: the components use the variant forms (`fade-in-0`, `data-[motion^=from-]:fade-in`), which are emitted from `src/components` as before.
