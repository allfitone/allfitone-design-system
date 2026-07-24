# Ink & Signal — dirección de arte v2

Abre [`ink-and-signal.html`](./ink-and-signal.html) en un navegador (doble clic, no necesita servidor: las fuentes van embebidas).

Es el concepto aprobado de la v2 del design system aplicado a **12 pantallas reales del producto** — 6 de Allfit OS (panel del profesional, web) y 6 de Allfit Space (app nativa React Native) — replicando el inventario funcional de factory-fitness (mismas columnas, estados y textos), en modo dark y light.

## Principios

1. **Tinta y señal.** Superficies sólidas de ink desaturado, sin bordes repetidos. Un solo bloque cyan degradado por pantalla (el "signal"): lo que importa ahora — el entreno de hoy, el timer de descanso, la clase destacada. Nada más compite.
2. **Glass solo para chrome.** El material translúcido (blur) se reserva para tab bars, top bars y overlays flotantes — nunca para cards de contenido.
3. **Tipografía con carácter.** Barlow Condensed en grande y mayúsculas para títulos y métricas (con cifras tabulares); la palabra clave en *itálica cyan*. Manrope para UI.
4. **Firma gráfica.** Línea de pulso (EKG) como motivo de marca, numerales fantasma outline, anillos con tick-marks tipo bisel deportivo, textura de puntos sutil en bloques cyan.
5. **Dark y light comparten tokens.** El bloque cyan funciona idéntico en ambos temas; el acento textual pasa de cyan (dark) a teal profundo (light) por contraste WCAG.

Los tokens que implementan esta dirección viven en `@allfitone/tokens` (`gradient`, `material`, paletas semánticas v2, `typographyRole.data`, `semanticRadius.action`).
