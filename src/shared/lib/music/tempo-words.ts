/** The Italian words a tempo is named by, slowest first. */
export const TEMPO_WORDS = [
  'larghissimo',
  'grave',
  'largo',
  'lento',
  'larghetto',
  'adagio',
  'adagietto',
  'andante',
  'andantino',
  'moderato',
  'allegretto',
  'allegro',
  'vivace',
  'presto',
  'prestissimo',
] as const
export type TempoWord = (typeof TEMPO_WORDS)[number]

/**
 * A tempo word's beats a minute as a metronome marks them: from `from` to `to` (none above the
 * fastest), the ranges overlapping as the words do. `ladder` where it names a tempo on its own, a
 * step of the ladder a tempo dial reads from (ADR 0114); the words between are shades of their
 * neighbours (lento of largo, andantino of andante) and name no tempo by themselves.
 */
export interface TempoTerm {
  readonly word: TempoWord
  readonly from: number
  readonly to?: number
  readonly ladder?: true
}

/** Each tempo word's range, as the common metronome markings give them. */
export const TEMPO_TERMS: readonly TempoTerm[] = [
  { word: 'larghissimo', from: 20, to: 24 },
  { word: 'grave', from: 25, to: 45, ladder: true },
  { word: 'largo', from: 40, to: 60, ladder: true },
  { word: 'lento', from: 45, to: 60 },
  { word: 'larghetto', from: 60, to: 66, ladder: true },
  { word: 'adagio', from: 66, to: 76, ladder: true },
  { word: 'adagietto', from: 70, to: 80 },
  { word: 'andante', from: 76, to: 108, ladder: true },
  { word: 'andantino', from: 80, to: 108 },
  { word: 'moderato', from: 108, to: 120, ladder: true },
  { word: 'allegretto', from: 112, to: 120 },
  { word: 'allegro', from: 120, to: 156, ladder: true },
  { word: 'vivace', from: 156, to: 176, ladder: true },
  { word: 'presto', from: 168, to: 200, ladder: true },
  { word: 'prestissimo', from: 200, ladder: true },
]

/** The words that name a tempo on their own, slowest first: a tempo dial's ruler. */
export const TEMPO_LADDER: readonly TempoTerm[] = TEMPO_TERMS.filter((term) => term.ladder)

/** A tempo word's range. */
export const tempoTerm = (word: TempoWord): TempoTerm =>
  TEMPO_TERMS.find((term) => term.word === word) ?? (TEMPO_LADDER[0] as TempoTerm)

/** The word a tempo is named by: the last on the ladder it has reached, Grave below all. */
export const tempoWord = (bpm: number): TempoWord =>
  (TEMPO_LADDER.findLast((term) => term.from <= bpm) ?? (TEMPO_LADDER[0] as TempoTerm)).word
