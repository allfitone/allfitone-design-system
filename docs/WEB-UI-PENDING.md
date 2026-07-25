# Web UI pending work

This document tracks the remaining Web UI work for `@allfitone/react`. It is a component and product-pattern backlog, not a commitment to recreate every component available in shadcn.

Components enter the Design System when they are expected to be reused by Allfit OS or another ALLFIT ONE Web product. Product-specific business flows remain in their product repository until a stable shared pattern emerges.

## Current baseline

The following areas already have a canonical implementation:

- actions: Button and IconButton;
- navigation: Breadcrumb, NavigationMenu, DropdownMenu, Pagination, Drawer, Sidebar, and WorkspaceShell;
- forms: Field, Label, Input, and Textarea;
- selection: Checkbox, RadioGroup, Switch, Select, and Tabs;
- data display: Badge, Card, Skeleton, and Empty;
- signature: AccentBlock, StatStrip, TickRing, and PulseMark;
- overlays: Dialog, AlertDialog, Sheet, and Tooltip;
- feedback: Sonner/Toast and Spinner.
- composition: Collapsible and Separator.

Navigation is ready as a reusable foundation. Product repositories still need to supply their routes, permissions, labels, active state, and responsive information architecture.

## Priority 0 — unblock Allfit OS

These components cover the most likely operational and administrative workflows and should be implemented next.

| Component | Required scope |
| --- | --- |
| Table | Semantic table primitives, density variants, responsive overflow, row selection, sorting state, loading, empty, and error states. |
| DataTable | Headless composition for column visibility, filters, sorting, bulk actions, pagination, and server-controlled state. It must build on Table rather than replace it. |
| Combobox | Searchable single and multiple selection, async/loading state, empty results, grouped options, keyboard traversal, and long labels. |
| Popover | Non-modal anchored content with placement, collision handling, Escape dismissal, and focus restoration. |
| Calendar | Single date, range, disabled dates, locale-ready labels, keyboard grid navigation, and responsive months. |
| DatePicker | Field, Calendar, and Popover composition with parsing, visible format guidance, invalid state, and controlled values. |
| Alert | Informational, success, warning, and danger variants with icon, title, description, and optional action. Meaning must not depend on color. |
| Progress | Determinate and indeterminate progress with an accessible name, textual value, reduced motion, and compact/full variants. |
| Avatar | Image, initials fallback, loading failure, accessible name guidance, group composition, and presence expressed beyond color. |
| Command | Searchable keyboard-first command list with groups, shortcuts, empty results, and disabled items. |
| CommandDialog | Command composed with Dialog for global navigation and actions without creating a second command API. |

## Priority 1 — complete common product workflows

- Accordion for dense detail and filter surfaces; it should compose the existing Collapsible behavior.
- SearchField with clear action, loading, results count, and native search semantics.
- NumberField with step controls, boundaries, units, and locale-aware input behavior.
- Slider for bounded numeric selection, including range and keyboard increments.
- FileUpload with drag-and-drop enhancement, native input fallback, progress, retry, file constraints, and errors in text.
- ContextMenu for pointer and keyboard invocation where the same actions remain discoverable elsewhere.
- Menubar only if OS develops persistent desktop-style command groups.
- Stepper for genuinely sequential flows with current, complete, error, and optional states.
- AlertBanner for page-level incidents, maintenance, permission restrictions, and recoverable errors.
- Meter for measurements such as capacity or adherence where `Progress` would communicate the wrong meaning.

## Priority 2 — reusable product patterns

These are composed patterns, not new low-level primitives. They should be promoted only after at least two real OS screens validate their structure.

- PageHeader: breadcrumb, title, metadata, primary action, and responsive overflow actions.
- FilterBar: search, filters, active filter summary, clear-all, and mobile filter Sheet.
- BulkActionBar: selected count, bounded actions, destructive confirmation, and selection exit.
- EntityListItem: avatar/icon, primary and secondary information, status, metadata, and trailing action.
- MetricCard: value, comparison, timeframe, status, and optional chart slot without encoding meaning only through trend color.
- ActivityFeed and Timeline: ordered events, actor, timestamp, event status, and loading/empty states.
- FormLayout: sections, responsive columns, action footer, unsaved state, and error summary.
- ErrorState and PermissionState: recoverable failure, forbidden access, offline state, and retry/support actions.
- NotificationCenter: grouped notifications, unread semantics, actions, and pagination or incremental loading.

## Navigation follow-up

The reusable navigation component layer is complete, but product integration must still validate:

- Next.js `Link` composition for Breadcrumb, Pagination, NavigationMenu, and Sidebar destinations;
- active-route and nested-route rules based on the real OS route tree;
- permission-filtered navigation without empty groups or unreachable focus targets;
- organization switching and persistence across sessions;
- collapsed Sidebar behavior with translated and long labels;
- mobile information architecture using Drawer or the Sidebar mobile Sheet;
- deep links, browser back/forward behavior, and focus placement after route changes.

These behaviors belong in Allfit OS first. Only generic routing adapters proven by the product should return to the Design System.

## Validation and release gates still pending

- Keep Windows Chromium as the canonical visual-regression platform; Linux CI continues to run behavior, reflow, keyboard, reduced-motion, and Axe checks.
- Complete a manual keyboard pass in the Explorer and in the first consuming OS shell.
- Complete the required NVDA review on Windows.
- Complete the required VoiceOver and Safari review before the next public package release.
- Run a consumer smoke test from Allfit OS using only public `@allfitone/react` subpaths.
- Validate real navigation labels, dense tables, translated content, zoom at 200%, and 320 px layouts with production-like data.
- Every public navigation contract change requires a Changeset. Documentation-only Explorer changes do not.

## Definition of done for every new component

A component is not complete until all of the following are true:

- it has an explicit public subpath under `@allfitone/react/components/*`;
- it uses semantic `--afo-*` tokens and the shared icon vocabulary, with no product-local colors or direct Lucide imports;
- its interactive targets meet the `44 × 44 CSS px` contract where applicable;
- dark, light, hover, focus, active, disabled, loading, invalid, empty, error, and long-content states are addressed as applicable;
- keyboard behavior, accessible names, focus behavior, reduced motion, and forced colors are tested;
- it reflows at 320 px without horizontal page overflow;
- the Explorer documents its variants, contract, public import, and interactive behavior;
- unit tests, axe checks, Playwright behavior, visual regression, package validation, and import smoke tests pass;
- the API composes with existing primitives instead of introducing a competing abstraction.

## Intake rule

Before starting a backlog item, document the product use cases that need it. Prefer one flexible primitive plus documented compositions over several components differentiated only by product wording or visual styling.

The recommended implementation order is:

1. Table and DataTable;
2. Combobox;
3. Popover, Calendar, and DatePicker;
4. Alert and Progress;
5. Avatar;
6. Command and CommandDialog;
7. Priority 1 components as required by actual OS screens.
