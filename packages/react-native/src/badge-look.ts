/**
 * What a badge paints, decided apart from the drawing so it can be asserted outside Metro.
 *
 * `solid` and `quiet` are the variants already shipped and their defaults do not move.
 * `tonal` is the soft one: the tone at a fraction on the ground and the word in the
 * tone, the way a status reads on a dark row without shouting. Caps and the dot are
 * the caller's; a badge in caps keeps the eyebrow's tracking and one without drops it,
 * because that tracking pulls a lower-case word apart.
 */

export type BadgeVariant = "solid" | "quiet" | "tonal";

export interface BadgeLook {
  /** `tone` fills with the tone, `tint` with the tone at a fraction, `muted` the quiet surface. */
  readonly fill: "tone" | "tint" | "muted" | "canvas" | "none";
  readonly edge: "fill" | "border" | "chip" | "none";
  readonly ink: "onStatus" | "tone" | "primary" | "secondary";
  readonly role: "eyebrow" | "control";
  readonly size: "2xs" | "xs";
  readonly uppercase: boolean;
  readonly dot: boolean;
}

export function badgeLook({
  tone = "neutral",
  variant = "solid",
  uppercase,
  dot = false,
}: {
  readonly tone?: string | undefined;
  readonly variant?: BadgeVariant | undefined;
  readonly uppercase?: boolean | undefined;
  readonly dot?: boolean | undefined;
}): BadgeLook {
  const neutral = tone === "neutral";
  const caps = uppercase ?? variant !== "quiet";
  const text = caps
    ? { role: "eyebrow" as const, size: "2xs" as const, uppercase: true }
    : { role: "control" as const, size: "xs" as const, uppercase: false };

  if (variant === "quiet") {
    return {
      fill: "canvas",
      edge: "chip",
      ink: neutral ? "primary" : "tone",
      ...text,
      dot,
    };
  }
  if (variant === "tonal") {
    return {
      fill: neutral ? "muted" : "tint",
      edge: "none",
      ink: neutral ? "secondary" : "tone",
      ...text,
      dot,
    };
  }
  return neutral
    ? { fill: "none", edge: "border", ink: "secondary", ...text, dot }
    : { fill: "tone", edge: "fill", ink: "onStatus", ...text, dot };
}
