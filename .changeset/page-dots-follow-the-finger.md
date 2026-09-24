---
"@allfitone/react-native": minor
---

`PageDots` puede seguir el dedo.

Hasta ahora la píldora se movía cuando el mazo decía en qué página había aterrizado, y
ese aviso llega con `onMomentumScrollEnd`: después de que el gesto terminó. Se lee como
demora, no como movimiento.

`at` es un `SharedValue<number>` de Reanimated con un índice fraccionario —`1.37` a un
tercio del camino entre la segunda tarjeta y la tercera—. Con él, cada punto resuelve su
ancho y su color desde la distancia a ese índice dentro de `useAnimatedStyle`: una vez
por cuadro, en el hilo de UI, sin estado de React y sin nada que se programe de vuelta
hacia él mientras el dedo está abajo.

No es otra regla, es la de siempre: un solo valor manda sobre toda la fila, y el índice
entero resultó ser el caso particular del fraccionario. Sin `at`, el componente se
comporta exactamente como antes. `active` se pasa en los dos casos, porque es lo que la
fila dice en voz alta y una posición hablada no necesita un valor por cuadro.

`reduceMotion` se honra en los dos caminos igual: se conserva el cambio y se quita el
viaje. En el continuo la distancia se mide contra la página más cercana, así que la
píldora salta a su sitio en vez de estirarse entre dos.

Sigue animando `width` y no `scaleX`, que es donde eso es lo correcto: escalar una
píldora de cuatro puntos sobre un eje le convierte las esquinas en óvalos.
`react-native-reanimated` entra como `peerDependency`.
