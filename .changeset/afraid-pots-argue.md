---
"@allfitone/react": minor
---

Stop control variants from inheriting the user-agent link underline, and let a
sidebar collapse before the mobile breakpoint.

`buttonVariants`, `SidebarMenuButton` and `NavigationMenuLink` now clear
`text-decoration`. The published stylesheet ships without Tailwind's preflight,
so an anchor carrying these classes rendered underlined while the equivalent
`Button` did not: the same action looked different depending on whether it
navigated. The `link` variant keeps its underline on hover.

`SidebarProvider` accepts `collapseBelow`, a pixel width under which the sidebar
starts collapsed. Between the mobile breakpoint and a comfortable desktop width
the expanded rail was taking a fifth of the viewport from the content it frames,
with no state between "expanded" and "offcanvas drawer". Products opt in per
surface; omitting the prop preserves current behavior, and a controlled `open`
is never overridden.
