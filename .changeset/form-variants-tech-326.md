---
"@allfitone/react-native": minor
---

Add the variants Allfit Space needs for its health-context, password and training screens, without changing how existing calls render, and three new components.

- `SelectableTile`: option card with `icon`, `caption` and `choice="single"` (announced as a radio).
- `Chip`: compact `size="sm"`; every label stays on one line, shrinking slightly before it wraps.
- `DisclosureButton`: `variant="field"` with an `actionLabel`, for a value chosen on another screen.
- `ContentRow`: `icon`, `iconTone`, `tag` and `tagTone`; new `ContentGroup` puts several rows on one card with hairlines.
- `InlineAlert`: optional `title` and `icon`, drawn on a tinted panel.
- `Button`: `quietDanger` variant for a destructive action that is not the screen's main one.
- `Stepper`: `size="lg"` with the value in the poster face.
- `TextField`: `trailing` action inside the field, such as «Mostrar».
- New `Switch`: an on/off whose effect shows on the screen at once; `Checkbox` stays for statements sent with a form.
- New `RecordCard`: one record read back whole — kind, the person's words, dated facts and origin.
- New `RequirementList`: requirements that light up as they are met.
