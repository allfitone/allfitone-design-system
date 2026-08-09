# @allfitone/react

React and Next.js adapters for the Allfit One foundations. Import explicit subpaths so applications only include the capabilities they use.

```tsx
import { BrandLockup, ProductLockup } from "@allfitone/react/brand";
import { BackIcon, FoundationIcon } from "@allfitone/react/icons";
import { semanticColor } from "@allfitone/react/tokens";
import "@allfitone/react/tokens.css";
import "@allfitone/react/app.css";
import "@allfitone/react/styles.css";

import { Button } from "@allfitone/react/components/button";
import { Dialog } from "@allfitone/react/components/dialog";
import { AnimatedBrandLockup } from "@allfitone/react/components/animated-brand-lockup";

<ProductLockup product="studio" surface="dark" title="Allfit Studio" />;
```

## Entry points

- `@allfitone/react/brand`: accessible master-brand logo plus Space, Studio, and Backoffice SVG wordmark and shared-logo lockup components.
- `@allfitone/react/icons`: semantic Lucide icon component and icon metadata.
- `@allfitone/react/tokens`: typed platform-neutral token values.
- `@allfitone/react/tokens.css`: generated Web token variables and theme selectors.
- `@allfitone/react/app.css`: application canvas, browser reset, and product-font bridge.
- `@allfitone/react/styles.css`: compiled Tailwind 4 component utilities and the ALLFIT ONE shadcn bridge.
- `@allfitone/react/components/*`: explicit component subpaths; there is no all-components barrel.
- `@allfitone/react/lib/utils`: public `cn` class-composition utility.

The package root contains platform metadata only. This prevents accidental broad component imports and keeps bundle analysis predictable.

## Component contract

The component API follows shadcn composition on Base UI while its visual variants, tokens, target sizes, focus treatment, and accessibility defaults belong to ALLFIT ONE. Import CSS once at the application root in this order: `tokens.css`, `app.css`, then `styles.css`. Change themes with `data-afo-theme="dark|light"` on the document element.

`app.css` keeps application-level visual decisions in the Design System. Products that load fonts with `next/font` should expose the generated family names as `--afo-app-font-display` and `--afo-app-font-body`:

```tsx
const display = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--afo-app-font-display",
  weight: ["500", "600", "700"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--afo-app-font-body",
});
```

Available public component subpaths are:

- actions: `button` and `icon-button`;
- navigation: `breadcrumb`, `navigation-menu`, `dropdown-menu`, `pagination`, `drawer`, `sidebar`, `workspace-shell`, and `command`;
- entry: `access-shell` for responsive, brand-led authentication and product-entry pages, and `device-gate` for replacing compact-phone workspaces with device guidance;
- forms: `field`, `label`, `input`, and `textarea`;
- selection: `checkbox`, `radio-group`, `switch`, `select`, `combobox`, `date-picker`, `calendar`, and `tabs`;
- data display: `table`, `data-table`, `avatar`, `badge`, `card`, `skeleton`, and `empty`;
- signature: `accent-block`, `stat-strip`, `tick-ring`, `pulse-mark`, and `animated-brand-lockup`;
- overlays: `dialog`, `alert-dialog`, `sheet`, `popover`, `tooltip`, and the `CommandDialog` composition from `command`;
- feedback: `progress`, `alert`, `sonner`, and `spinner`;
- composition: `collapsible` and `separator`.

There is no all-components barrel. Import each component from its explicit `@allfitone/react/components/{name}` subpath.

Loading actions compose a named `Spinner` inside a disabled `Button`; components do not expose an `isLoading` prop. Icon-only actions use `IconButton`, whose TypeScript contract requires `aria-label`.

`Table` exposes `comfortable` and `compact` densities while preserving native
table semantics. Use `scrollAreaLabel` when horizontal overflow is expected so
keyboard users can reach the scroll region. Sorting is expressed with
`aria-sort` on `TableHead` and a visually neutral `TableSortButton`; selected
rows pair `selected` with a named `Checkbox`, and `TableState` provides loading,
empty, and error compositions.

`DataTable` builds on those primitives with a TanStack-powered headless layer.
Create the instance with `useDataTable`, then compose `DataTableToolbar`,
`DataTableFilterInput`, `DataTableViewOptions`, `DataTableSelectionBar`, and
`DataTablePagination` as needed. Pass TanStack `state` and `on*Change` options
to control sorting, filters, visibility, selection, and pagination from a
server-backed product screen.

`Avatar` keeps identity explicit across image loading and failure. Name the
root with `aria-label` or `aria-labelledby`, include `AvatarFallback`, and use
`decorative` only beside equivalent visible identity text. Presence states pair
semantic color with distinct icons and labels; groups expose their remaining
member count in words.

`Command` filters and ranks keyboard-first workspace destinations and actions.
Give the root a descriptive `label`, compose a named input, grouped items,
shortcuts, and an empty state, and provide stable item values. `CommandDialog`
uses the same command children inside the public Dialog focus contract rather
than introducing a separate global-search API. When a controlled global
shortcut opens the dialog without `DialogTrigger`, retain the invoking element
in a ref and pass it to `finalFocus`.

`Combobox` filters a predefined item collection and supports single or multiple
selection, grouped rich options, removable chips, and async loading, empty, and
error messages. Keep `ComboboxStatus` mounted and update its children when a
remote request changes state. For async collections, retain any selected items
in the `items` array so their labels remain available.

`Calendar` composes React DayPicker for single dates and ranges. Its public
props support controlled selection, disabled matchers, locale and timezone
configuration, multiple responsive months, and the canonical 44 px date grid.
Import `DateRange` and `Matcher` types from the same component subpath.

`DatePicker` composes a typed field, Popover, and Calendar around one controlled
or uncontrolled `Date | undefined` value. It keeps its accepted format visible,
validates typed dates and disabled Calendar matchers, and exposes textual invalid
or unavailable states without requiring a second parsing implementation in the
product.

`Alert` provides `info`, `success`, `warning`, and `danger` callouts with an
automatic semantic icon, title, description, and optional action. Static
callouts stay silent by default; use `live="polite"` for status updates or
`live="assertive"` for urgent failures inserted at runtime.

`Progress` composes a visible label and value with its track and indicator.
Use `value={null}` for indeterminate operations, and pair domain-specific
visible values with `getAriaValueText`. The `full` and `compact` variants share
the same semantics and retain a static signal when reduced motion is enabled.

`AnimatedBrandLockup` is the opt-in web entrance for the canonical Allfit One
lockup. It plays once, renders the final frame when reduced motion is requested,
and can be replayed by changing `replayKey`. Static brand consumers should keep
using `BrandLockup` from `@allfitone/react/brand`.

`DeviceGate` is a CSS-first composition for products that require tablet or
desktop workspace. Compose the compact fallback before `DeviceGateContent`.
The fallback replaces product content below `600px` wide and on coarse-pointer
landscape viewports below `600px` high; no user-agent detection or client-side
hydration is required. At `600px` wide and above, tablet content remains
available.
