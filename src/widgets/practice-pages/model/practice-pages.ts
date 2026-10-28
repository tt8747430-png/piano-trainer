import { PAGE_TILES, type Tile } from '@/shared/ui'

/**
 * Practice's pages (ADR 0052), each where it is and the tile it wears: the things a page shows on the
 * keys, each holding the tools that work on it (ADR 0052); the Chord finder, any chord played named
 * (ADR 0052); and the training, the Metronome with it (ADR 0052).
 */
export const PRACTICE_PAGES = {
  chords: { to: '/practice/chords', tile: PAGE_TILES.chords },
  scales: { to: '/practice/scales', tile: PAGE_TILES.scales },
  intervals: { to: '/practice/intervals', tile: PAGE_TILES.intervals },
  progressions: { to: '/practice/progressions', tile: PAGE_TILES.progressions },
  accompaniment: { to: '/practice/accompaniment', tile: PAGE_TILES.patterns },
  chordFinder: { to: '/practice/chord-finder', tile: PAGE_TILES.chordFinder },
  exercises: { to: '/practice/exercises', tile: PAGE_TILES.exercises },
  quiz: { to: '/practice/quiz', tile: PAGE_TILES.quiz },
  metronome: { to: '/practice/metronome', tile: PAGE_TILES.metronome },
} as const satisfies Readonly<Record<string, { to: string; tile: Tile }>>
export type PracticePageId = keyof typeof PRACTICE_PAGES

/**
 * Practice's groups, each under its heading, in the order a learner reaches for them (ADR 0052):
 * Theory, the things a page shows on the keys; Playing, what the hands play at the keys; Training,
 * the drills and the clock that keeps them.
 */
export const PRACTICE_GROUPS = [
  { id: 'theory', pages: ['chords', 'scales', 'intervals', 'progressions'] },
  { id: 'playing', pages: ['accompaniment', 'chordFinder'] },
  { id: 'training', pages: ['exercises', 'quiz', 'metronome'] },
] as const satisfies readonly { id: string; pages: readonly PracticePageId[] }[]

/** Every page of Practice, in the order it lists them. */
export const PRACTICE_PAGE_IDS: readonly PracticePageId[] = PRACTICE_GROUPS.flatMap(
  (group) => group.pages,
)
