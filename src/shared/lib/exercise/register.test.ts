import { describe, expect, it } from 'vitest'
import type { Performance } from '@/shared/lib/arrangement'
import { PITCH_CLASSES, tonicSpelling, type SpelledNote } from '@/shared/lib/music'
import { dropTwoSevenths, sixthDiminishedChords } from './barry-harris'
import { modes } from './jonny'
import { hanon } from './technique'

/** The highest a left hand's note goes: A♯4, so it reads on the bass staff. */
const LEFT_TOP = 70
const highestLeft = (performance: Performance) =>
  Math.max(...performance.notes.filter((n) => n.hand === 'lh').map((n) => n.midi))

const HIGHEST_LEFT: readonly (readonly [string, (root: SpelledNote) => number])[] = [
  ['Hanon', (root) => highestLeft(hanon({ root }))],
  ['the modes', (root) => highestLeft(modes({ root }))],
  [
    'drop 2 7ths in every inversion',
    (root) =>
      Math.max(
        ...[0, 1, 2, 3].map((inversion) => highestLeft(dropTwoSevenths({ root, inversion }))),
      ),
  ],
  [
    '6th-diminished chords in drop 2',
    (root) => highestLeft(sixthDiminishedChords({ root, minor: false, voicing: 'drop2' })),
  ],
]

describe('the left hand’s register', () => {
  it.each(HIGHEST_LEFT)('stays on the bass staff in %s, in every key', (_, highest) => {
    for (const root of PITCH_CLASSES.map((pc) => tonicSpelling(pc, false))) {
      expect(highest(root)).toBeLessThanOrEqual(LEFT_TOP)
    }
  })
})
