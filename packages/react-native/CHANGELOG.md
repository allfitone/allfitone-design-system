# @allfitone/react-native

## 0.9.0

### Minor Changes

- 679be83: Remove the "logo with carrier" presentation. The Allfit One logo now appears only in its plain form, with no cyan tile behind it.

  - `BrandLogoCarrier` is removed from `@allfitone/brand/react`, `@allfitone/react/brand`, and `@allfitone/react-native/brand`. Use `BrandLogo` instead.
  - `brandGeometry.carrierPath`, `brandDimensions.logoCarrier`, `brandAssetFiles.logoCarrier`, and `brandAssetSpecifiers.logoCarrier` are removed, and `assets/logo/allfit-one-logo-carrier.svg` is no longer shipped.
  - `BrandLockup`, `ProductLockup`, `AnimatedBrandLockup`, and the lockup SVG assets render the plain cyan logo beside the wordmark. Their artwork is narrower: the Allfit One lockup is now 1438 × 480, and the Space, Studio, and Backoffice lockups are 1712, 1792, and 2340 × 480.

### Patch Changes

- Updated dependencies [679be83]
  - @allfitone/brand@0.4.0

## 0.8.0

### Minor Changes

- 8662ad8: Add `InstagramGlyph` and `instagramGradient` at `@allfitone/react-native/third-party`:
  Instagram's own mark, from Simple Icons (CC0-1.0), so a product can share to Instagram
  with the glyph people recognise. It is shown in white, black or Meta's gradient, never
  in the Allfit palette.
- 8662ad8: Add `Toast` at `@allfitone/react-native/toast`: a transient confirmation such as
  "Guardada en Fotos." that floats over the screen and hides itself. `InlineAlert`
  stays with its control; a toast acknowledges an outcome nothing depends on afterwards.
  It announces politely, never as an alert, and honours reduced motion.
- 8662ad8: Add the shareable-artwork typography role `poster` (Barlow Condensed ExtraBold Italic) and a `font-style` variable per role. `useAllfitFonts` now also loads Barlow Condensed ExtraBold Italic.
- 50d45da: Add `image`, `download` and `share` to the icon catalogue. A share screen picks a
  picture, keeps the image on the device and hands it on; none of the three existed, so
  a product would have had to draw its own.

### Patch Changes

- Updated dependencies [8662ad8]
- Updated dependencies [50d45da]
  - @allfitone/tokens@0.4.0
  - @allfitone/icons@0.4.0

## 0.7.0

### Minor Changes

- 35bb688: `Badge` takes the palette's identity tones, and will tell you what colour it painted.

  Six things that differ need six colours, and none of them means anything is wrong. The
  palette already draws that line for disciplines — its own comment calls them «identity
  rather than status» — so a badge distinguishing one superset from another reaches for
  the same six instead of borrowing `warning` and `danger`, which on the very same screen
  already mean a warm-up and a set taken to failure.

  `badgeToneColor` exists because a badge is not always the only thing wearing the
  colour: a rule down the edge of the rows it labels has to match it, and the only
  alternative was letting the consumer pass a hex, which is the door this component was
  built to keep shut. `identityTone(index)` hands the six out in order.

- 0490a4a: `Badge` gana la variante `quiet`, para lo que se posa encima de una fotografía.

  La variante sólida se rellena con el color del estado y se escanea en una tabla: es lo
  correcto en una fila densa y lo equivocado sobre una imagen, donde un relleno opaco tapa
  justo lo que hace funcionar la pantalla. `quiet` toma el material **`chip`**, que el
  sistema ya reservaba para eso —«a la misma opacidad que el cristal del cromado, una
  pastilla sobre una foto se lee como una calcomanía»— con el color del tono como tinta.

  Y va en **caja baja**. «En curso» o «Sigue esta» se leen como una frase corta, no se
  escanean como una etiqueta; las mayúsculas del `eyebrow` siguen siendo del badge sólido,
  que es donde ganan.

- b8ee7c3: `Badge` states what kind of thing a row is.

  A set can be a warm-up, a working set, one taken to failure or a drop set, and four
  words in a dense table have to be told apart before they are read. That is a fact
  about the row, not a choice offered on it, which is why this is not `Chip`: a chip
  is pressed to decide something and stays on; a badge reports, and pressing it — when
  it is pressed at all — opens where the fact is set.

  Two things are deliberately closed:

  - **No colour input.** The tone is a semantic slot from the palette and nothing else,
    so `DT-009`'s rule that colour carries meaning survives contact with a component
    whose whole job is to be colourful. The build fails on a hex literal in the file.
  - **The ink comes from `status.onStatus`.** Picking white or black by hand reads fine
    in the theme it was written in and fails in the other one.

  It is the one place caps belong, in the `eyebrow` role: one or two words scanned at a
  glance, which is the opposite of the names the library just moved out of uppercase.

