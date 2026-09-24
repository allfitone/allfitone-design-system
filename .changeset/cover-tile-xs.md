---
"@allfitone/react-native": minor
---

`CoverTile` gana el tamaño `xs`, de 44 puntos.

Una fila cuya altura es la del azulejo se quedaba en 56 porque no había nada más
pequeño, y la lista salía más alta de lo que su contenido pedía. 44 es además el suelo
táctil de iOS, así que la versión pulsable sigue siendo cómoda de tocar. La esquina baja
a 14 con la caja: los tres tamaños tienen que leerse como la misma forma, no como tres.
