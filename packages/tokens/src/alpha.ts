/**
 * Restating a token colour at a different opacity.
 *
 * A fade has two ends, and the one that is "not there" still has a colour. Reaching
 * for the keyword `transparent` makes it transparent **black**, so the fade travels
 * through a darkness that is in no palette — visible as a dirty band over imagery, and
 * as a colour nobody chose in the middle of an animation. Every fade should ramp the
 * alpha of a token it already uses.
 *
 * Input is a token hex, with or without a trailing alpha pair. Anything else throws,
 * because a silently wrong colour is the failure this exists to prevent.
 */

const HEX = /^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export function withAlpha(color: string, alpha: number): string {
  if (!HEX.test(color)) {
    throw new Error(`withAlpha expects a 6- or 8-digit hex colour, received "${color}"`);
  }
  if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1) {
    throw new Error(`withAlpha expects an alpha between 0 and 1, received ${alpha}`);
  }
  const channel = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return `${color.slice(0, 7)}${channel}`;
}

/** The same colour, entirely absent. The end of a fade that carries no new hue. */
export function transparent(color: string): string {
  return withAlpha(color, 0);
}
