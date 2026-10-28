import { describe, expect, it } from 'vitest'
import type { Performance } from '@/shared/lib/arrangement'
import { note, noteName } from '@/shared/lib/music'
import { HANON_NUMBERS, hanon, hanonDegrees } from './hanon'
import { BAR } from './time'

const C = note('C')
const notesOf = (performance: Performance, side: 'rh' | 'lh') =>
  performance.notes.filter((n) => n.hand === side)
const names = (performance: Performance, side: 'rh' | 'lh', from: number, count = 8) =>
  notesOf(performance, side)
    .slice(from, from + count)
    .map((n) => noteName(n.spelled))
    .join(' ')
const fingers = (performance: Performance, side: 'rh' | 'lh', from: number, count = 8) =>
  notesOf(performance, side)
    .slice(from, from + count)
    .map((n) => n.finger)
    .join('')

describe('hanon', () => {
  it('climbs No. 1’s figure two octaves and mirrors it down, home on the tonic', () => {
    const exercise = hanon({ root: C, number: 1 })
    const rh = notesOf(exercise, 'rh')
    expect(names(exercise, 'rh', 0, 16)).toBe('C E F G A G F E D F G A B A G F')
    expect(names(exercise, 'rh', 14 * 8)).toBe('G E D C B C D E')
    expect(
      rh
        .slice(-9)
        .map((n) => noteName(n.spelled))
        .join(' '),
    ).toBe('G E D C B C D E C')
    expect(fingers(exercise, 'rh', 0)).toBe('12345432')
    expect(fingers(exercise, 'lh', 0)).toBe('54321234')
    expect(fingers(exercise, 'rh', 14 * 8)).toBe('54321234')
    expect(rh[14 * 8]?.midi).toBe(91)
    expect(exercise.bars).toHaveLength(30)
  })

  it('writes No. 5 as the book does: its own figure for the way down, from the top C', () => {
    const exercise = hanon({ root: C, number: 5 })
    expect(names(exercise, 'rh', 0)).toBe('C A G A F G E F')
    expect(fingers(exercise, 'rh', 0)).toBe('15453423')
    expect(fingers(exercise, 'lh', 0)).toBe('51213243')
    expect(names(exercise, 'rh', 14 * 8)).toBe('C D C E D F E G')
    expect(fingers(exercise, 'rh', 14 * 8)).toBe('12132435')
    expect(fingers(exercise, 'lh', 14 * 8)).toBe('54534231')
  })

  it('bends a figure where the book turns round: No. 6’s last one up ends on the octave', () => {
    const exercise = hanon({ root: C, number: 6 })
    expect(names(exercise, 'rh', 13 * 8)).toBe('B G F G E G D C')
    expect(names(exercise, 'rh', 14 * 8)).toBe('G B C B D B E B')
  })

  it('starts No. 12 on G and No. 13 on E, as printed, and ends both on C', () => {
    const twelve = hanon({ root: C, number: 12 })
    expect(names(twelve, 'rh', 0)).toBe('G C E D C D E C')
    expect(noteName(notesOf(twelve, 'rh').at(-1)?.spelled ?? C)).toBe('C')
    const thirteen = hanon({ root: C, number: 13 })
    expect(names(thirteen, 'rh', 0)).toBe('E C F D G E F G')
    expect(fingers(thirteen, 'rh', 0)).toBe('31425345')
  })

  it('ends No. 20 on a chord: the right hand’s E and C over the left hand’s octave C', () => {
    const exercise = hanon({ root: C, number: 20 })
    const last = exercise.notes.filter((n) => n.startTick === exercise.totalTicks - BAR)
    expect(last.map((n) => `${n.hand} ${noteName(n.spelled)}`).sort()).toEqual([
      'lh C',
      'lh C',
      'rh C',
      'rh E',
    ])
  })

  it('keeps its shape in another key', () => {
    expect(names(hanon({ root: note('G'), number: 1 }), 'rh', 0)).toBe('G B C D E D C B')
  })

  it('gives every note of all twenty a finger, both hands on the same notes, a figure a bar', () => {
    for (const number of HANON_NUMBERS) {
      const exercise = hanon({ root: C, number })
      const rh = notesOf(exercise, 'rh')
      const lh = notesOf(exercise, 'lh')
      expect(
        rh.every((n) => n.finger !== undefined),
        `No. ${number}`,
      ).toBe(true)
      expect(
        lh.every((n) => n.finger !== undefined),
        `No. ${number}`,
      ).toBe(true)
      const figures = hanonDegrees(number).length
      expect(lh.slice(0, figures).map((n) => n.spelled)).toEqual(
        rh.slice(0, figures).map((n) => n.spelled),
      )
      expect(exercise.bars).toHaveLength(hanonDegrees(number).length / 8 + 1)
    }
  })

  it('never plays one finger on two different notes in a row within a figure', () => {
    for (const number of HANON_NUMBERS) {
      const exercise = hanon({ root: C, number })
      for (const side of ['rh', 'lh'] as const) {
        const line = notesOf(exercise, side)
        // Between figures the hand may hop (No. 15's left thumb, F to G, as it turns round).
        const clashes = line.filter(
          (n, i) => i % 8 > 0 && line[i - 1]?.finger === n.finger && line[i - 1]?.midi !== n.midi,
        )
        expect(clashes.length, `No. ${number} ${side}`).toBe(0)
      }
    }
  })
})
