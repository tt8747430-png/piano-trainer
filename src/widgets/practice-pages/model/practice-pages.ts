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
  chordPlayer: { to: '/practice/chord-player', tile: PAGE_TILES.chordPlayer },
  chordFinder: { to: '/practice/chord-finder', tile: PAGE_TILES.chordFinder },
  exercises: { to: '/practice/exercises', tile: PAGE_TILES.exercises },
  quiz: { to: '/practice/quiz', tile: PAGE_TILES.quiz },
  metronome: { to: '/practice/metronome', tile: PAGE_TILES.metronome },
  circleOfFifths: { to: '/practice/circle-of-fifths', tile: PAGE_TILES.circleOfFifths },
  tuner: { to: '/practice/tuner', tile: PAGE_TILES.tuner },
} as const satisfies Readonly<Record<string, { to: string; tile: Tile }>>
export type PracticePageId = keyof typeof PRACTICE_PAGES

/**
 * Practice's groups, each under its heading, by relevance (R32, as Yousician, Simply Piano and
 * musictheory.net order a practice home): Theory, the things a page shows on the keys; Playing, what
 * the hands play; Training, the drills; then Tools, last and compact, what a musician reaches for
 * while doing something else (also in the header's Tools menu).
 */
export const PRACTICE_GROUPS = [
  { id: 'theory', pages: ['chords', 'scales', 'intervals', 'progressions'] },
  { id: 'playing', pages: ['accompaniment', 'chordPlayer'] },
  { id: 'training', pages: ['exercises', 'quiz'] },
  { id: 'tools', pages: ['metronome', 'tuner', 'chordFinder', 'circleOfFifths'] },
] as const satisfies readonly { id: string; pages: readonly PracticePageId[] }[]

/** Every page of Practice, in the order it lists them. */
export const PRACTICE_PAGE_IDS: readonly PracticePageId[] = PRACTICE_GROUPS.flatMap(
  (group) => group.pages,
)

/** Whether a word is one of Practice's pages (a page id saved, read back). */
export const isPracticePageId = (value: unknown): value is PracticePageId =>
  PRACTICE_PAGE_IDS.some((page) => page === value)

/**
 * The Practice page a path is on (R32): its own path or any path under it (a progression's page is
 * Progressions', a drill the Quiz's); null off Practice's pages.
 */
export function practicePageAt(pathname: string): PracticePageId | null {
  const found = PRACTICE_PAGE_IDS.find((page) => {
    const { to } = PRACTICE_PAGES[page]
    return pathname === to || pathname.startsWith(`${to}/`)
  })
  return found ?? null
}