- 5dcf55d: `Button` has a compact size, for actions that sit beside content rather than lead it.

  A toolbar under a table is not the confirm of a screen, and drawing it at the same
  weight makes the table look like the smaller thing. `size="sm"` is 36 points with the
  label at `control sm` and tighter insets.

  `IconButton` takes the same size, at the same 36 points, so a glyph and a word sit
  level in one row instead of one of them being the tallest thing in it.

  They give up height, never reach. `hitSlop` restores the 44 the visual no longer has,
  which is the line `ACCESSIBILITY.md` draws: the target is measured on what the finger
  can hit, not on what the eye can see.

- 78e321a: `Button` accepts an `icon`.

  Actions whose meaning is carried by a glyph as well as a word had no way to say so,
  so a product hand-rolled a `Pressable` to get one — and with it a different
  typography: Barlow Condensed at the display role, whose −0.055em tracking made the
  label read visibly cramped beside every real button in the app. The component is
  what decides how an action looks, and the way to keep that true is for it to cover
  the case rather than for the case to go around it.

  The icon is always decorative. The label already names the action, and announcing
  both would make every button read twice to a screen reader.

- bc65ab2: `Button`'s label moves to `control md`.

  It was set two steps below the names it sits next to. On the routine editor the
  exercise is drawn at 16 and «Añadir ejercicio» right underneath it at 14, which reads
  as a smaller, lesser thing rather than as the action on the list above it — and a
  button is not secondary to the rows it acts on.

  `Badge` also holds its label to one line and may shrink. It exists for one or two
  words scanned in a dense row; a wrapped badge turns the row it labels into two rows,
  which is the layout bug it was introduced to avoid.

- 0490a4a: Dos piezas que una tarjeta grande necesitaba y no existían.

  `color.accent.edge` es el filo de una tarjeta que **es** la pantalla y no una fila
  dentro de ella. `accent.tonalBorder`, al 22 %, deja que una tarjeta de trescientos
  puntos se deshaga contra el lienzo; `border.accent`, opaco, la convierte en un botón.

  `gradient.surfaceDeep` es la superficie de esa tarjeta: tinta con el frío de la marca,
  **no** una superficie de acento. No gasta la única que `Ink & Signal` permite por
  pantalla, y varias pueden convivir — un carrusel de tarjetas es justo ese caso. Sin el
  degradado, una tarjeta de ese tamaño con un relleno plano se lee como un agujero.

- 0490a4a: `ContentRow` is the row of a library: it reports a thing instead of choosing it.

  `SelectableRow` carries `selected` and answers as a checkbox, which is right for a list
  somebody is picking from and wrong for the person's own routines and programmes. Bending
  it would mean a required `selected` that is always false — a lie the screen reader
  repeats on every row.

  Three lines, and the third is the one worth having: `note` states where the thing lives
  —«En Fuerza básica», «Sin programa»— in the accent, so it reads as a link between two
  things rather than more description. Its `quiet` tone is for the absence of that fact,
  which is still worth saying and is not an alarm.

  `trailing` is the difference between reading and acting. A chevron says the row opens;
  an action is a second target inside it and takes its own label, because «más opciones»
  on nine identical rows tells a screen reader nothing.

- 46ac88e: `CoverTile` gana el tamaño `xs`, de 44 puntos.

  Una fila cuya altura es la del azulejo se quedaba en 56 porque no había nada más
  pequeño, y la lista salía más alta de lo que su contenido pedía. 44 es además el suelo
  táctil de iOS, así que la versión pulsable sigue siendo cómoda de tocar. La esquina baja
  a 14 con la caja: los tres tamaños tienen que leerse como la misma forma, no como tres.

- 44c2445: `CoverTile` is the square a thing shows itself in, including when it has nothing.

  `Monogram` is the letter a routine falls back to; this is the place that letter, a
  picture or a drawing all sit in, so a list keeps the same shape whatever each row
  happens to have. A row with artwork and a row without stay the same row.

  The picture is `children` and it bleeds to the tile's own edges, for the reason
  `SelectableTile` already gives: the Design System knows nothing about a product's
  assets and must not learn one. A `source` prop would mean either bundling images into
  the library or inventing a path convention for whoever consumes it.

  Empty is drawn rather than left blank. A tile with nothing in it is an invitation —
  this is where a cover would go — so it keeps its outline and dims it instead of
  collapsing and leaving the row ragged. That is the opposite call from `SelectableTile`,
  which shortens without a picture: there the height exists to hold a photograph, and
  here the square is the component.

  It is pressable only when given something to do. Without `onPress` it is a picture and
  is announced as nothing at all, because the name it stands for is always drawn beside
  it.

- 46ac88e: Las dos piezas que una fila con «Duplicar» y «Eliminar» necesitaba y no existían.

  `Button` gana la variante `danger`. El color ya estaba —`status.danger` sobre
  `status.onStatus`, el mismo par que el adaptador web pinta como `destructive`— y lo
  que faltaba era el control: sin él, borrar se dibujaba como un `ghost` y se leía
  igual que cualquier otra opción secundaria de la pantalla.

  Es un relleno plano y **no** el degradado de acento. `gradient.tsx` gasta la única
  superficie de acento que `Ink & Signal` permite por pantalla en una señal, y un
  borrado no lo es: es un control normal que además es rojo.

  `duplicate` entra en el catálogo como `Copy`. `add` empieza en blanco y `edit`
  cambia lo que ya está; hacer una segunda cosa a partir de la primera es otro acto y
  DT-008 no deja que un producto decida su glifo por su cuenta.

