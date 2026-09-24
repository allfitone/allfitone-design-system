---
"@allfitone/react-native": patch
---

La ranura del arte de `ContentRow` pasa de 48 a 56 puntos.

`CoverTile` en su tamaño pequeño mide 56, que es justo lo que estas filas le pasan. Con
la ranura en 48 y recortando, el azulejo perdía su borde por los cuatro lados: parecía
que el componente no lo dibujaba, y lo dibujaba.
