/**
 * Conversion from the token gradient angle to Expo's coordinate pair.
 *
 * Kept pure so the conversion can be asserted without a React Native runtime.
 * A wrong angle still renders a gradient — just pointing the wrong way — so
 * nothing downstream would fail on it.
 *
 * Token angles follow the CSS convention: 0 degrees points up and the angle
 * grows clockwise. Expo instead takes two points in a unit square.
 */

export type GradientEndpoints = {
  readonly start: { readonly x: number; readonly y: number };
  readonly end: { readonly x: number; readonly y: number };
};

export function resolveGradientEndpoints(angle: number): GradientEndpoints {
  const radians = ((angle - 90) * Math.PI) / 180;
  const dx = Math.cos(radians);
  const dy = Math.sin(radians);

  return {
    start: { x: 0.5 - dx / 2, y: 0.5 - dy / 2 },
    end: { x: 0.5 + dx / 2, y: 0.5 + dy / 2 },
  };
}