- bc65ab2: `TextField`'s label is set in the control role, sentence case.

  It was the last uppercase micro-label left on a surface somebody reads rather than
  scans. `label` carries 0.16em of tracking, which is what makes a three-letter chip
  legible and what pulls «Ponle un nombre» apart at 12px into six separate words.

  `control` is the face the rest of the library already names things with —
  `SelectableRow`, `SelectableTile` and `DisclosureButton` all moved to it — so a form
  field asking for a name now looks like the rows that will display it.

- 5ff339c: A card can be turned over.

  `flip` joins the icon catalogue: circling arrows for a control that shows the other
  side of something. Lucide has no two-sided glyph, so `RefreshCw` carries it, matching
  what the canvas draws with Phosphor's `arrows-clockwise`.

  `IconButton` gains `shape`. A control laid over content — the corner of a card, over a
  photograph — reads as part of that card when it shares its corner radius and as a
  floating bubble when it does not. `round` stays the default, and neither the size nor
  the touch reach changes with the shape.

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

- 78e321a: `IconButton` — a round action carried by a glyph alone.

  Three screens had each drawn their own circle for closing, going back and opening
  notifications, which is three sizes, three borders and three hit areas of the same
  control. It resolves to the platform touch target rather than to whatever a canvas
  happened to draw, and `accessibilityLabel` is required with no way to opt out: an
  icon-only control says nothing to a screen reader without one, and
  `docs/ACCESSIBILITY.md` makes that a launch condition.

  Its `solid` variant carries the accent gradient, the same as `Button`'s primary
  variant. `gradient.signal` is the token for primary CTAs, and a round tick that
  commits a screen is one — painting it flat made the same affirmative act look one way
  when it was a circle and another when it was a labelled pill. The conversion from the
  token to what `LinearGradient` wants now lives in one place, `accent-gradient`, so a
  third control cannot disagree with the first two.

- 0490a4a: `InlineAlert` se puede quitar: tocándolo, o solo pasados unos segundos.

  Un fallo que se puede reintentar no tiene por qué quedarse en pantalla hasta que alguien
  recargue. Con `onDismiss` el aviso entero se vuelve el blanco —una equis de doce puntos
  sobre un mensaje de una línea es peor blanco que la línea— y empieza a contar seis
  segundos, generosos a propósito: uno que se va antes de que termines de leerlo es un
  aviso que no se dio.

  Sin `onDismiss` se comporta como siempre, que es lo correcto cuando explica por qué un
  control está bloqueado: ahí el mensaje tiene que seguir mientras el bloqueo siga.

  El temporizador está atado al mensaje, así que uno nuevo empieza de cero en vez de
  heredar lo que le quedaba al anterior.

- bd7b7b7: Add `Chip` and `Stepper` to the React Native adapter, and four icons.

  `Chip` is the pill a filter row and an option sheet are both made of: a word, a
  selected state carried by the accent, and a target big enough to hit while walking.
  `Stepper` is a small whole number adjusted by one, with the bounds disabling the
  targets rather than clamping silently — a `+` that keeps answering the same number
  reads as broken.

  New icons: `rest` (Moon), `locked` (Lock), `explore` (Compass) and `subtract`
  (Minus). `subtract` exists because `remove` is a trash can: it deletes a thing,
  while a stepper takes one away from a number. Those are different acts and a
  stepper drawn with a trash can invites somebody to delete the programme.

- 0866811: `Monogram` marks a thing that has no picture.

  A routine somebody wrote has a name and nothing else, and in a week of seven cells
  there is no room for a name anyway. The first letter does the work a thumbnail does
  elsewhere: it makes two rows tellable apart at a glance and makes the same routine
  recognisable in the grid and in the list under it.

  It is neither an avatar nor a `Badge`. It borrows an avatar's circle, but an avatar stands for a person and falls back to
  initials when a photograph is missing; nothing here ever has a photograph. A badge
  states a fact in words. A monogram carries no meaning at all, only identity — its
  whole job is to be the same mark every time for the same name.

  The mark is derived from the name rather than passed in, so two callers cannot disagree
  about it, and it skips leading digits: a routine called «3 días fuerza» marked with a
  `3` reads as a position in a list rather than as a name. Like `Badge` it takes a
  semantic tone and never a colour, and it is drawn tonally — seven filled blocks in a
  row of days would stop the week reading as one thing.

- a19c9c8: Seventeen more icons, so a routine cover has something to choose between.

  Twelve was enough to prove the idea and not enough for somebody with fifteen routines to
  tell them apart. The new ones keep saying what a routine is **about** rather than what it
  is done with: `arms`, `endurance`, `pace`, `energy`, `focus`, `recovery`, `morning`,
  `evening`, `cold`, `outdoor`, `route`, `pool`, `team`, `record`, `favourite`, `light` and
  `countdown`.

  Three distinctions worth keeping rather than collapsing into a neighbour. `recovery` is
  the easy day after a hard one and `rest` is a night. `pool` is a ladder into the water
  where `swim` is open waves. `countdown` is time running out, `interval` is a count
  somebody started, and `time` is a clock saying what time it is.

