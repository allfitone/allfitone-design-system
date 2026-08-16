# @allfitone/react

## 0.10.0

### Minor Changes

- ee99734: Add canonical setup-shell and choice-card compositions, and preserve Sidebar element props and nested themes in the mobile portal.

## 0.9.1

### Patch Changes

- 3341318: Fix visual bugs and consistency across components:

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

## 0.9.0

### Minor Changes

- 70e8490: Add `DeviceGateActions`, a responsive composition slot for product-owned
  recovery controls in compact-screen fallbacks. Clipboard, email, QR, and
  navigation behavior remain controlled by the consuming product.

## 0.8.0

### Minor Changes

- 05bd2bb: Stop control variants from inheriting the user-agent link underline, and let a
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

## 0.7.2

### Patch Changes

- Updated dependencies [36f5bf4]
  - @allfitone/brand@0.3.0

## 0.7.1

### Patch Changes

- Updated dependencies [3bbaac1]
  - @allfitone/tokens@0.2.0

## 0.7.0

### Minor Changes

- 11b2e87: Add an accessible Base UI-backed ToggleGroup with single and multiple pressed states, arrow-key navigation, disabled behavior, and the Ink & Signal active treatment.
- 760c84e: Add outlined Allfit Space, Studio, and Backoffice wordmarks plus Web, React Native, and static SVG lockups that temporarily reuse the exact canonical Allfit One logo.

### Patch Changes

- Updated dependencies [760c84e]
  - @allfitone/brand@0.2.0

## 0.6.1

### Patch Changes

- cc15747: Prevent the public application font bridge from becoming cyclic in WebKit so display typography remains visible on mobile Safari.

## 0.6.0

### Minor Changes

- dbf5f31: Add a CSS-first DeviceGate composition that replaces compact-phone product workspaces with accessible tablet-or-desktop guidance.

## 0.5.0

### Minor Changes

- c003858: Add the responsive AccessShell composition for product entry and authentication pages.

## 0.4.0

### Minor Changes

- bda1260: Add a public application baseline for global canvas, browser reset, and product-loaded font integration.

## 0.3.0

### Minor Changes

- 2c9fff1: Add the composable Combobox with single and multiple selection, grouped rich
  options, removable chips, async status composition, keyboard filtering, and
  ALLFIT ONE field and roster-list styling.
- 2ab88c1: Add keyboard-first Command and CommandDialog compositions with filtering, groups, shortcuts, disabled items, empty results, and Dialog focus behavior.
- 3740126: Add the composable DataTable layer with client and server-controlled TanStack
  state, sorting, filtering, column visibility, bulk selection actions, and
  pagination built on the canonical Table primitives.
- 3c975df: Add a typed DatePicker composition with controlled and uncontrolled values,
  visible format guidance, disabled-date validation, and accessible Calendar and
  Popover behavior.
- ed85f31: Add semantic Alert callouts with informational, success, warning, and danger
  variants, automatic icons, optional actions, and explicit live-region priority.
- 2b322e3: Add composable full and compact Progress primitives with determinate and
  indeterminate states, visible value text, reduced motion, and forced-color
  support.
- b7d78f8: Add accessible Avatar primitives with image fallback, explicit naming,
  presence states, size variants, and grouped member composition.
- e1c5594: Add the composable Popover with non-modal anchored content, responsive
  placement and collision handling, Escape and outside-press dismissal, focus
  restoration, and an opaque ALLFIT ONE raised surface.
- bfb1d91: Add the Calendar component with single-date and range selection, disabled
  matchers, locale and timezone support, responsive multi-month layouts,
  44-pixel controls, and keyboard grid navigation.
- dbbea05: Add the canonical Table primitives with comfortable and compact densities,
  keyboard-reachable responsive overflow, selected and sortable states, and
  accessible loading, empty, and error compositions.

## 0.2.0

### Minor Changes

- abfe0f7: Make the semantic icon catalog authoritative across Web and Native, honor
  standard ARIA labelling, add tree-shakeable semantic React exports, and replace
  implicit numeric size and stroke overrides with validated explicit escape
  hatches.

### Patch Changes

- abfe0f7: Add a web-only animated Allfit One brand lockup with canonical geometry, replay support, and reduced-motion handling.
- Updated dependencies [abfe0f7]
  - @allfitone/icons@0.2.0

## 0.1.1

### Patch Changes

- 4f7e001: Allow the platform adapters to consume compatible foundation package patches while npm versions, Git tags, and GitHub Releases are managed independently per package.
