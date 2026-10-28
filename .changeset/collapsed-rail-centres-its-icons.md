---
"@allfitone/react": patch
---

The collapsed sidebar rail now centres its icons.

Two defects added up, and the second was invisible until the first was fixed.

**The label never left the row.** `SidebarMenuButton` clips its label with
`truncate` when the rail collapses, which hides the text but leaves the element
in the flex row still claiming width — and still reserving the `gap-2.5` beside
it. Measured on a 56px rail: 20px of icon plus 10px of gap plus the label's
remainder filled the button's 28px content box, so `justify-center` had nothing
left to centre and every icon sat 5px left of the rail's axis. Removing the gap
alone only moved the slack into the label. The label is now `sr-only` when
collapsed, which takes it out of the flow while leaving it in the accessibility
tree — it is the control's accessible name, so `hidden` would have silenced the
whole navigation for a screen reader.

**The header and footer kept the open inset.** `SidebarGroup` drops to
`px-1.5` when the rail collapses; `SidebarHeader` and `SidebarFooter` stayed at
`p-2`. Anything in them therefore sat 2px right of the navigation above it —
an account row whose icon read as misaligned against the five below it. Both
now take the same collapsed inset as the group.

Measured before and after on a real 56px rail: every icon moved from 13px/23px
and 20px/16px of surrounding space to **18px on both sides**.

Nothing in the Explorer composes a collapsed rail, which is why the visual
baselines never saw either defect.
