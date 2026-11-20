---
"@allfitone/react": minor
---

Gives the web library the base its screens were missing: a text component, a button that keeps its own size, panels drawn by a hairline, and a light theme with an action that can be read.

- `Text`: every line of copy from a `role` and a `size`, as on React Native. `as` picks the element; `color`, `align`, `uppercase` and `tracking` cover the rest.
- `Button`: the label is the `control` role (800). It is 16 px by default and at `lg`, 14 px at `sm` and 12 px at `xs`; `lg` grows to a 48 px target. `outline` and `secondary` rest on the control border, so they show on the dark surface. `ghost` and `link` no longer carry a resting shadow.
- `app.css` resets a button's family and size inside the `afo-base` layer. Unlayered, it beat every `text-*` a component declared, so a real button rendered at the page's size whatever its `size`, and a link styled as a button came out smaller than the button beside it. Fields keep the unlayered reset and the page's 16 px.
- `TabsTrigger`, `ToggleGroupItem`, `SelectTrigger`, `ComboboxTrigger`, `NavigationMenuTrigger` and the calendar's days now say what they were rendering — the size of the text around them — so they look the same as before. A `SidebarMenuButton` rendered as a real button takes the 14 px its link form always had.
- An ink panel (`AccessPanel`, `SetupPanelIntro`) stays dark on either theme, so the action on it stays the signal gradient. `AccessPanelContent` sits one step closer to the description on a phone, so a 48 px action still ends above the fold.
- `Card`, `Table` and `StatStrip` are drawn by a hairline instead of a shadow. `CardTitle` is a 20 px sentence-case title (16 px in a small card) and `CardDescription` is 14 px secondary text. A micro-caps label above a figure is `Text` in the `eyebrow` role.
- Light theme: the primary action, checked controls, progress and active rails are turquoise ink with white text instead of cyan, and floating surfaces take the soft shadow. The dark theme keeps the signal gradient.
- Components read the themed aliases `--afo-action-fill`, `--afo-action-on-fill`, `--afo-surface-shadow`, `--afo-floating-shadow` and `--afo-overlay-shadow`, never the gradient or the shadow tokens directly.
- `Table` and `DataTable` read the `data` role's tracking; the `--afo-letter-spacing-athletic` variable they used was never defined.

A screen that set a label in micro-caps through `CardTitle` should move it to `Text role="eyebrow"`. A button with `size="sm"` or `size="xs"` gets smaller than before; one that should keep its size takes the default.
