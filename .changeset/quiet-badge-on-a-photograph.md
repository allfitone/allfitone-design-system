---
"@allfitone/react-native": patch
---

El badge `quiet` deja de ser translúcido.

Usaba el relleno de la `chip` de vidrio, que está pensada para ir con desenfoque
detrás: al cuarenta por ciento de opacidad, sobre una fotografía clara, la píldora
desaparecía y el rótulo quedaba flotando sobre la imagen. Ahora se rellena con el
color del lienzo, que es lo que el diseño dibuja para el chip del día sobre la
portada de una rutina.

El filo y la letra no cambian, así que donde ya iba sobre una superficie plana se ve
igual de tranquilo; lo único que cambia es que ahora también se ve sobre una foto.
