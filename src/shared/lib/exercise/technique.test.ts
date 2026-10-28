import { describe, expect, it } from 'vitest'
import type { Performance } from '@/shared/lib/arrangement'
import { note, noteName } from '@/shared/lib/music'
import { fiveFinger } from './technique'

const notesOf = (performance: Performance, side: 'rh' | 'lh') =>
  performance.notes.filter((n) => n.hand === side)

describe('fiveFinger', () => {
  it('plays 1-2-3-4-5-4-3-2 twice and home, a finger a key', () => {
    const exercise = fiveFinger({ root: note('D'), minor: true })
    const rh = notesOf(exercise, 'rh')
    expect(rh.map((n) => noteName(n.spelled)).join(' ')).toBe('D E F G A G F E D E F G A G F E D')
    expect(rh.map((n) => n.finger).join('')).toBe('12345432123454321')
    expect(
      notesOf(exercise, 'lh')
        .map((n) => n.finger)
        .join(''),
    ).toBe('54321234543212345')
    expect(exercise.bars).toHaveLength(3)
  })
})
