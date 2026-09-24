---
"@allfitone/react-native": minor
---

`Veil`, para poner palabras encima de una imagen sin apagarla entera.

No es un `Scrim` girado. El scrim cuelga del borde donde la imagen termina y allí es
**transparente**: se funde con el lienzo para que no se vea la costura. El velo cuelga
de su borde y allí es **opaco**: es una banda de superficie tendida sobre la imagen que
se deshace hacia dentro, y lo que compra es contraste para el texto que va encima.

Son polaridades opuestas, y por eso no se resolvió dándole una dirección al scrim: un
componente cuyo significado depende de hacia dónde lo apuntes acaba significando dos
cosas. `edge` dice de qué lado cuelga, `extent` cuánto entra y `hold` qué parte de ese
recorrido se queda opaca antes de empezar a desaparecer.
