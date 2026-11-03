# Web components

`@allfitone/react` is the canonical component source for Allfit Studio, Allfit Backoffice, and future ALLFIT ONE Web products. It combines the compositional API expected from shadcn with Base UI behavior and ALLFIT ONE visual and accessibility contracts.

## Stack and configuration

- shadcn 4 using the Base UI implementation and the `nova` preset as structural input;
- React 19, TypeScript, and React Server Component-compatible entry points;
- Tailwind CSS 4 utilities compiled inside the package without Preflight;
- CSS variables mapped to canonical `--afo-*` tokens;
- Lucide glyphs exposed only through the semantic `FoundationIcon` vocabulary;
- dark as the initial theme and light selected with `data-afo-theme="light"`.

Product identity does not come from the preset. Component colors, typography, spacing, radii, shadows, focus, motion, and target sizes resolve through ALLFIT ONE tokens.

## Visual signature

Ink & Signal v2 uses calm blue-gray ink surfaces so one cyan signal can identify the most important action or state. The signal is intentionally scarce: a screen may contain one primary gradient action or one `AccentBlock`, not a field of competing accents.

- Primary Button is a pill filled by the canonical signal gradient.
- `AccentBlock` owns the single featured surface for a session, class, timer, or next action.
- Active navigation and Card states use a restrained three-pixel rail plus a tonal wash.
- `PulseMark`, `TickRing`, condensed tabular numerals, and subtle dot texture carry the athletic signature without turning every container into decoration.
- `AnimatedBrandLockup` provides the opt-in web entrance for Allfit One. It reveals the canonical logo and wordmark once; it does not use a product logo or the secondary pulse motif.
- Glass material is reserved for floating chrome and overlays; content cards remain solid.

Visual hierarchy is intentionally quieter than the brand palette. Cyan is reserved for primary action, current selection, focus, and short semantic accents. Resting controls use neutral semantic boundaries; persistent cyan borders across every surface are not part of the system.

- Controls use a slightly recessed surface and become clearer on hover or focus.
- Floating surfaces use the canonical raised shadow and a single semantic boundary.
- Primary actions carry the signal gradient; secondary, outline, and ghost actions remain neutral.
- Status badges use a tinted background plus explicit text. The public status variants are `success`, `warning`, `info`, `sport`, and `destructive`.
- Component demos must show depth, disabled behavior, invalid treatment, and long content in both themes rather than relying on isolated color swatches.

Barlow Condensed belongs to brand theses, category headings, and metrics. Functional titles inside Card, Dialog, AlertDialog, Sheet, and Empty use Manrope so dense application UI preserves a clear reading hierarchy.

## Public imports

Import the two CSS entry points once at the application root:

```tsx
import "@allfitone/react/tokens.css";
import "@allfitone/react/styles.css";
```

Import components individually:

```tsx
import { Button, buttonVariants } from "@allfitone/react/components/button";
import { Dialog, DialogContent, DialogTitle } from "@allfitone/react/components/dialog";
import { IconButton } from "@allfitone/react/components/icon-button";
```

The package root remains metadata-only. There is no component barrel because explicit subpaths keep consumer bundles and ownership predictable.

## Included components

| Category | Components |
| --- | --- |
| Actions | Button, IconButton |
| Navigation | Breadcrumb, NavigationMenu, DropdownMenu, Pagination, Drawer, Sidebar, WorkspaceShell, Command |
| Entry | AccessShell, DeviceGate, SiteShell |
| Forms | Field, Label, Input, Textarea |
| Selection | Checkbox, RadioGroup, Switch, ToggleGroup, Select, Combobox, DatePicker, Calendar, Tabs |
| Data display | Table, DataTable, Avatar, Badge, Card, Skeleton, Empty |
| Signature | AccentBlock, StatStrip, TickRing, PulseMark, AnimatedBrandLockup |
| Overlays | Dialog, AlertDialog, Sheet, Popover, Tooltip, CommandDialog |
| Feedback | Progress, Alert, Sonner/Toast, Spinner |
| Composition | Collapsible, Separator |

`Collapsible` and `Separator` are public compositional dependencies used by navigation and forms.

## Composition rules