- 21f9e91: Add `StepList`: an ordered set of instructions, each numbered in a marker of its own.

  The marker is deliberately not a chip. A chip on the same screen is pressable and says
  so with an accent border; a marker carries the accent only on the numeral and keeps a
  subtle border, so a sequence is never mistaken for a set of controls.

  It owns the alignment, which is what a product kept getting wrong by hand: the numeral
  is set in the condensed face and leads tighter than the body text beside it, so the row
  stays top-aligned and the text drops by half the difference. Centring the row instead
  drifts the marker into the middle of a three-line step, where nothing begins.

- 21f9e91: Add `Tabs`, the native counterpart of `@allfitone/react/tabs`: a strip of named views
  with one active, marked by an accent line riding on the hairline under the labels.

  It renders the labels and reports the press; the panel stays with the screen, so a
  screen keeps deciding whether an unseen panel holds its scroll position and its
  request. A tab carries a word and nothing else: a count beside the label reads as an
  ordinal rather than a quantity.

  `activeTabIndex` ships alongside as `./tab-selection`: a value matching no tab marks
  nothing rather than falling back to the first, which would draw a strip that disagrees
  with the panel below it.

- b8ee7c3: `NumberField` takes a number by typing, where `Stepper` takes one by nudging.

  The two are a pair and the split is about distance, not taste. A stepper is right for
  a value that moves from where it already is — weeks in a programme, repetitions from
  eight to nine. It cannot reach a weight: nothing to 60 kg in plates of 2.5 is
  twenty-four presses, and a routine's sets are entered from scratch every time.

  Two decisions worth knowing:

  - **Empty answers `undefined`, never zero.** On a prescription a zero is something
    somebody meant — bodyweight, no rest — and a control parked at zero says it on
    their behalf. The library already draws that line in `target_rest_seconds`; this
    keeps it in the control that captures it.
  - **The text is held until focus leaves.** The number is reported as it parses, so a
    «6» on the way to «60» is not rewritten mid-keystroke, and a value out of range
    leaves the last good one instead of clearing the row.

  A comma is read as a decimal separator, which is what half the world types and what
  `Number` alone reads as not-a-number.

- 16cf99d: `PageDots` puede seguir el dedo.

  Hasta ahora la píldora se movía cuando el mazo decía en qué página había aterrizado, y
  ese aviso llega con `onMomentumScrollEnd`: después de que el gesto terminó. Se lee como
  demora, no como movimiento.

  `at` es un `SharedValue<number>` de Reanimated con un índice fraccionario —`1.37` a un
  tercio del camino entre la segunda tarjeta y la tercera—. Con él, cada punto resuelve su
  ancho y su color desde la distancia a ese índice dentro de `useAnimatedStyle`: una vez
  por cuadro, en el hilo de UI, sin estado de React y sin nada que se programe de vuelta
  hacia él mientras el dedo está abajo.

  No es otra regla, es la de siempre: un solo valor manda sobre toda la fila, y el índice
  entero resultó ser el caso particular del fraccionario. Sin `at`, el componente se
  comporta exactamente como antes. `active` se pasa en los dos casos, porque es lo que la
  fila dice en voz alta y una posición hablada no necesita un valor por cuadro.

  `reduceMotion` se honra en los dos caminos igual: se conserva el cambio y se quita el
  viaje. En el continuo la distancia se mide contra la página más cercana, así que la
  píldora salta a su sitio en vez de estirarse entre dos.

  Sigue animando `width` y no `scaleX`, que es donde eso es lo correcto: escalar una
  píldora de cuatro puntos sobre un eje le convierte las esquinas en óvalos.
  `react-native-reanimated` entra como `peerDependency`.

- 85360e3: Añade el icono `pause`.

  Moving content that starts on its own and loops has to be stoppable — WCAG 2.2
  success criterion 2.2.2, and DT-010 makes AA the launch baseline. The first surface
  that needs it is the exercise demonstration in Space, which loops indefinitely.

  It is its own name rather than a state of `start`: a control that stops something is
  a different act from one that begins it, and an accessible name cannot be derived
  from a glyph that means the opposite.

- 969bb4c: `Screen` draws the ambient backdrop, so one product has one ground.

  The blooms and the dot grid used to be mounted screen by screen, which left the
  sparse screens — welcome, sign in, onboarding — on one ground and everything else
  flat. That is the disagreement about what the canvas is that `Screen` exists to
  prevent, one layer up, and the seam showed on walking from onboarding into the
  app.

  It is on by default; `ambient={false}` is for a screen whose own imagery is the
  ground.

  The dot grid does not come with it. `AmbientBackdrop` takes `dots` (still true when
  asked for directly) and `Screen` takes `dots`, off by default: the grid belongs to
  the screens with room to spare — welcome, sign in, onboarding — and on a screen of
  dense reading it puts a pattern between the eye and the text. Those screens keep
  the wash, which carries the same colour without the texture. It is drawn outside the safe area and outside the inset, so it reaches the
  notch and both margins — mounted by hand inside the padded box it was inset by the
  padding and left unpainted strips down the sides.

  The dark wash is also dimmer — roughly four tenths off each bloom. The canvas is
  already near black, and the wash was lifting it toward the same muted turquoise the
  cards, the tiles and the hairlines already sit in, so on a full screen everything
  fell into one band of colour and nothing read as being in front. The ground has to
  be where nothing happens.

