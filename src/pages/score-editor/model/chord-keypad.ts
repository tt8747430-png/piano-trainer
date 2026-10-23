/**
 * The chord keypad's keys (ADR 0065): what each types into the chord field, drawn as a lead sheet
 * writes it. Three rows: the letters with the sharp and the flat, the qualities with the slash, the
 * numbers. A phone types a chord on these, its own keyboard kept down, so nothing covers the row.
 */
export const CHORD_KEYPAD: readonly (readonly {
  readonly typed: string
  readonly shown: string
}[])[] = [
  ['C', 'D', 'E', 'F', 'G', 'A', 'B', '♯', '♭'],
  ['m', 'maj', 'dim', 'aug', 'sus', 'add', '/'],
  ['2', '4', '5', '6', '7', '9', '11', '13'],
].map((row) =>
  row.map((shown) => ({ shown, typed: shown === '♯' ? '#' : shown === '♭' ? 'b' : shown })),
)

/** The field's text with a key typed at its end, or its last character taken back. */
export const typedOn = (text: string, typed: string | 'back'): string =>
  typed === 'back' ? text.slice(0, -1) : text + typed
