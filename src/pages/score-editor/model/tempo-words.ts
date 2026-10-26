/**
 * The tempo words the tempo mark's popover sets the tempo by (ADR 0094), slowest first, each at its
 * beats a minute as a metronome marks them.
 */
export const TEMPO_WORDS = [
  ['largo', 50],
  ['adagio', 70],
  ['andante', 90],
  ['moderato', 110],
  ['allegro', 130],
  ['presto', 160],
] as const
