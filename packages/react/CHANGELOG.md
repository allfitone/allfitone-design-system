# @allfitone/react

## 0.14.0

### Minor Changes

- 679be83: Remove the "logo with carrier" presentation. The Allfit One logo now appears only in its plain form, with no cyan tile behind it.

  - `BrandLogoCarrier` is removed from `@allfitone/brand/react`, `@allfitone/react/brand`, and `@allfitone/react-native/brand`. Use `BrandLogo` instead.
  - `brandGeometry.carrierPath`, `brandDimensions.logoCarrier`, `brandAssetFiles.logoCarrier`, and `brandAssetSpecifiers.logoCarrier` are removed, and `assets/logo/allfit-one-logo-carrier.svg` is no longer shipped.
  - `BrandLockup`, `ProductLockup`, `AnimatedBrandLockup`, and the lockup SVG assets render the plain cyan logo beside the wordmark. Their artwork is narrower: the Allfit One lockup is now 1438 × 480, and the Space, Studio, and Backoffice lockups are 1712, 1792, and 2340 × 480.

### Patch Changes

- Updated dependencies [679be83]
  - @allfitone/brand@0.4.0

## 0.13.2

### Patch Changes

- Updated dependencies [8662ad8]
- Updated dependencies [50d45da]
  - @allfitone/tokens@0.4.0
  - @allfitone/icons@0.4.0

## 0.13.1

### Patch Changes

- 51554bd: `DialogHeader` spaces a title from its description by 6px, matching
  `AlertDialogHeader`. The two carried 10px and 6px for the same pairing, which
  only became visible once the base reset removed the user-agent margins that had
  swamped both.

## 0.13.0

### Minor Changes

- 5ff10b3: Dialogs, alert dialogs, sheets and drawers now sit on a solid surface instead of
  the translucent glass material.

  Glass composites against whatever is behind it, so its contrast is not a
  property of the component: muted text inside a light-theme dialog measured
  4.27:1 against the composited background, under the 4.5:1 WCAG AA minimum. The
  material's own contract already reserved glass for floating chrome and gave
  content surfaces a solid fill — this applies that rule to the modal family.

  Floating chrome (select, combobox, dropdown menu, tooltip) keeps its glass.

## 0.12.1

### Patch Changes

- 414f2f3: A `reorder` glyph, for the grip a row is dragged by.

  Neither `panel` nor `more` could stand in: both open something, and this one is held
  rather than pressed. It is the affordance a list needs before it can be reordered at
  all — without it the only way to move an exercise is a menu item that moves it one
  place at a time.

- Updated dependencies [0490a4a]
- Updated dependencies [da9fb5c]
- Updated dependencies [46ac88e]
- Updated dependencies [7369f98]
- Updated dependencies [5ff339c]
- Updated dependencies [c6c935c]
- Updated dependencies [af31fdd]
- Updated dependencies [3322feb]
- Updated dependencies [bd7b7b7]
- Updated dependencies [a19c9c8]
- Updated dependencies [85360e3]
- Updated dependencies [e990493]
- Updated dependencies [414f2f3]
- Updated dependencies [a19c9c8]
- Updated dependencies [01108c0]
- Updated dependencies [e990493]
- Updated dependencies [e990493]
- Updated dependencies [01108c0]
- Updated dependencies [b9d168c]
- Updated dependencies [01108c0]
- Updated dependencies [bd7b7b7]
  - @allfitone/tokens@0.3.0
  - @allfitone/icons@0.3.0

## 0.12.0

### Minor Changes

- 15ab4e2: A horizontal `TabsList` now wraps onto a second row instead of scrolling
  horizontally. A tab pushed off the edge was a section the person had no way of
  knowing existed, and a strip of three ordinary labels stops fitting at 390px.

  Nothing changes for a strip that already fits: the list still takes the width of
  its content, so it is laid out exactly as before until wrapping is needed.

## 0.11.0

### Minor Changes

- 2d6d738: Make `app.css` deliver the browser reset it documents, without overriding the components.

  Tailwind is imported as `theme.css` and `utilities.css` only, so Preflight never lands and every heading, paragraph and list kept its user-agent margins. Those margins do not collapse inside flex or grid, so they added to whatever `gap` a component declared: a dialog's designed 10px title-to-description gap measured 41px. Consuming applications had been resetting it by hand.

  The reset sits in a new `afo-base` layer, and `styles.css` pins the layer order below `utilities`. Unlayered it would have flattened the spacing components set on themselves — `AccessPanelDescription` declares `mt-5` and rendered at 0.

  `button`, `input`, `select` and `textarea` now take `font-family`, `font-size` and `line-height` from the page instead of the `font` shorthand. The shorthand also reset `font-weight`, and being unlayered it beat the `font-extrabold` in the button's own base class: every real button rendered at the body weight, while a link styled with `buttonVariants()` kept 800 because the selector never matched an anchor.

  `Button` now specifies `font-normal`, which is what applications have rendered all along. Buttons themselves are unchanged; a link styled as a button stops being heavier than the buttons beside it.

### Patch Changes

- d59a13a: Let a `Select` popup outgrow its trigger.

  `SelectContent` was pinned to the trigger's width with `w-(--anchor-width)`, so a select in a narrow container could not display its own options: at 272px, Studio's sidebar rail gave the popup 166px, which no real organization name fits. Shortening the labels helps a short name and cannot help a long one.

  The trigger's width is the floor now rather than the ceiling, and `--available-width` — the room Base UI reports between the trigger and the edge of the viewport — is the new ceiling, so the popup grows to its content and stops there.

- 0260879: Fix six contained component defects found while auditing Allfit Studio.

  - `Badge variant="outline"` drew no outline. The base sets `border border-transparent` and the variant coloured nothing, so the badge rendered as loose text inside an invisible pill. It now uses `border-border`, the same token `Button`'s outline variant uses.
  - `AccessPanelAction` is a flex column with no gap. Right for the single action it was built around; with two it put them edge to edge, measured at 0px apart. It now declares `gap-3`.
  - `SidebarHeader` did not clip in icon mode while `SidebarContent` already did. The rail's width animates but `data-collapsible` flips at once, so header content sized for the open sidebar spilled out of the 56px rail for the length of the transition.
  - `AccessJourneyStep` dropped the left padding on its first cell only, inside a list that carries `border-y`. The first cell sat against the band's wall while the other two were inset 20px.
  - `SidebarGroup` overflowed the icon rail. The rail is 56px, `p-2` took 16, and `SidebarMenuButton` is forced to 44px in icon mode: 4px of overflow, anchored left, so the button sat off-centre. Horizontal padding is now 6px in icon mode, leaving exactly the 44px the touch-target contract requires.
  - `SetupProgressStep` took an equal share for its last step, whose connector is hidden, leaving dead space after the final label; and truncated its labels below 640px, where three steps split a phone and "IDENTIDAD" rendered as "IDENTID…". The last step now sizes to its content, and labels wrap instead of truncating until 640px.

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