- a19c9c8: Eight icons for what a routine is about.

  A routine's cover says what kind of training it is, not what it is done with:
  `run`, `cycling`, `interval`, `cardio`, `burn`, `mountain`, `mobility` and `swim`,
  alongside `training`, `freestyle`, `level` and `time`, which already existed.

  Two of them are distinctions worth keeping rather than collapsing. `cardio` is the
  heart working and `heart` is the organ — both appear on the same screen. `interval` is
  a count somebody started and `time` is a clock saying what time it is.

  `mobility` is a flower because the prototype draws a yin-yang and Lucide has none;
  borrowing a symbol that carries its own meaning is worse than saying calm plainly.

- 6bbe4ed: `SelectableRow` carries a still preview, and becomes a row rather than a card.

  A name is not enough to place a thing somebody has never seen — picking an exercise
  from a list of four hundred is the case that forced it. The row owns the box, its
  ground and its place in the row; what goes inside is the consumer's, because the
  artwork is remote and animated and neither belongs in a component library.

  Three things followed from putting a picture in it, and all three were measured on a
  real screen rather than argued:

  - **The mark rides on the picture.** A thumbnail small enough to sit beside an empty
    checkbox was too small to recognise anything in, and the two of them spent the row's
    leading edge twice. The badge is drawn only when the row is on, the way
    `SelectableTile` already reported selection; a row with no preview keeps the mark in
    its own column, because then nothing else would say the row can be chosen.
  - **The card is gone.** Each row bordered, filled and rounded read as four hundred
    boxes instead of one list, and the frames took the attention the pictures were put
    there to get. A hairline separates one row from the next and nothing else does.
  - **The name holds one line, in sentence case, in the control face.** Uppercase turns
    a real name into something to decode rather than read, and a name that wrapped while
    its neighbour did not gave every row a different height — which is what made a long
    list look broken. The condensed roles all track negative, which closes the counters
    at the size a row is read; `control` is the one face that is both heavy enough to
    lead a row and set at its natural width. It is wider, so the size is held at 16 —
    past that, most of a four hundred name catalogue reaches the ellipsis.

- 85360e3: `SelectableRow` can carry a secondary action.

  Picking a thing and reading about it are different intents, and a row that did both on one tap would do the wrong one half the time. `action` renders its own 44 pt target at the trailing edge — DT-010 measures what the finger can hit, not the glyph — with its own accessible name, while the row keeps its own.

  Nothing is nested: a `checkbox` containing a second, unnamed control leaves a screen reader announcing one thing and doing another.

- 78e321a: `Scrim` gains `onset`, and ramps through two intermediate stops instead of going
  straight from clear to opaque.

  A linear fade reads as a band with an edge you can point at. Ramping the alpha
  ahead of the geometry is what makes it read as light leaving the photograph,
  which is what a scrim is for. `onset` lets a caller say where the image stops
  being untouched; it defaults to where it always was.

- 44c2445: `SegmentedControl` picks one of a few views, drawn as one track.

  It is not `Tabs`. Tabs partition a subject that stays on screen: the labels sit on a
  hairline and a mark rides under the active one, which is right when the panel below is
  the page. This is a control — it sits inside a sheet or above a grid, it is small, and
  what it changes is the thing directly under it.

  `Tabs` warns that drawing tabs as pills promises multi-selection. That is true of
  separate pills, which is what `Chip` already is. A segmented control is not separate
  pills: the segments share one track with no gaps, and that containment is what says
  «one of these». The segments are equal width so the control does not resize when the
  words change.

- 6abaeeb: Three controls for choosing from a set: `SelectableRow`, `SelectableTile` and `DisclosureButton`.

  `Chip` is a word and `Checkbox` is the affirmation of a sentence, drawn in body text. Neither fits a thing being chosen from a list of things, which needs a name and a line describing it, or a thing recognised by sight before it is read.

  - **`SelectableRow`** — a mark, a name and an optional caption. The whole row is the target, because a 22 pt mark is under what DT-010 asks for and shrinking the reach to it would make the name decoration.
  - **`SelectableTile`** — a picture, a name and a count. The picture is `children`: the library knows nothing about a product's assets and must not learn, so there is no `source` prop and no path convention imposed on the consumer. The count renders in the `data` role, so a grid does not jitter as its numbers change. The picture runs to the tile's own edges: a smaller one floating inside read as a photograph cut out and pasted on, two rounded rectangles with the artwork's ground visible as a second surface. A tile given no picture is shorter rather than empty, because keeping the height draws a void with a word at the bottom of it — and a grid where some things have artwork and some do not should read as incomplete, not as broken. The name is sentence case in the control role and the count is not bold: a number that shouts as loud as the thing it counts is a number nobody reads past.
  - **`DisclosureButton`** — a label, the value it is currently set to, and a tap that opens the screen that sets it. The value is part of the control and its accessible value, so nobody has to open it to find out what it is doing.

  All three carry `checkbox` or `button` semantics honestly: several `SelectableRow` or `SelectableTile` can be on at once and nothing lands until the set is applied, while `DisclosureButton` chooses nothing and only navigates.

