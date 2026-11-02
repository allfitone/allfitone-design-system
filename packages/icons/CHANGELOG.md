# @allfitone/icons

## 0.5.1

### Patch Changes

- 6ef125e: Point repository, homepage and issue links at the renamed `allfitone` GitHub organization so npm provenance matches the publishing repository.

## 0.5.0

### Minor Changes

- 97db718: Add 32 food-group icons (egg, dairy, grain, fruit, coffee and more) and an optional `tracking` prop on `Text`, in em, that overrides a role's letter spacing from the consuming product without changing the default for anyone else.

## 0.4.0

### Minor Changes

- 50d45da: Add `image`, `download` and `share` to the icon catalogue. A share screen picks a
  picture, keeps the image on the device and hands it on; none of the three existed, so
  a product would have had to draw its own.

## 0.3.0

### Minor Changes

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

- 5ff339c: A card can be turned over.

  `flip` joins the icon catalogue: circling arrows for a control that shows the other
  side of something. Lucide has no two-sided glyph, so `RefreshCw` carries it, matching
  what the canvas draws with Phosphor's `arrows-clockwise`.

  `IconButton` gains `shape`. A control laid over content — the corner of a card, over a
  photograph — reads as part of that card when it shares its corner radius and as a
  floating bubble when it does not. `round` stays the default, and neither the size nor
  the touch reach changes with the shape.

- 3322feb: Add `weight`, `race` and `heart` to the foundation catalogue.

  The training-goal screen needs one icon per goal and three of them had no
  candidate: there was no scale, no finish line and nothing that says "stay where
  you are". `training` already covers building muscle and `activity` already covers
  getting fit, so only three are new.

  Names are semantic rather than descriptive of the glyph, as the rest of the
  catalogue is: `weight` is the goal of losing it, `race` is the goal of running
  one, and `heart` is holding a healthy state. A consumer never redefines what an
  icon means, so the meaning has to be settled here.

  `steady` on an equals sign was tried first and dropped. It said "unchanged"
  accurately and said nothing about health, and it was a near twin of
  `indeterminate`, which draws a minus for a checkbox that is neither on nor off.
  One catalogue should not make a reader tell those two apart at 20 px.

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

- 85360e3: Añade el icono `pause`.

  Moving content that starts on its own and loops has to be stoppable — WCAG 2.2
  success criterion 2.2.2, and DT-010 makes AA the launch baseline. The first surface
  that needs it is the exercise demonstration in Space, which loops indefinitely.

  It is its own name rather than a state of `start`: a control that stops something is
  a different act from one that begins it, and an accessible name cannot be derived
  from a glyph that means the opposite.

- e990493: Add `frequency` and `level`.

  The program detail screen states three facts about a program before anybody
  commits to it — how long it lasts, how often it asks for you, and who it is
  written for — and only the first had an icon. `history` was standing in for
  frequency, which is wrong twice over: it draws a clock winding backwards, and it
  already means "what you have done".

  `level` is a medal because a level is an attainment, not a rank in a list. It is
  the only icon in the catalogue that says "how far along you are", which is why it
  gets a name of its own rather than borrowing `race`, whose flag means a finish
  line somebody is training towards.

- 414f2f3: A `reorder` glyph, for the grip a row is dragged by.

  Neither `panel` nor `more` could stand in: both open something, and this one is held
  rather than pressed. It is the affordance a list needs before it can be reordered at
  all — without it the only way to move an exercise is a menu item that moves it one
  place at a time.

- a19c9c8: Eight icons for what a routine is about.

  A routine's cover says what kind of training it is, not what it is done with:
  `run`, `cycling`, `interval`, `cardio`, `burn`, `mountain`, `mobility` and `swim`,
  alongside `training`, `freestyle`, `level` and `time`, which already existed.

  Two of them are distinctions worth keeping rather than collapsing. `cardio` is the
  heart working and `heart` is the organ — both appear on the same screen. `interval` is
  a count somebody started and `time` is a clock saying what time it is.

  `mobility` is a flower because the prototype draws a yin-yang and Lucide has none;
  borrowing a symbol that carries its own meaning is worse than saying calm plainly.

- e990493: Add `start`.

  Beginning a training session is the single most important action in the app and it
  had no glyph: `activity` was the nearest thing and it draws a pulse line, which
  says "something is happening", not "begin".

  It is named for the action and not for the triangle, like the rest of the
  catalogue. Nothing else in the app starts anything, so when a second meaning for a
  play triangle appears — a video, a demonstration — it will need its own name rather
  than borrowing this one.

- e990493: Add `target` to the icon catalogue.

  The session screen marks what a set was aiming at, and the catalogue had nothing
  that meant it. `level` is a band, `activity` is movement, and borrowing either
  would have made the icon mean two things. DT-008 says a product never decides
  what an icon means, so the one that was missing is created here.

- b9d168c: Add the ten icons the Space app shell needs: `home`, `history`, `next`,
  `notification`, `create`, `camera`, `freestyle`, `checklist`, `nutrition` and
  `progress`.

  Space's Today screen is the first one with a tab bar, quick accesses and cards
  that lead somewhere, and none of those had an icon here. The product had been
  borrowing near misses — `heart` for food, `add` for a camera, `forward` for a
  chevron — which is exactly the drift a shared catalogue exists to prevent, and it
  was visible on the phone: the screen did not look like the design it was built
  from.

  Names stay semantic rather than descriptive of the glyph, as the rest of the
  catalogue is. `next` is the affordance of a row that opens something, not
  "chevron-right". `freestyle` is training without a plan, which is why the same
  icon serves both the shortcut and the card. `progress` is a person's own progress
  over time and is deliberately distinct from `business`, which is an organization's
  metrics: they draw differently and they mean different things to different people.

  `create` sits beside `add` on purpose. `add` puts one more of something into a list
  that already exists; `create` starts a thing that did not exist before, which is
  what "crear el mío" does with a training program.

  `home` is added even though `overview` was standing in for it. `overview` is a
  dashboard of panels and reads as an admin surface; the first tab of a phone app is
  a house.

## 0.2.0

### Minor Changes

- abfe0f7: Make the semantic icon catalog authoritative across Web and Native, honor
  standard ARIA labelling, add tree-shakeable semantic React exports, and replace
  implicit numeric size and stroke overrides with validated explicit escape
  hatches.
