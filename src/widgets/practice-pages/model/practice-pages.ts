import { PAGE_TILES, type Tile } from '@/shared/ui'

/**
 * Practice's pages (ADR 0044), each where it is and the tile it wears: the things a page shows on the
 * keys, the tools that work something out from what they are given, and the training.
 */
export const PRACTICE_PAGES = {
  chords: { to: '/practice/chords', tile: PAGE_TILES.chords },
  scales: { to: '/practice/scales', tile: PAGE_TILES.scales },
  intervals: { to: '/practice/intervals', tile: PAGE_TILES.intervals },
  progressions: { to: '/practice/progressions', tile: PAGE_TILES.progressions },
  accompaniment: { to: '/practice/accompaniment', tile: PAGE_TILES.patterns },
  chordFinder: { to: '/practice/chord-finder', tile: PAGE_TILES.chordFinder },
  passingChords: { to: '/practice/passing-chords', tile: PAGE_TILES.passingChords },
  reharmonise: { to: '/practice/reharmonise', tile: PAGE_TILES.reharmonise },
  transpose: { to: '/practice/transpose', tile: PAGE_TILES.transpose },
  freePlay: { to: '/practice/free-play', tile: PAGE_TILES.freePlay },
  exercises: { to: '/practice/exercises', tile: PAGE_TILES.exercises },
  quiz: { to: '/practice/quiz', tile: PAGE_TILES.quiz },
} as const satisfies Readonly<Record<string, { to: string; tile: Tile }>>
export type PracticePageId = keyof typeof PRACTICE_PAGES

/** The pages a thing is shown on, listed first and under no heading: a thing carries its own name. */
export const THINGS = [
  'chords',
  'scales',
  'intervals',
  'progressions',
  'accompaniment',
] as const satisfies readonly PracticePageId[]

/** The groups listed under a heading, in order: the tools, then the training. */
export const PRACTICE_GROUPS = [
  { id: 'tools', pages: ['chordFinder', 'passingChords', 'reharmonise', 'transpose', 'freePlay'] },
  { id: 'training', pages: ['exercises', 'quiz'] },
] as const satisfies readonly { id: string; pages: readonly PracticePageId[] }[]

/** Every page of Practice, in the order it lists them. */
export const PRACTICE_PAGE_IDS: readonly PracticePageId[] = [
  ...THINGS,
  ...PRACTICE_GROUPS.flatMap((group) => group.pages),
]