- `AccessShell` owns the responsive composition for authentication and product-entry pages. Products provide brand, copy, a real anchor action, and security context without adding local layout styles. `AccessTitle` is the page `h1`, `AccessPanel` is named by its `h2`, and `AccessJourney` is reserved for a real ordered workflow.
- `SiteShell` is the public chrome of product sites such as space.allfit.one and studio.allfit.one: `SiteHeader` and `SiteFooter` with their parts. It owns no surface; every colour is a semantic token, so the same header reads as Space under `data-afo-theme="dark"` and as Studio under `data-afo-theme="light"`. Products pass their own `ProductLockup`, section links, language routes and action. `SiteHeaderNav` hides below `60rem`, where the page itself is the menu. Links accept `render` so a framework router owns navigation. `SiteContainer` is the content column every region lines up with (`min(81rem, 100% - 2 × clamp(1.25rem, 5vw, 4.5rem))`). Set `--afo-site-surface` when the page sits on a surface other than `--background`, so the scrolled header blurs over the same colour.
- `DeviceGate` replaces a product workspace with plain device guidance on compact phones. Compose one `DeviceGateFallback` and one `DeviceGateContent`; `DeviceGateMain` owns the accessible name, the only visible `main`, and the `h1` while compact. Compose product-owned recovery controls inside `DeviceGateActions`; it arranges actions responsively without owning clipboard, email, QR, or navigation behavior. The CSS contract blocks widths below `600px` and coarse-pointer landscape viewports below `600px` high, while preserving tablet access without user-agent detection or client hydration.
- Links that look like buttons apply `buttonVariants` to an anchor or framework `Link`. They do not render through Base UI Button. Control variants suppress the user-agent link underline themselves, so a navigating action and a submitting action read identically; the `link` variant keeps its underline on hover, because there the underline is the affordance.
- Workspace navigation composes `Sidebar` and `WorkspaceShell`; product applications provide destinations and routing state rather than restyling the active signal treatment.
- `SidebarProvider` accepts `collapseBelow`, a pixel width under which the sidebar starts collapsed. It exists for the band between the mobile breakpoint and a comfortable desktop width, where the expanded rail takes space the content needs but the offcanvas drawer would be premature. Pair it with `collapsible="icon"` so destinations stay reachable. Entering that band collapses the sidebar once and leaving it restores the previous preference; a controlled `open` is never overridden.
- Command provides the shared keyboard-first model for workspace destinations
  and actions. Give every root a descriptive `label`, every item a stable
  `value`, and use keywords only as search aliases. Group headings, visible
  shortcuts, disabled items, and plain-language empty results remain part of
  the composition.
- CommandDialog composes that same Command API inside Dialog. Products own the
  global shortcut and command outcomes; the component owns modal focus,
  Escape dismissal, background inertness, and focus return. A controlled
  global shortcut without `DialogTrigger` stores its invoking element and
  passes that ref to `finalFocus`.
- Breadcrumb and Pagination use real anchors or framework links. The current resource or page is always exposed semantically and never indicated by color alone.
- Drawer requires a visible or screen-reader title and serves mobile navigation or bounded secondary tasks; it does not replace Dialog for focused confirmations.
- Loading actions compose `Spinner` and `disabled`; no component adds an `isLoading` prop.
- Table preserves native caption, header, row, and cell relationships. Use
  `scrollAreaLabel` for a keyboard-focusable overflow region, `aria-sort` on
  sortable `TableHead` elements, `TableSortButton` for the column-label action,
  and a named Checkbox for every selectable row.
- Table density is `comfortable` or `compact`; compact density never reduces an
  interactive control below the 44 px target. `TableState` provides named
  loading, empty, and error rows without replacing the table structure.
- DataTable is a headless composition over Table. `useDataTable` supplies
  client-side row models by default and preserves TanStack controlled-state and
  manual server-mode options. Toolbar, filter, visibility, selection, and
  pagination controls remain independently composable.
- Avatar requires an explicit accessible intent. Give standalone identity an
  `aria-label` or `aria-labelledby`; use `decorative` only when adjacent text
  already names the same person. `AvatarImage` is silent because the root owns
  the name, and every composition includes `AvatarFallback`.
- `AvatarPresence` pairs each status color with a distinct icon and requires a
  full text label. Use `AvatarGroup` for assigned teams and name both the group
  and any `AvatarGroupCount` so hidden members remain understandable.
- ToggleGroup represents a compact set of pressed buttons for modes, locales,
  or filters. Name the group, keep the set between two and seven items, and use
  `multiple` only when simultaneous pressed values are meaningful. Values are
  arrays in both modes. If a product requires one value at all times, reject an
  empty `onValueChange` result instead of treating ToggleGroup like RadioGroup.
- ToggleGroup is not panel navigation. Use Tabs when each choice reveals a
  corresponding panel, and RadioGroup when the control submits exactly one
  form value.
- Combobox filters a known collection; it does not accept arbitrary free-form
  values. Compose `ComboboxInputGroup`, `ComboboxInput`, actions, content,
  list, and items for a single value. Add `ComboboxChips`, `ComboboxValue`,
  `ComboboxChip`, and a named `ComboboxChipRemove` for multiple selection.
- Keep `ComboboxStatus` mounted and change only its children across remote
  loading and error states so assistive technology receives consistent live
  region updates. Async collections retain selected items in `items`, even
  when those items are outside the latest result page.
