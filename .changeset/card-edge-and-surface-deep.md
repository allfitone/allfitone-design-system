---
"@allfitone/tokens": minor
"@allfitone/react-native": minor
---

Dos piezas que una tarjeta grande necesitaba y no existían.

`color.accent.edge` es el filo de una tarjeta que **es** la pantalla y no una fila
dentro de ella. `accent.tonalBorder`, al 22 %, deja que una tarjeta de trescientos
puntos se deshaga contra el lienzo; `border.accent`, opaco, la convierte en un botón.

`gradient.surfaceDeep` es la superficie de esa tarjeta: tinta con el frío de la marca,
**no** una superficie de acento. No gasta la única que `Ink & Signal` permite por
pantalla, y varias pueden convivir — un carrusel de tarjetas es justo ese caso. Sin el
degradado, una tarjeta de ese tamaño con un relleno plano se lee como un agujero.
