import { PAGE_TILES, type Tile } from '@/shared/ui'

/**
 * Practice's pages (ADR 0044), each where it is and the tile it wears: the things a page shows on the
 * keys, each holding the tools that work on it (ADR 0052); the Chord finder, any chord played named
 * (ADR 0054); and the training.
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

/** The groups listed under a heading, in order: the tool at the keys, then the training. */
export const PRACTICE_GROUPS = [
  { id: 'atTheKeys', pages: ['chordFinder'] },
  { id: 'training', pages: ['exercises', 'quiz'] },
] as const satisfies readonly { id: string; pages: readonly PracticePageId[] }[]

/** Every page of Practice, in the order it lists them. */
export const PRACTICE_PAGE_IDS: readonly PracticePageId[] = [
  ...THINGS,
  ...PRACTICE_GROUPS.flatMap((group) => group.pages),
]

/** How many pages Practice offers to go back to. */
export const RECENT_PAGES = 3

/**
 * The pages used last, the latest first, at most `most`: from the screens remembered in the order
 * they were used (`pt-views`, ADR 0022), the latest last.
 */
export function recentPages(
  usedPaths: readonly string[],
  most: number = RECENT_PAGES,
): PracticePageId[] {
  const byPath = new Map<string, PracticePageId>(
    PRACTICE_PAGE_IDS.map((page) => [PRACTICE_PAGES[page].to, page]),
  )
  return usedPaths
    .toReversed()
    .flatMap((path) => {
      const page = byPath.get(path)
      return page ? [page] : []
    })
    .slice(0, most)
}
