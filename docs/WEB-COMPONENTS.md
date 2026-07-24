# Web components

`@allfitone/react` is the canonical component source for Allfit OS and future ALLFIT ONE Web products. It combines the compositional API expected from shadcn with Base UI behavior and ALLFIT ONE visual and accessibility contracts.

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
| Navigation | Breadcrumb, NavigationMenu, DropdownMenu, Pagination, Drawer, Sidebar, WorkspaceShell |
| Forms | Field, Label, Input, Textarea |
| Selection | Checkbox, RadioGroup, Switch, Select, Tabs |
| Data display | Badge, Card, Skeleton, Empty |
| Signature | AccentBlock, StatStrip, TickRing, PulseMark |
| Overlays | Dialog, AlertDialog, Sheet, Tooltip |
| Feedback | Sonner/Toast, Spinner |
| Composition | Collapsible, Separator |

`Collapsible` and `Separator` are public compositional dependencies used by navigation and forms.

## Composition rules

- Links that look like buttons apply `buttonVariants` to an anchor or framework `Link`. They do not render through Base UI Button.
- Workspace navigation composes `Sidebar` and `WorkspaceShell`; product applications provide destinations and routing state rather than restyling the active signal treatment.
- Breadcrumb and Pagination use real anchors or framework links. The current resource or page is always exposed semantically and never indicated by color alone.
- Drawer requires a visible or screen-reader title and serves mobile navigation or bounded secondary tasks; it does not replace Dialog for focused confirmations.
- Loading actions compose `Spinner` and `disabled`; no component adds an `isLoading` prop.
- `IconButton` requires `aria-label` in TypeScript.
- `TickRing` requires `aria-label` in TypeScript because its `meter` value must always have a name.
- Controlled components support `value`, `defaultValue`, and `onValueChange` through their Base UI root API.
- Overlays support `open`, `defaultOpen`, and `onOpenChange`, require a title, contain modal focus, support Escape, make the background inert, and return focus to the trigger.
- Field errors use text, `data-invalid`, `aria-invalid`, and an explicit description/error relationship.
- Tooltips supplement a control and never carry essential instructions alone.
- Toasts use live regions and textual status without moving focus.

Every interactive target is at least `44 x 44 CSS px`. Focus uses the two-ring ALLFIT ONE treatment and remains visible in forced colors. Reduced-motion preferences collapse animations to the canonical reduced duration.

## Explorer and validation

The Explorer redirects `/` to foundations at `/ui-foundation` and renders the interactive component catalog at `/components`. The catalog consumes only public `@allfitone/react` package subpaths through the local workspace, so the same imports remain valid after npm publication. Both views share the responsive design-system sidebar, exposed on mobile through the Allfit One logo control named “Open design system navigation”.

Component entries document their behavioral contract next to the interactive example. Category labels use the shared code Badge and functional namespaces such as `ACT`, `FRM`, and `OVR`; category headers show the number of documented entries without decorative sequence numerals. The component hero demonstrates the real idle, focus, active, and complete interaction sequence instead of using decorative status metrics.

`npm run check` runs TypeScript, lint, package builds, unit tests, axe assertions, token validation, and output-contract validation. `npm run check:e2e` builds the workspace and runs Playwright for keyboard behavior, overlay focus, theme switching, WCAG scans, target sizes, 320 px reflow, and desktop/mobile visual regression.

Before publication, complete manual keyboard and NVDA testing on Windows. VoiceOver with Safari remains a required publication gate.