- DatePicker composes a text field, Popover, and Calendar around one
  `Date | undefined` value. It supports controlled and uncontrolled use,
  commits typed input on Enter or blur, and opens from the trailing 44 px
  calendar action or `Alt+ArrowDown`.
- Keep `formatPattern` and the visible `formatHint` aligned. DatePicker rejects
  input that does not match that pattern and rejects dates matched by
  `calendarProps.disabled`; both failures remain explicit in text and through
  `aria-invalid`.
- Calendar supports controlled single-date and range selection through
  React DayPicker. Use `disabled` matchers for unavailable dates and
  `excludeDisabled` when a range must reset instead of crossing one.
- Pass `locale`, `lang`, `weekStartsOn`, and `timeZone` from the product
  context instead of deriving timezone during server rendering. Calendar
  re-exports `DateRange` and `Matcher` from its public subpath.
- Every date and month-navigation action retains the 44 px target. Multiple
  months move from a horizontal sequence to a vertical sequence on narrow
  screens, while a single month keeps horizontal overflow contained inside
  the named calendar root.
- Popover provides non-modal, anchored context for quick inspection and
  bounded edits such as reviewing a member snapshot or adjusting a session
  value. It is not a substitute for Dialog when the task must make the
  background inert or contain focus.
- Compose `PopoverHeader`, `PopoverTitle`, and `PopoverDescription` for rich
  content. Use `side`, `align`, and their offsets on `PopoverContent` for
  placement; Base UI handles collision avoidance, Escape and outside-press
  dismissal, and focus restoration.
- Popover uses a solid raised surface from the first animation frame. It must
  not inherit translucent glass or opacity transitions that allow underlying
  tables, tabs, or text to blend through the content.
- Alert uses a distinct status icon, title, and plain-language description so
  meaning never depends on its semantic rail color. Its variants are `info`,
  `success`, `warning`, and `danger`; actions compose through `AlertAction`.
- Progress composes a visible `ProgressLabel` and `ProgressValue` with
  `ProgressTrack` and `ProgressIndicator`. Use the full variant for a task with
  supporting context and the compact variant inside dense cards or rows.
- Pass `value={null}` for indeterminate work and keep the default “In progress”
  text or provide an equally explicit value renderer. Domain values such as
  sessions published should pair a custom visible value with
  `getAriaValueText`; reduced motion leaves a static signal in the track.
- Static Alert callouts do not create a live region. Use `live="polite"` for
  non-urgent updates and `live="assertive"` only for urgent failures that
  appear dynamically. Neither priority moves focus.
- `IconButton` requires `aria-label` in TypeScript.
- `TickRing` requires `aria-label` in TypeScript because its `meter` value must always have a name.
- `AnimatedBrandLockup` stays on its explicit component subpath so the Motion runtime is loaded only by consumers that opt into brand animation. Change `replayKey` to replay it.
- Controlled components support `value`, `defaultValue`, and `onValueChange` through their Base UI root API.
- Dialog, AlertDialog, and Sheet support controlled state, require a title,
  contain modal focus, make the background inert, support Escape, and return
  focus to the trigger. Popover remains non-modal and returns focus after
  dismissal without disabling the surrounding workspace.
- Field errors use text, `data-invalid`, `aria-invalid`, and an explicit description/error relationship.
- Tooltips supplement a control and never carry essential instructions alone.
- Toasts use live regions and textual status without moving focus.

Every interactive target is at least `44 x 44 CSS px`. Focus uses the two-ring ALLFIT ONE treatment and remains visible in forced colors. Reduced-motion preferences collapse animations to the canonical reduced duration.

## Explorer and validation

The Explorer redirects `/` to foundations at `/ui-foundation` and renders the interactive component catalog at `/components`. The catalog consumes only public `@allfitone/react` package subpaths through the local workspace, so the same imports remain valid after npm publication. Both views share the responsive design-system sidebar, exposed on mobile through the Allfit One logo control named “Open design system navigation”.

Component entries document their behavioral contract next to the interactive example. Category labels use the shared code Badge and functional namespaces such as `ACT`, `FRM`, and `OVR`; category headers show the number of documented entries without decorative sequence numerals. The component hero demonstrates the real idle, focus, active, and complete interaction sequence instead of using decorative status metrics.

`npm run check` runs TypeScript, lint, package builds, unit tests, axe assertions, token validation, and output-contract validation. `npm run check:e2e` builds the workspace and runs Playwright for keyboard behavior, overlay focus, theme switching, WCAG scans, target sizes, 320 px reflow, and desktop/mobile visual regression.

Before the next public package release, complete manual keyboard and NVDA testing on Windows. VoiceOver with Safari remains a required publication gate.
