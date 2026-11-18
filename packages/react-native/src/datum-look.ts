/**
 * What a `DatumRow` says, decided apart from the drawing so it can be asserted.
 *
 * **An unanswered datum is not empty.** It reads «Sin responder» and offers «Responder»,
 * so a question nobody asked yet is found where its answer will live. An answered one
 * shows where the answer came from instead, and offers nothing: the row itself edits.
 */

export interface DatumLines {
  readonly value: string;
  readonly answered: boolean;
  readonly origin: string | undefined;
  readonly answer: string | undefined;
}

export function datumLines({
  value,
  origin,
}: {
  readonly value?: string | undefined;
  readonly origin?: string | undefined;
}): DatumLines {
  return value === undefined
    ? { value: "Sin responder", answered: false, origin: undefined, answer: "Responder" }
    : { value, answered: true, origin, answer: undefined };
}
