---
"@allfitone/react": patch
---

Fix visual bugs and consistency across components:

- `Table`/`DataTable`: numeric columns now align to the end and derive their
  header alignment from the `numeric` meta so headers and cells stay in sync.
- `Dialog`/`AlertDialog`/`Sheet`: cap height and scroll internally so long
  content and the footer stay reachable within the viewport.
- `IconButton`: the default variant now renders the brand gradient like
  `Button`, so the two match side by side.
- `NavigationMenu`: restore the directional enter/exit motion that never
  applied because of invalid utility syntax.
- `Tabs`: the horizontal list scrolls instead of overflowing when it holds
  more tabs than fit.
- `Sidebar`: the active-item bar stays visible in the collapsed icon rail.
- `RadioGroup`: the checked state uses the accent gradient, matching
  `Checkbox` and `Switch`.
- `Select`: trigger text is 16px on mobile (avoids iOS zoom) and the minimum
  width is responsive so it no longer overflows narrow screens.
- `Toaster` (Sonner): the loading spinner respects `prefers-reduced-motion`
  and the initial theme reads the current document theme to avoid a flash.
- `Table`: selected rows now show a hover state instead of staying flat.
- `Calendar`: keyboard focus on a day uses the system focus ring, not a faint
  1px border.
- `Breadcrumb`: the current page no longer exposes a non-interactive
  "disabled link" role, and the default separator flips in RTL.
- `Pagination`/`DataTable`: previous/next chevrons flip in RTL.
- `Collapsible`: open/close now animates its height instead of snapping.
- `Sidebar`: the menu skeleton matches the real item height, removing the
  reflow when content loads.
- `TickRing`: announces a rounded percentage instead of a fractional value.
