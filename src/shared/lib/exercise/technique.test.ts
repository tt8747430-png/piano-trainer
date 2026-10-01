import { describe, expect, it } from 'vitest'
import type { Performance } from '@/shared/lib/arrangement'
import { note, noteName } from '@/shared/lib/music'
import { fiveFinger, hanon } from './technique'

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

describe('hanon', () => {
  it('climbs its figure two octaves and mirrors it down, home on the tonic', () => {
    const exercise = hanon({ root: note('C') })
    const rh = notesOf(exercise, 'rh')
    const names = rh.map((n) => noteName(n.spelled))
    expect(names.slice(0, 16).join(' ')).toBe('C E F G A G F E D F G A B A G F')
    expect(names.slice(14 * 8, 15 * 8).join(' ')).toBe('G E D C B C D E')
    expect(names.slice(-9).join(' ')).toBe('G E D C B C D E C')
    expect(
      rh
        .slice(0, 8)
        .map((n) => n.finger)
        .join(''),
    ).toBe('12345432')
    expect(rh[14 * 8]?.midi).toBe(91)
    expect(exercise.bars).toHaveLength(30)
  })

  it('keeps its shape in another key', () => {
    const rh = notesOf(hanon({ root: note('G') }), 'rh')
    expect(
      rh
        .slice(0, 8)
        .map((n) => noteName(n.spelled))
        .join(' '),
    ).toBe('G B C D E D C B')
  })
})
