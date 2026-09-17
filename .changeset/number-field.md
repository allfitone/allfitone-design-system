---
"@allfitone/react-native": minor
---

`NumberField` takes a number by typing, where `Stepper` takes one by nudging.

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
