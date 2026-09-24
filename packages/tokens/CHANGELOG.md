# @allfitone/tokens

## 0.3.0

### Minor Changes

- 0490a4a: Dos piezas que una tarjeta grande necesitaba y no existían.

  `color.accent.edge` es el filo de una tarjeta que **es** la pantalla y no una fila
  dentro de ella. `accent.tonalBorder`, al 22 %, deja que una tarjeta de trescientos
  puntos se deshaga contra el lienzo; `border.accent`, opaco, la convierte en un botón.

  `gradient.surfaceDeep` es la superficie de esa tarjeta: tinta con el frío de la marca,
  **no** una superficie de acento. No gasta la única que `Ink & Signal` permite por
  pantalla, y varias pueden convivir — un carrusel de tarjetas es justo ese caso. Sin el
  degradado, una tarjeta de ese tamaño con un relleno plano se lee como un agujero.

- da9fb5c: Add `2xs` (10px) to the type scale.

  The scale stopped at 12px and the app's chrome does not. Tab labels, the badge on
  a card and the smallest eyebrows are all drawn at 9 to 10px in the approved
  canvases, and rendering them at 12 was visibly wrong on a phone: four tab labels
  at 12px do not fit a floating bar without touching each other, and "Comida"
  overflowed its own button.

  It is the floor and it is chrome only. Below `xs` the scale stops being readable
  as body text, so nothing narrative may use it — the docblock says so where the
  value is, because a size token cannot enforce its own boundary.

- 7369f98: Add `semanticColor.discipline`, and the `ember` and `turquoiseInk` primitives behind it.

  Six accents, one per training discipline, in both themes. They are **identity, not
  status**: the discipline carousel is a row of things whose whole argument is that they
  differ, and drawing six cards in the one brand accent would say they are the same thing
  six times. Five of them reuse a feedback hue that is already in the system — what is new
  is what the hue means in this context, which is exactly what a semantic token is for.

  `ember` and `emberDeep` are the only new primitives: no existing hue read as endurance
  without colliding with `warning`.

  `turquoiseInk` is a tidy-up that came with them. `#0E6E76` was written out four times
  across the light theme — an accent, a strong accent, a ring — and a literal repeated four
  times is a token that has not been named yet.

- c6c935c: Bring the glass material to the values the approved canvases use.

  The fill was `#0B141DB8` and the canvas draws `#0B141DA8` — six per cent more
  opaque than intended, which on a phone reads as a tinted block rather than as a
  lit surface. The edge was a cyan-tinted `#86BEC829`; the canvas uses a neutral
  `#F2FBFC2E`, and the tint was fighting the accent it sat beside. Blur moves from
  20 to 26 for the same reason, and the React Native intensity is re-calibrated
  against it.

  Worth knowing before reaching for this: glass shows what is behind it, so over a
  flat surface it will always look near-solid. It reads as glass when content passes
  under it — a scrolling list, a photograph — and that is the situation it is for.

- af31fdd: Glass is translucent again, and there are two materials instead of one.

  The fill is what colours the panel, but `BlurView`'s dark tint is a heavy
  translucency in its own right and at the intensity this shipped with it darkened
  everything a second time. A chip over a photograph came out solid, with none of the
  photograph in it. The blur now only blurs, and the token's own alpha decides how
  much shows through.

  `chip` joins `glass`: chrome floats over the canvas, where the thing behind it is a
  colour and the fill can afford to be heavy; a chip floats over imagery, where the
  thing behind it is the reason the screen works. At the same opacity it reads as a
  sticker, so it is lighter and its edge is brighter.

  `shine` becomes a token of its own. The specular edge was being painted with
  `border.subtle`, which is a border colour standing in for a highlight.

- 01108c0: `screenTop` grows from 12 to 20.

  The safe area clears the hardware and nothing else, so this is the only air between
  the notch and the first thing anybody reads. At 12 every screen in Space read as
  shoved against the top of the phone — and it being every screen at once is the tell
  that the fault is in the token rather than in a hundred layouts.

  16 was tried first on a device and still read pinned; 20 is where it stopped. Both
  are steps of the scale — a value between them would be a number this ramp does not
  have.

- 01108c0: `text.success` joins the palette, and `Text` can ask for it.

  Text had a colour for something going wrong and none for something going right,
  so a screen marking finished work had to reach past the theme for a hex — which
  is exactly the drift DT-008 exists to stop. The light theme uses the deep
  variant, because the dark-theme green does not carry AA on a near-white ground.

- 01108c0: `withAlpha` and `transparent` restate a token colour at a different opacity.

  A fade has two ends, and the one that is "not there" still has a colour. Reaching
  for the keyword `transparent` makes it transparent _black_, so the ramp travels
  through a darkness that is in no palette — a dirty band over imagery, and a colour
  nobody chose in the middle of an animation. `Scrim` already worked around this by
  appending `00` by hand; now there is one named way to do it, and it refuses
  anything that is not a token colour rather than producing a plausible wrong one.

- bd7b7b7: Add `WheelPicker`, and the three `wheel` colours it reads.

  A column of values that turns under a fixed window: the reading is not a label above
  a ruler, it **is** the row sitting in the window, so the number and the act of
  choosing it are one object instead of two that have to be kept in agreement.

  It is a `ScrollView` with `snapToInterval`, not a pan gesture — a wheel is scrolling,
  and saying so hands over momentum, the platform's fling curve and accessibility
  scrolling for free. Distance from the window drives size and colour in three steps
  rather than a continuous ramp, because interpolating `fontSize` per frame cannot run
  on the native driver and would drag the scroll back onto the JavaScript thread
  exactly while the finger is moving fastest.

  It runs both ways. `orientation` lays the scale across or down — the pairing of a
  horizontal weight beside a vertical height is deliberate, and two components would
  let their detents, tiers and accessibility drift apart the first time one of them was
  touched.

  The window is two ticks and nothing between them — a filled band with a
  rule above and below draws a second object around the reading and turns the wheel
  into a table.

  It paints no background of its own. Softening the ends with a gradient in the page's
  colour is a claim about what the page is, and over anything but a flat fill that
  claim shows up as a rectangle sitting on the design; dimming the far pair and letting
  the frame cut it in half reads the same and survives whatever it stands on.

  `semanticColor.wheel` carries `near` and `far` in both themes, with two new neutrals
  behind them.

## 0.2.0

### Minor Changes

- 3bbaac1: Add the `control` typographic role: body family, extrabold, normal tracking.

  Sentence-case controls — buttons, links, tabs — had no role of their own and
  were reaching for `label`, which tracks at 0.16em. That spacing is correct for
  uppercase micro-labels and unreadable on a phrase: at 14px it puts 2.24px
  between every letter.

  The web adapter had already worked around the gap by styling its button with
  `font-extrabold` and no role at all, so the two platforms were diverging
  silently. This gives both something correct to point at.
