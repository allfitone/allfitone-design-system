---
"@allfitone/icons": minor
"@allfitone/react-native": minor
---

Añade el icono `pause`.

Moving content that starts on its own and loops has to be stoppable — WCAG 2.2
success criterion 2.2.2, and DT-010 makes AA the launch baseline. The first surface
that needs it is the exercise demonstration in Space, which loops indefinitely.

It is its own name rather than a state of `start`: a control that stops something is
a different act from one that begins it, and an accessible name cannot be derived
from a glyph that means the opposite.
