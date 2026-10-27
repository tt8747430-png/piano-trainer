/**
 * The tempo words a tempo mark is named by (ADR 0094, 0114), slowest first, each from its beats a
 * minute as a metronome marks them: the word under the picker's number, and on its ruler.
 */
export const TEMPO_WORDS = [
  ['largo', 50],
  ['larghetto', 60],
  ['adagio', 70],
  ['andante', 90],
  ['moderato', 110],
  ['allegro', 130],
  ['presto', 160],
] as const

/** The word a tempo mark is named by: the last whose beats a minute it has reached, Largo below all. */
export const tempoWord = (mark: number): (typeof TEMPO_WORDS)[number][0] =>
  TEMPO_WORDS.findLast(([, bpm]) => bpm <= mark)?.[0] ?? 'largo'
