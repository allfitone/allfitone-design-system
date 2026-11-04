---
"@allfitone/react": patch
---

Ghost and link buttons no longer show the browser's own button face.

The published stylesheet ships without Preflight, and neither variant set a background, so a `<button>` kept the user agent's light grey under near-white text: in Allfit Backoffice "Cerrar sesión", "Cancelar" and the menu toggle were nearly unreadable. Both variants are now `bg-transparent` at rest and still paint on hover and when expanded.