- 495a48f: A sheet rises over the keyboard instead of sitting under it.

  A sheet is anchored to the bottom edge, which is exactly where the keyboard appears, so any sheet holding a field was covered by the thing it asked for: Space's exercise search left one result visible once the field took focus.

  The panel now lifts by the keyboard's height and its cap shrinks by the same amount, so a tall sheet does not run off the top. The lift is a transform composed with the entrance rather than a second one beside it, and the home indicator is no longer reserved while the keyboard covers it. The content wrapper shrinks rather than overflowing the cap.

  `resolveSheetGeometry` is exported from `@allfitone/react-native/sheet-geometry` so the arithmetic can be asserted outside Metro.

- 44c2445: A sheet's title is read, so it is set in `control` and in sentence case.

  It was the condensed display face in capitals. That face tracks tightly enough that a
  phrase in it reads as a sign rather than as a sentence, and a sheet's title is a phrase:
  «Portada de la rutina», «Descanso entre series». Display stays for the editorial moments
  that are one or two words.

- c22cb2e: `Stepper` can say its number in words, and fill the row it leads.

  A rest is counted in seconds and read in minutes. The control held both — `90` on
  screen, `90` announced — and «90» is not what anybody calls a minute and a half. It
  now takes a `format`, and what a screen reader says is what is drawn rather than the
  raw figure underneath.

  `caption` adds the quiet line under the value, for what the number is _of_, and
  `grow` lets it lead a sheet instead of sitting at its own width. A formatted value
  changes length as it counts — «1 min 30 s» one press, «45 s» the next — so when it
  grows, the value takes what the two targets leave rather than a fixed width that one
  of those readings would overflow.

- fd48b45: `TextField` gana `hideLabel`.

  Es el mismo trato que `Sheet` hace con `hideTitle`: se deja de dibujar la etiqueta y se
  sigue anunciando. Existe para el campo cuyo marcador ya dice lo que es —un buscador
  encima de la lista que filtra—, donde la etiqueta repite el marcador y cuesta una línea
  en un panel que anda corto de ellas.

  Lo que no cambia es el nombre que oye quien no lo ve: `accessibilityLabel` sigue ahí, y
  `aria-labelledby` se retira cuando no hay etiqueta a la que apuntar, porque apuntar a algo
  que no se dibuja deja el campo sin nombre en vez de con dos.

- 01108c0: `text.success` joins the palette, and `Text` can ask for it.

  Text had a colour for something going wrong and none for something going right,
  so a screen marking finished work had to reach past the theme for a hex — which
  is exactly the drift DT-008 exists to stop. The light theme uses the deep
  variant, because the dark-theme green does not carry AA on a near-white ground.

- 78e321a: The React Native theme now carries `motion`.

  Durations, easings and springs were already tokens and had no way to reach a
  screen, so the first product that animated anything had to hardcode a number.
  That is the same drift DT-008 stops for colour, one axis over.

- 4e2d694: `Veil`, para poner palabras encima de una imagen sin apagarla entera.

  No es un `Scrim` girado. El scrim cuelga del borde donde la imagen termina y allí es
  **transparente**: se funde con el lienzo para que no se vea la costura. El velo cuelga
  de su borde y allí es **opaco**: es una banda de superficie tendida sobre la imagen que
  se deshace hacia dentro, y lo que compra es contraste para el texto que va encima.

  Son polaridades opuestas, y por eso no se resolvió dándole una dirección al scrim: un
  componente cuyo significado depende de hacia dónde lo apuntes acaba significando dos
  cosas. `edge` dice de qué lado cuelga, `extent` cuánto entra y `hold` qué parte de ese
  recorrido se queda opaca antes de empezar a desaparecer.

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

### Patch Changes

- 0490a4a: La ranura del arte de `ContentRow` pasa de 48 a 56 puntos.

  `CoverTile` en su tamaño pequeño mide 56, que es justo lo que estas filas le pasan. Con
  la ranura en 48 y recortando, el azulejo perdía su borde por los cuatro lados: parecía
  que el componente no lo dibujaba, y lo dibujaba.

- e8284c2: The `data` role renders tabular figures, which its token already promised.

  It exists for metrics, timers and KPIs and says so: _"large data numerals render in
  the condensed display face with tabular figures for athletic character"_. Nothing
  was setting `fontVariant`, so the figures stayed proportional — and a running clock
  reflowed on every tick, because `00:09` and `00:10` are different widths and the
  whole row shifts under the eye reading it.

  The validator now asserts it, and asserts that no other role asks for it: tabular
  figures cost width and are wrong under prose.

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

