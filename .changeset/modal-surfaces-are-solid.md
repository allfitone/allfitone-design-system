---
"@allfitone/react": minor
---

Dialogs, alert dialogs, sheets and drawers now sit on a solid surface instead of
the translucent glass material.

Glass composites against whatever is behind it, so its contrast is not a
property of the component: muted text inside a light-theme dialog measured
4.27:1 against the composited background, under the 4.5:1 WCAG AA minimum. The
material's own contract already reserved glass for floating chrome and gave
content surfaces a solid fill — this applies that rule to the modal family.

Floating chrome (select, combobox, dropdown menu, tooltip) keeps its glass.
