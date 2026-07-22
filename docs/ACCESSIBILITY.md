# Accessibility standard

This document is the accessibility contract for the Allfit One design system and its consumers. It turns accessibility requirements into component rules, implementation expectations, and release checks for Allfit OS on Web and Allfit Space on React Native.

The words **must**, **should**, and **may** indicate required, recommended, and optional behavior.

## Conformance target

- All Allfit One web experiences must meet WCAG 2.2 Level A and Level AA success criteria across complete pages, responsive variants, and complete user flows.
- Native applications must apply the equivalent WCAG principles plus current iOS and Android platform accessibility APIs and guidance.
- A passing automated scan does not establish conformance. Conformance requires automated checks, manual interaction, and assistive-technology testing.
- Third-party components do not receive an exception. If they prevent conformance, replace, configure, or isolate them before release.
- New components must be accessible by default. Consumers should not need undocumented props to obtain keyboard support, labels, focus, or sufficient contrast.

WCAG Level AA is the release baseline, not a ceiling. This system adopts stronger internal rules for focus appearance and touch targets where they improve consistency.

## Contrast

### Required ratios

| Content | Minimum ratio |
| --- | ---: |
| Normal text and images of text | `4.5:1` |
| Large text: at least `24px` regular or about `18.66px` bold | `3:1` |
| Meaningful icons, control boundaries, selected states, and other non-text UI information | `3:1` against adjacent colors |
| Focus indicators | `3:1` change against the unfocused adjacent color |
| Logotypes | WCAG exemption; use approved brand variants anyway |

Rules:

- Use approved semantic token pairs. Do not assume two individually approved colors form an approved pair.
- Calculate alpha colors after compositing them over the actual background.
- Normal-sized placeholder, helper, metadata, and error text must also reach `4.5:1`.
- Disabled controls are exempt from the WCAG contrast criterion, but their disabled state must remain recognizable and their labels should remain legible.
- `border.subtle` is decorative. Use `border.strong` when a boundary is necessary to identify a control or state.
- Status fill colors use `status.onStatus` for text. On light surfaces, do not use bright status colors as small text; use primary text plus a colored icon, dot, border, or fill.
- Validate every new theme, state, overlay, and image-backed surface independently.

The token validator must fail when required text pairs are below `4.5:1` or required non-text pairs are below `3:1`.

## Keyboard navigation and focus order

### Web

- Every pointer action must have a keyboard equivalent unless the action is inherently path-dependent, such as freehand drawing.
- Use native interactive elements first: `button`, `a`, `input`, `select`, `textarea`, and `details`.
- Focus order must follow reading order and task order, not visual positioning.
- Do not use a positive `tabIndex`. Use `tabIndex={0}` only for a justified custom interactive element and `tabIndex={-1}` for programmatic focus targets.
- `Tab` and `Shift+Tab` move between components. Arrow keys operate composite widgets such as tabs, menus, listboxes, radio groups, and grids according to their established pattern.
- `Enter` activates links and primary control actions. `Space` activates buttons and toggles without scrolling the page.
- `Escape` closes dismissible overlays, menus, and dialogs without committing changes.
- No component may trap keyboard focus. Modal dialogs are the exception while open and must always expose an operable close or cancel action.
- Drag-and-drop interfaces must provide a non-drag alternative, such as move buttons or a menu.
- Sticky headers, footers, banners, and floating panels must not fully obscure the focused component. Use layout space or `scroll-padding` where necessary.

### React Native

- Traversal order for VoiceOver, TalkBack, hardware keyboards, and switch devices must follow the visual and task order.
- Do not mark layout-only containers as accessible when doing so would hide meaningful descendants.
- Custom gestures must have a visible control alternative.
- Test hardware keyboard and directional focus behavior on every supported platform where those input modes are available.

## Visible focus and focus management

- Every keyboard-focusable Web component must show a persistent `:focus-visible` indicator.
- Never remove an outline unless an equal or stronger replacement is applied in the same rule.
- The Allfit One focus treatment uses a two-color ring: an inner `2px` chalk ring and an outer ring extending to `4px` in ink. This remains visible on both themes and mixed surfaces.
- Focus must not be indicated by color alone; the ring changes shape and occupied area.
- Focus styles must remain visible in forced-colors and high-contrast modes. Avoid disabling system outlines globally.
- Opening a modal moves focus into it. Closing it returns focus to the invoking control unless that control no longer exists.
- A modal keeps focus within itself while open and makes background content inert.
- Menus and popovers move focus only when their interaction pattern requires it. Informational toasts must not steal focus.
- After a client-side route change, move focus to the main heading or main content region when the framework does not restore a meaningful position.
- After deleting the focused item, move focus to the nearest logical surviving item and announce the result.
- Validation on submit moves focus to an error summary or the first invalid field according to the form pattern. Validation during typing does not continuously move focus.