- 792018d: `PageDots` animates between pages.

  It is the only thing on the deck that animates, and that is deliberate: the pages
  already slide, and a parallax on top of them made the carousel feel slower rather than
  deeper.

  One `Animated.Value` holds the active index and every dot reads its own width and
  colour off the distance to it, so there is a single animation rather than six fighting
  each other — and a fractional index would work unchanged if a deck ever wanted the pill
  to follow the finger.

  `width` rather than `scaleX`, which is the one case where that is right: scaling a
  four-point pill along one axis smears its corners into ovals. Six of them relaying out
  once per page is a single layout pass, not a per-frame cost, which is what makes the
  non-native driver acceptable here.

  Takes `reduceMotion` like `Sheet` does, and honours it by keeping the change and
  dropping the travel: which page you are on is state the row exists to report.

- 16cf99d: El badge `quiet` deja de ser translúcido.

  Usaba el relleno de la `chip` de vidrio, que está pensada para ir con desenfoque
  detrás: al cuarenta por ciento de opacidad, sobre una fotografía clara, la píldora
  desaparecía y el rótulo quedaba flotando sobre la imagen. Ahora se rellena con el
  color del lienzo, que es lo que el diseño dibuja para el chip del día sobre la
  portada de una rutina.

  El filo y la letra no cambian, así que donde ya iba sobre una superficie plana se ve
  igual de tranquilo; lo único que cambia es que ahora también se ve sobre una foto.

- 414f2f3: A `reorder` glyph, for the grip a row is dragged by.

  Neither `panel` nor `more` could stand in: both open something, and this one is held
  rather than pressed. It is the affordance a list needs before it can be reordered at
  all — without it the only way to move an exercise is a menu item that moves it one
  place at a time.

- ae60561: Touching nothing in particular puts the keyboard away.

  A `ScrollView` can be told to do this for the part of a screen it covers, but a screen is
  rarely only a scroll view. A form under a header that stays put left the keyboard up with
  no way to dismiss it but the return key — which a name field does not have. It belongs in
  `Screen` for the same reason the top inset does: it is every screen's complaint, not one
  screen's.

  It observes the touch rather than claiming it. `onStartShouldSetResponder` runs bottom-up
  and stops at whatever answers `true`, so a field, a button or a row being dragged is asked
  first and this is never reached. Answering `false` means it never becomes the responder
  either: nothing is intercepted, no gesture is blocked, and no control is added to the
  accessibility tree.

- 0490a4a: `SegmentedControl` crece de 40 a 48 puntos.

  Estaba justo por debajo del suelo de 44: con los cuatro puntos de relleno de la pista,
  cada segmento medía menos que el mínimo que se puede tocar con comodidad. Es un control
  que parte una pantalla entera en dos mitades y se usa de pie, así que el blanco tiene que
  ser cómodo sin contar con que el dedo acierte el centro.

- 78e321a: `Sheet` now actually animates out, and slides its own height rather than the
  screen's.

  `visible` was handed straight to `Modal`, so dismissing unmounted the tree on the
  same frame and the exit animation never ran — the panel vanished instead of
  closing. It now stays mounted until the animation reports it finished.

  The travel distance was 85% of the display whatever the sheet contained, so a
  short one covered several hundred points in a fraction of a second and arrived
  like a slam. It is measured now, and the panel fades with the backdrop.

- e990493: Add `target` to the icon catalogue.

  The session screen marks what a set was aiming at, and the catalogue had nothing
  that meant it. `level` is a band, `activity` is movement, and borrowing either
  would have made the icon mean two things. DT-008 says a product never decides
  what an icon means, so the one that was missing is created here.

- 01108c0: `withAlpha` and `transparent` restate a token colour at a different opacity.

  A fade has two ends, and the one that is "not there" still has a colour. Reaching
  for the keyword `transparent` makes it transparent _black_, so the ramp travels
  through a darkness that is in no palette — a dirty band over imagery, and a colour
  nobody chose in the middle of an animation. `Scrim` already worked around this by
  appending `00` by hand; now there is one named way to do it, and it refuses
  anything that is not a token colour rather than producing a plausible wrong one.

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

## 0.6.0

### Minor Changes

- 96449c1: Add `Checkbox`, a statement the person affirms, on the
  `@allfitone/react-native/checkbox` subpath.

  The role is `checkbox` rather than `switch`, deliberately. A switch announces
  "on/off" and promises an effect the moment it moves, while these affirmations
  land when the form is submitted — so a switch would move and do nothing. An
  affirmation is also an act rather than a preference, and preferences are the
  things people flip without reading. What was rejected is the platform checkbox's
  appearance, not its semantics: the mark fills with the accent colour, which Ink &
  Signal already reserves for selection, so an affirmed statement reads the same
  way a filled `CodeField` box does.

  The label is required and always drawn, because a mark without the sentence it
  affirms means nothing, and the sentence is the part a copy review has to see. It
  doubles as the accessible name. The mark keeps a constant border width for the
  reason `TextField` documents, and stays aligned to the first line so a statement
  that wraps does not push it out of place.

