---
"@allfitone/react-native": minor
---

`Badge` gana la variante `quiet`, para lo que se posa encima de una fotografía.

La variante sólida se rellena con el color del estado y se escanea en una tabla: es lo
correcto en una fila densa y lo equivocado sobre una imagen, donde un relleno opaco tapa
justo lo que hace funcionar la pantalla. `quiet` toma el material **`chip`**, que el
sistema ya reservaba para eso —«a la misma opacidad que el cristal del cromado, una
pastilla sobre una foto se lee como una calcomanía»— con el color del tono como tinta.

Y va en **caja baja**. «En curso» o «Sigue esta» se leen como una frase corta, no se
escanean como una etiqueta; las mayúsculas del `eyebrow` siguen siendo del badge sólido,
que es donde ganan.
