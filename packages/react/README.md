# @allfitone/react

React and Next.js adapters for the Allfit One foundations. Import explicit subpaths so applications only include the capabilities they use.

```tsx
import { BrandLockup } from "@allfitone/react/brand";
import { BackIcon, FoundationIcon } from "@allfitone/react/icons";
import { semanticColor } from "@allfitone/react/tokens";
import "@allfitone/react/tokens.css";
import "@allfitone/react/styles.css";

import { Button } from "@allfitone/react/components/button";
import { Dialog } from "@allfitone/react/components/dialog";
import { AnimatedBrandLockup } from "@allfitone/react/components/animated-brand-lockup";
```

## Entry points

- `@allfitone/react/brand`: accessible SVG logo, wordmark, and lockup components.
- `@allfitone/react/icons`: semantic Lucide icon component and icon metadata.
- `@allfitone/react/tokens`: typed platform-neutral token values.
- `@allfitone/react/tokens.css`: generated Web token variables and theme selectors.
- `@allfitone/react/styles.css`: compiled Tailwind 4 component utilities and the ALLFIT ONE shadcn bridge.
- `@allfitone/react/components/*`: explicit component subpaths; there is no all-components barrel.
- `@allfitone/react/lib/utils`: public `cn` class-composition utility.

The package root contains platform metadata only. This prevents accidental broad component imports and keeps bundle analysis predictable.

## Component contract

The component API follows shadcn composition on Base UI while its visual variants, tokens, target sizes, focus treatment, and accessibility defaults belong to ALLFIT ONE. Import CSS once at the application root, place `tokens.css` before `styles.css`, and change themes with `data-afo-theme="dark|light"` on the document element.

Available public component subpaths are:

- actions: `button` and `icon-button`;
- navigation: `breadcrumb`, `navigation-menu`, `dropdown-menu`, `pagination`, `drawer`, `sidebar`, and `workspace-shell`;
- forms: `field`, `label`, `input`, and `textarea`;
- selection: `checkbox`, `radio-group`, `switch`, `select`, `combobox`, `date-picker`, `calendar`, and `tabs`;
- data display: `table`, `data-table`, `badge`, `card`, `skeleton`, and `empty`;
- signature: `accent-block`, `stat-strip`, `tick-ring`, `pulse-mark`, and `animated-brand-lockup`;
- overlays: `dialog`, `alert-dialog`, `sheet`, `popover`, and `tooltip`;
- feedback: `alert`, `sonner`, and `spinner`;
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

`AnimatedBrandLockup` is the opt-in web entrance for the canonical Allfit One
lockup. It plays once, renders the final frame when reduced motion is requested,
and can be replayed by changing `replayKey`. Static brand consumers should keep
using `BrandLockup` from `@allfitone/react/brand`.
