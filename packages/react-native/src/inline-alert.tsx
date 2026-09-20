/**
 * Inline status message for React Native surfaces.
 *
 * Sits with the control it refers to rather than floating over the screen, so a
 * message about two fields can live between them and belong to both. A sign-in
 * failure is the case that forces this: the message must not say which of the
 * two fields was wrong, because that reveals which addresses are registered.
 *
 * Colour is never the only carrier. The icon and the text say the same thing, so
 * the message survives forced colours and colour-blind vision.
 */

import { useEffect, useRef } from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { Circle, Path, Svg } from "react-native-svg";

import { Text } from "./text.js";
import { useTheme } from "./theme.js";

export type InlineAlertTone = "danger" | "warning" | "info" | "success";

export type InlineAlertProps = {
  readonly message: string;
  readonly tone?: InlineAlertTone;
  /**
   * Cuando se pasa, el aviso se puede tocar para quitarlo y se va solo pasados unos
   * segundos. Sin esto se queda, que es lo correcto cuando explica por qué un control
   * está bloqueado y el mensaje tiene que seguir ahí mientras el bloqueo lo esté.
   */
  readonly onDismiss?: (() => void) | undefined;
  /** Cuánto aguanta antes de irse solo. Sólo cuenta con `onDismiss`. */
  readonly autoDismissMs?: number;
  readonly style?: StyleProp<ViewStyle>;
};

/**
 * Bastante para leer una frase sin prisa, poco para no quedarse de adorno.
 *
 * Generoso a propósito: un aviso que se va antes de que alguien termine de leerlo es un
 * aviso que no se dio.
 */
const DISMISS_AFTER = 6000;

export function InlineAlert({
  message,
  tone = "danger",
  onDismiss,
  autoDismissMs = DISMISS_AFTER,
  style,
}: InlineAlertProps) {
  const theme = useTheme();
  const accent = theme.color.status[tone];

  // Leído por el efecto para que el temporizador no se reinicie cuando quien llama pasa
  // una función nueva en cada render, que es lo normal con una flecha en línea.
  const dismiss = useRef(onDismiss);
  useEffect(() => {
    dismiss.current = onDismiss;
  }, [onDismiss]);

  // Atado al mensaje: uno nuevo es un aviso nuevo y empieza a contar de cero, en vez de
  // heredar lo que le quedaba al anterior.
  useEffect(() => {
    if (onDismiss === undefined) return;
    const timer = setTimeout(() => dismiss.current?.(), autoDismissMs);
    return () => {
      clearTimeout(timer);
    };
  }, [message, autoDismissMs, onDismiss === undefined]);

  const body = (
    <View
      accessibilityRole="alert"
      style={[
        styles.base,
        {
          gap: theme.spacing[2],
          paddingHorizontal: theme.spacing[3],
          paddingVertical: theme.spacing[3],
          borderRadius: theme.semanticRadius.controlSmall,
          borderColor: accent,
          backgroundColor: theme.color.background.surfaceSubtle,
        },
        style,
      ]}
    >
      <Svg width={16} height={16} viewBox="0 0 24 24" style={styles.icon}>
        <Circle cx={12} cy={12} r={10} stroke={accent} strokeWidth={2} fill="none" />
        <Path d="M12 7v6" stroke={accent} strokeWidth={2} strokeLinecap="round" />
        <Path d="M12 16.5h.01" stroke={accent} strokeWidth={2} strokeLinecap="round" />
      </Svg>
      <Text role="label" size="xs" style={{ flex: 1, color: accent }}>
        {message}
      </Text>
    </View>
  );

  if (onDismiss === undefined) return body;

  // El aviso entero es el blanco: es lo que la gente toca para quitarse algo de encima,
  // y una equis de doce puntos en un mensaje de una línea es un blanco peor que la línea.
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Quitar aviso: ${message}`}
      onPress={onDismiss}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  icon: {
    marginTop: 1,
  },
});