## Semantics, labels, and accessible names

### Web

- Use landmarks and native structure: one primary `main`, meaningful `nav` labels, and headings without skipped hierarchy.
- Each control must expose a programmatic name, role, value, state, and relationships.
- Prefer a visible text label. `aria-label` is appropriate for icon-only controls when no visible label exists.
- Accessible names must describe the action: “Close dialog”, “Edit membership”, or “Next week”, not the icon shape.
- Decorative icons and repeated decorative brand assets use `aria-hidden="true"`. Meaningful images require purposeful alternative text.
- Do not duplicate the accessible name by exposing both decorative icon text and the visible label.
- State attributes must match the rendered state: `aria-expanded`, `aria-pressed`, `aria-selected`, `aria-current`, `aria-invalid`, and `aria-disabled`.
- A tooltip may supplement a control but must not be the only source of its accessible name or instructions.
- Set the document language and mark passages whose language differs from the page language.

### React Native

- Set `accessible` only when the element should be a single accessibility node.
- Use `accessibilityRole`, `accessibilityState`, `accessibilityValue`, and `accessibilityLabel` to match visible behavior.
- Use `accessibilityHint` only when the result of the action is not clear from the label.
- Keep labels concise and action-oriented. Do not include role words such as “button” in the label when the role API already announces them.
- Hide decorative elements from the accessibility tree without hiding meaningful siblings.
- Group content only when the combined announcement is clearer and all required child actions remain reachable.

## Forms, errors, and validation

- Every input must have a persistent visible label. Placeholder text is an example, not a label.
- Required state and format instructions must appear before the user submits the form.
- Associate helper and error text programmatically with its field.
- Identify errors in text and explain how to fix them. Do not rely only on a red border, icon, vibration, or sound.
- Use `aria-invalid="true"` only when the field is currently invalid. On Web, connect error details with `aria-describedby` or `aria-errormessage` according to support requirements.
- On React Native, update `accessibilityState` and announce submitted validation results through the platform accessibility API when necessary.
- Preserve entered values after validation fails.
- On submit, provide a concise error summary when multiple fields are invalid. Each summary item should move focus to the related field.
- Use polite live announcements for asynchronous validation and status updates. Do not announce on every keystroke.
- Success messages, loading completion, saved state, and background synchronization must be programmatically announced without forcing focus.
- Destructive, legal, financial, payment, membership, and stored-data actions must be reversible, reviewed, or explicitly confirmed before finalization.
- Authentication must support password managers and paste. Do not require memory puzzles or block accessible assistance without an equivalent alternative.

## State must not depend on color

- Pair color with text, an icon, a shape, a pattern, or a position change.
- Error, warning, success, and information messages must state their meaning in words.
- Selected tabs, navigation items, filters, and rows require a non-color indicator such as weight, underline, checkmark, border, or exposed selected state.
- Charts require labels, values, patterns, direct annotations, or an accessible data alternative. A legend based only on colored swatches is insufficient.
- Links inside body text must be distinguishable without relying only on hue.
- Hover, pressed, focused, selected, loading, and disabled states must remain distinguishable in monochrome and high-contrast modes.
- Sound and vibration may reinforce a state but may not be its only representation.

## Text scaling, zoom, and reflow

### Web

- Text must resize to `200%` without loss of content or functionality.
- At `400%` zoom, ordinary vertical content must reflow to a viewport equivalent to `320 CSS px` without two-dimensional scrolling.
- Use relative units for typography and spacing that must scale with text. Avoid fixed-height text containers.
- Controls, labels, errors, navigation, and dialogs must wrap or expand. Do not clip essential text or replace it with an inaccessible ellipsis.
- If truncation is necessary for dense data, expose the full value through an accessible, keyboard-reachable mechanism.
- Layouts must tolerate user text spacing of at least `1.5` line height, `2` times font-size paragraph spacing, `0.12em` letter spacing, and `0.16em` word spacing.
- Content must work in portrait and landscape unless a specific orientation is essential.

### React Native

- Keep `allowFontScaling` enabled for meaningful text.
- Support Dynamic Type and Android font-size settings without overlapping, clipping, or hiding actions.
- Avoid `maxFontSizeMultiplier`. If a product constraint requires one, document the exception and test at a multiplier of at least `2`.
- Prefer flexible rows, wrapping labels, and content-driven height. Test dialogs, bottom sheets, tab bars, and navigation headers at the largest supported text setting.
- Do not encode essential text inside raster images.

## Touch and pointer targets

The design system intentionally exceeds the WCAG 2.2 AA minimum target size for ordinary controls.

