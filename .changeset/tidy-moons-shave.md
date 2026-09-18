---
"@allfitone/react": patch
---

Fix six contained component defects found while auditing Allfit Studio.

- `Badge variant="outline"` drew no outline. The base sets `border border-transparent` and the variant coloured nothing, so the badge rendered as loose text inside an invisible pill. It now uses `border-border`, the same token `Button`'s outline variant uses.
- `AccessPanelAction` is a flex column with no gap. Right for the single action it was built around; with two it put them edge to edge, measured at 0px apart. It now declares `gap-3`.
- `SidebarHeader` did not clip in icon mode while `SidebarContent` already did. The rail's width animates but `data-collapsible` flips at once, so header content sized for the open sidebar spilled out of the 56px rail for the length of the transition.
- `AccessJourneyStep` dropped the left padding on its first cell only, inside a list that carries `border-y`. The first cell sat against the band's wall while the other two were inset 20px.
- `SidebarGroup` overflowed the icon rail. The rail is 56px, `p-2` took 16, and `SidebarMenuButton` is forced to 44px in icon mode: 4px of overflow, anchored left, so the button sat off-centre. Horizontal padding is now 6px in icon mode, leaving exactly the 44px the touch-target contract requires.
- `SetupProgressStep` took an equal share for its last step, whose connector is hidden, leaving dead space after the final label; and truncated its labels below 640px, where three steps split a phone and "IDENTIDAD" rendered as "IDENTID…". The last step now sizes to its content, and labels wrap instead of truncating until 640px.