- 96449c1: Add `Sheet`, a panel that rises from the bottom edge, on the
  `@allfitone/react-native/sheet` subpath.

  Ported from the Web `Sheet`. The decisions carry over — anchored to the bottom,
  capped at 85% of the viewport, rounded on the leading corners only, over a dimmed
  backdrop — while the compound `Sheet/SheetContent/SheetHeader` API does not:
  React Native has no portal to compose against, and every native component in this
  package is a single one with props. Bottom only, because the Web variant's side
  panels suit a desktop pane and nothing on a phone.

  It exists for the exchanges that are not screens: a confirmation with nothing to
  do next, or a short form that must not lose the screen behind it. Routing those
  forces a destination the flow already had.

  Motion reads the semantic tokens and honours reduced motion, which defines a step
  at zero duration — a panel that slides anyway is what that setting exists to
  prevent. The backdrop and the Android back gesture both dismiss, so a sheet that
  carries a decision owns confirming it.

## 0.5.1

### Patch Changes

- Updated dependencies [36f5bf4]
  - @allfitone/brand@0.3.0

## 0.5.0

### Minor Changes

- c8afb63: Add `CodeField`, segmented entry for a short numeric code, on the
  `@allfitone/react-native/code-field` subpath.

  The boxes are drawn beneath a single transparent input rather than one input per
  digit: a field per digit has to simulate backspace across fields, only one of
  them receives the platform's one-time-code autofill, and a screen reader is left
  with six unlabelled inputs instead of one.

  The component sets no `returnKeyType` and does not accept one, because the iOS
  number pad has no return key and requesting one makes the platform float a loose
  button over the layout.

### Patch Changes

- 3c98648: Size every brand mark from its artwork when only one dimension is given.

  `BrandLogo`, `BrandLogoCarrier`, `BrandWordmark`, `BrandLockup`,
  `ProductWordmark` and `ProductLockup` each carried an independent default for
  `width` and `height`. Passing only one left the other at a default sized for a
  different scale, so the box came out a different shape from the `viewBox`. SVG
  does not stretch to fill it — the default `preserveAspectRatio` fits the art
  inside and centres it, so the mark rendered at the correct size but inset by half
  the slack, and stopped lining up with the text beside it.

  Nothing looked broken, which is why it survived review: the mark was never
  squashed, only nudged. Found by eye on a welcome screen where `height` alone was
  set.

## 0.4.0

### Minor Changes

- 2fc1c5d: Add the themed primitives React Native surfaces need to compose a screen without
  reaching for raw tokens: font loading, a theme context, `Text`, `Button`,
  `Screen`, `SignalBlock`, `Scrim`, `GlassPanel` and `BrandEntrance`.

  Font loading moves into the design system. The token package names Barlow
  Condensed and Manrope but ships no font files, and React Native falls back to the
  platform font **silently** when a family was never registered — the whole visual
  identity switches off without an error. Leaving that to each product also allowed
  two surfaces to load different weights of the same family.

  Roles that lead tighter than their own em box now pad the deficit back. `display`
  leads at 0.82, which the web lets overflow the line box; React Native crops the
  glyph to it instead and cut the tops off capitals. The padding restores the
  ascender without loosening the spacing between lines.

  `BrandEntrance` exists because clipping the fill needs the logo geometry, and the
  foundations keep products out of `@allfitone/brand`. Built in a product it could
  only clip to a rectangle, and the fill edge ran past the silhouette.

  `GlassPanel` is the first consumer of the `material` tokens. Note that
  `docs/FOUNDATIONS.md` reserves glass for floating chrome; the component does not
  enforce that, because the boundary is a live product decision.

  New peer dependencies: `expo-font`, `expo-linear-gradient`, `expo-blur` and
  `react-native-safe-area-context`. The two Google Fonts packages are direct
  dependencies because they carry only assets.

  `Text` omits the underlying React Native `role` prop. Its value set intersects
  the typographic roles at exactly `"heading"`, which silently narrowed every other
  role away. `accessibilityRole` is unaffected.

### Patch Changes

- Updated dependencies [3bbaac1]
  - @allfitone/tokens@0.2.0

## 0.3.0

### Minor Changes

- 760c84e: Add outlined Allfit Space, Studio, and Backoffice wordmarks plus Web, React Native, and static SVG lockups that temporarily reuse the exact canonical Allfit One logo.

### Patch Changes

- Updated dependencies [760c84e]
  - @allfitone/brand@0.2.0

## 0.2.0

### Minor Changes

- abfe0f7: Make the semantic icon catalog authoritative across Web and Native, honor
  standard ARIA labelling, add tree-shakeable semantic React exports, and replace
  implicit numeric size and stroke overrides with validated explicit escape
  hatches.

### Patch Changes

- Updated dependencies [abfe0f7]
  - @allfitone/icons@0.2.0

## 0.1.1

### Patch Changes

- 4f7e001: Allow the platform adapters to consume compatible foundation package patches while npm versions, Git tags, and GitHub Releases are managed independently per package.