| Platform | Allfit One minimum |
| --- | ---: |
| Web pointer/touch interfaces | `44 × 44 CSS px` |
| React Native on iOS | `44 × 44 pt` |
| React Native on Android | `48 × 48 dp` |

Rules:

- The hit area may be larger than the visible icon, but adjacent hit areas must not overlap.
- Icon-only buttons use the full minimum hit area even when the glyph is `16–24px`.
- Use padding or platform hit-area APIs to enlarge compact controls without distorting the glyph.
- In React Native, `hitSlop` may extend the target only when it does not collide with neighboring actions.
- Frequently used and destructive actions should receive additional spacing where feasible.
- WCAG exceptions for inline links, equivalent controls, and essential presentation require explicit design review; they are not defaults.

Use `semanticSpacing.touchTargetWeb`, `semanticSpacing.touchTargetIos`, and `semanticSpacing.touchTargetAndroid` rather than hardcoded dimensions.

## Screen-reader rules

- Test Web with at least one Windows screen reader and VoiceOver on Apple platforms before a release containing new interaction patterns.
- Test React Native with both VoiceOver and TalkBack.
- Reading order and announcements must match the visible hierarchy and current state.
- Do not announce decorative separators, repeated icon names, or layout containers.
- Dynamic status messages use a polite announcement unless immediate action or safety requires an assertive interruption.
- Loading states announce what is loading and announce completion when the result is not otherwise obvious.
- Lists, headings, tables, fields, and groups must expose their native structure.
- Data tables require headers and navigable relationships. Responsive card transformations must preserve equivalent context.
- Modal titles, purpose, controls, and dismissal behavior must be discoverable without leaving the modal.
- Custom components require documented expected announcements for idle, focused, selected, disabled, loading, error, and success states.
- A screen-reader-only label must remain available at `200%` text size and in forced-colors modes; do not hide it with `display: none` or `visibility: hidden`.

## Review and test checklist

Every new or materially changed component must pass the applicable checks below.

### Design review

- [ ] Semantic color pairs meet the required text and non-text contrast ratios in dark and light themes.
- [ ] Information and state do not depend on color, sound, motion, or gesture alone.
- [ ] Visible labels, instructions, errors, empty states, and destructive confirmations are defined.
- [ ] Focus order, focus destination, dismissal, and focus return are specified.
- [ ] Web, iOS, and Android hit areas meet their platform minimums.
- [ ] Layouts account for wrapping, `200%` text, large Dynamic Type, and long translated content.
- [ ] Reduced-motion behavior is specified.

### Automated checks

- [ ] TypeScript, lint, token validation, and production build pass.
- [ ] Automated accessibility scanning reports no serious or critical violations in every state and theme.
- [ ] Unit tests verify accessible names, roles, state attributes, labels, and keyboard handlers.
- [ ] Contrast validation includes every new semantic token pair, including alpha compositing.
- [ ] No duplicate IDs, invalid ARIA relationships, or focusable hidden content are introduced.

### Manual Web checks

- [ ] Complete the flow with keyboard only, forward and backward, with no trap.
- [ ] Confirm persistent visible focus and ensure sticky UI never hides the focused control.
- [ ] Test browser zoom at `200%` and reflow at `400%`/`320 CSS px`.
- [ ] Test dark, light, forced-colors, reduced-motion, and increased text-spacing settings.
- [ ] Test forms with empty, malformed, server-error, loading, success, and destructive states.
- [ ] Test with a Windows screen reader and VoiceOver/Safari for new interaction patterns.

### Manual React Native checks

- [ ] Complete the flow with VoiceOver on iOS and TalkBack on Android.
- [ ] Verify labels, roles, values, state changes, traversal order, and announcements.
- [ ] Test the largest supported system font and display-size settings.
- [ ] Verify `44pt` iOS and `48dp` Android hit areas without overlap.
- [ ] Test reduced motion, bold text, increased contrast, and platform color-inversion behavior where applicable.
- [ ] Confirm custom gestures have visible alternatives and switch/hardware-keyboard navigation remains usable.

### Release evidence

- [ ] Record tested platforms, browsers, assistive technologies, themes, and text-size settings.
- [ ] Attach automated results and manual findings to the release or pull request.
- [ ] Resolve blocking issues before release; document accepted non-blocking limitations with an owner and follow-up date.

## References

- [WCAG 2.2 specification](https://www.w3.org/TR/WCAG22/)
- [WCAG 2.2 understanding documents](https://www.w3.org/WAI/WCAG22/Understanding/)
- [React Native accessibility APIs](https://reactnative.dev/docs/accessibility)
- [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Android accessibility guidance](https://developer.android.com/guide/topics/ui/accessibility/views/apps-views)
