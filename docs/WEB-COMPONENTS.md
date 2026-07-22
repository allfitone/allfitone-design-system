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

The Trajectory Rail is the component system's signature gesture. It derives from the diagonal energy of the ALLFIT ONE symbol and marks primary actions, selected trajectories, and active surfaces. Use it only when the interface needs to communicate direction or current state; it is not a decorative border treatment.

- Primary Button places a restrained diagonal rail inside the trailing edge.
- Selected line Tabs use a diagonal trajectory instead of a generic underline.
- Card supports `data-state="active"` for an accented leading rail and boundary.
- Product layouts may carry the gesture into progress and navigation, but should not repeat it on every surface.

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
| Forms | Field, Label, Input, Textarea |
| Selection | Checkbox, RadioGroup, Switch, Select, Tabs |
| Data display | Badge, Card, Skeleton, Empty |
| Overlays | Dialog, AlertDialog, Sheet, Tooltip |
| Feedback | Sonner/Toast, Spinner |

`Separator` is a public compositional dependency used by `Field`.

## Composition rules

- Links that look like buttons apply `buttonVariants` to an anchor or framework `Link`. They do not render through Base UI Button.
- Loading actions compose `Spinner` and `disabled`; no component adds an `isLoading` prop.
- `IconButton` requires `aria-label` in TypeScript.
- Controlled components support `value`, `defaultValue`, and `onValueChange` through their Base UI root API.
- Overlays support `open`, `defaultOpen`, and `onOpenChange`, require a title, contain modal focus, support Escape, make the background inert, and return focus to the trigger.
- Field errors use text, `data-invalid`, `aria-invalid`, and an explicit description/error relationship.
- Tooltips supplement a control and never carry essential instructions alone.
- Toasts use live regions and textual status without moving focus.

Every interactive target is at least `44 x 44 CSS px`. Focus uses the two-ring ALLFIT ONE treatment and remains visible in forced colors. Reduced-motion preferences collapse animations to the canonical reduced duration.

## Explorer and validation

The Explorer keeps foundations at `/` and renders the interactive component catalog at `/components`. The catalog must consume only published `@allfitone/react` subpaths. Both views provide a mobile index when the desktop navigation is unavailable.

Component entries document their behavioral contract next to the interactive example. Category labels use functional namespaces such as `ACT`, `FRM`, and `OVR`; they are not numbered because the catalog is not a sequential process. The component hero demonstrates the real idle, focus, active, and complete interaction sequence instead of using decorative status metrics.

`npm run check` runs TypeScript, lint, package builds, unit tests, axe assertions, token validation, and output-contract validation. `npm run check:e2e` builds the workspace and runs Playwright for keyboard behavior, overlay focus, theme switching, WCAG scans, target sizes, 320 px reflow, and desktop/mobile visual regression.

Before publication, complete manual keyboard and NVDA testing on Windows. VoiceOver with Safari remains a required publication gate.
