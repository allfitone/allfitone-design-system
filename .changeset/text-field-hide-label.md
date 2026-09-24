---
"@allfitone/react-native": minor
---

`TextField` gana `hideLabel`.

Es el mismo trato que `Sheet` hace con `hideTitle`: se deja de dibujar la etiqueta y se
sigue anunciando. Existe para el campo cuyo marcador ya dice lo que es —un buscador
encima de la lista que filtra—, donde la etiqueta repite el marcador y cuesta una línea
en un panel que anda corto de ellas.

Lo que no cambia es el nombre que oye quien no lo ve: `accessibilityLabel` sigue ahí, y
`aria-labelledby` se retira cuando no hay etiqueta a la que apuntar, porque apuntar a algo
que no se dibuja deja el campo sin nombre en vez de con dos.
