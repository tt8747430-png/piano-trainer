/**
 * The tempo words the Song sheet sets the tempo by, slowest first, each at its beats a minute as a
 * metronome marks them: chips under its slider (ADR 0080).
 */
export const TEMPO_WORDS = [
  ['largo', 50],
  ['adagio', 70],
  ['andante', 90],
  ['moderato', 110],
  ['allegro', 130],
  ['presto', 160],
] as const
