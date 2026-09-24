---
"@allfitone/icons": minor
"@allfitone/react-native": minor
---

Las dos piezas que una fila con «Duplicar» y «Eliminar» necesitaba y no existían.

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
