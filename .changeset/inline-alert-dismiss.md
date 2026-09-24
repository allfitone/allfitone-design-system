---
"@allfitone/react-native": minor
---

`InlineAlert` se puede quitar: tocándolo, o solo pasados unos segundos.

Un fallo que se puede reintentar no tiene por qué quedarse en pantalla hasta que alguien
recargue. Con `onDismiss` el aviso entero se vuelve el blanco —una equis de doce puntos
sobre un mensaje de una línea es peor blanco que la línea— y empieza a contar seis
segundos, generosos a propósito: uno que se va antes de que termines de leerlo es un
aviso que no se dio.

Sin `onDismiss` se comporta como siempre, que es lo correcto cuando explica por qué un
control está bloqueado: ahí el mensaje tiene que seguir mientras el bloqueo siga.

El temporizador está atado al mensaje, así que uno nuevo empieza de cero en vez de
heredar lo que le quedaba al anterior.
