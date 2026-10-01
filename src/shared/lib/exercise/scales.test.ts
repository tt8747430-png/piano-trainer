import { describe, expect, it } from 'vitest'
import type { Performance } from '@/shared/lib/arrangement'
import { note, noteName } from '@/shared/lib/music'
import { contraryExercise, scaleExercise, sequenceExercise } from './scales'

const C = note('C')
const hand = (performance: Performance, side: 'rh' | 'lh') =>
  performance.notes.filter((n) => n.hand === side)
const names = (performance: Performance, side: 'rh' | 'lh' = 'rh') =>
  hand(performance, side)
    .map((n) => noteName(n.spelled))
    .join(' ')
const fingers = (performance: Performance, side: 'rh' | 'lh' = 'rh') =>
  hand(performance, side)
    .map((n) => n.finger ?? '-')
    .join('')

describe('scaleExercise', () => {
  it('runs up an octave and back in 8ths, fingered as taught, both hands an octave apart', () => {
    const scale = scaleExercise({
      root: C,
      kind: 'major',
      octaves: 1,
      start: 0,
      fingering: 'scale',
    })
    expect(names(scale)).toBe('C D E F G A B C B A G F E D C')
    expect(fingers(scale)).toBe('123123454321321')
    expect(fingers(scale, 'lh')).toBe('543213212312345')
    expect(hand(scale, 'lh').map((n) => n.midi)).toEqual(hand(scale, 'rh').map((n) => n.midi - 12))
    expect(scale.bars).toHaveLength(2)
    expect(scale.chords.map((chord) => chord.symbol)).toEqual(['C'])
  })

  it('comes down melodic minor as natural minor', () => {
    const scale = scaleExercise({
      root: note('A'),
      kind: 'melodic',
      octaves: 1,
      start: 0,
      fingering: 'scale',
    })
    expect(names(scale)).toBe('A B C D E F# G# A G F E D C B A')
  })

  it('runs two octaves with each octave’s turn', () => {
    const scale = scaleExercise({
      root: C,
      kind: 'major',
      octaves: 2,
      start: 0,
      fingering: 'scale',
    })
    expect(fingers(scale).slice(0, 15)).toBe('123123412312345')
    expect(scale.bars).toHaveLength(4)
  })

  it('starts on any degree, from the thumb', () => {
    const scale = scaleExercise({
      root: C,
      kind: 'major',
      octaves: 1,
      start: 2,
      fingering: 'thumb',
    })
    expect(names(scale).startsWith('E F G A B C D E D')).toBe(true)
    expect(fingers(scale)[0]).toBe('1')
  })

  it('starts four octaves an octave lower, so the run stays on the keyboard, the left hand two below', () => {
    const scale = scaleExercise({
      root: C,
      kind: 'major',
      octaves: 4,
      start: 0,
      fingering: 'scale',
    })
    const keys = scale.notes.map((n) => n.midi)
    expect(Math.min(...keys)).toBe(24)
    expect(Math.max(...keys)).toBe(96)
  })
})

describe('sequenceExercise', () => {
  it('plays broken 3rds up and back, home on the tonic', () => {
    const thirds = sequenceExercise({ root: C, kind: 'major', octaves: 1, figure: [0, 2] })
    expect(names(thirds)).toBe('C E D F E G F A G B A C C A B G A F G E F D E C')
  })

  it('restarts a group of four on each degree and mirrors it down', () => {
    const groups = sequenceExercise({ root: C, kind: 'major', octaves: 1, figure: [0, 1, 2, 3] })
    expect(
      names(groups).startsWith('C D E F D E F G E F G A F G A B G A B C C B A G B A G F'),
    ).toBe(true)
    expect(names(groups).endsWith('G F E D F E D C')).toBe(true)
    expect(fingers(groups)).not.toMatch(/\d/)
  })
})

describe('contraryExercise', () => {
  it('moves the hands apart from one tonic and back, each fingered as its scale', () => {
    const contrary = contraryExercise({ root: C, kind: 'major', octaves: 1 })
    expect(names(contrary, 'rh')).toBe('C D E F G A B C B A G F E D C')
    expect(names(contrary, 'lh')).toBe('C B A G F E D C D E F G A B C')
    expect(fingers(contrary, 'rh')).toBe('123123454321321')
    expect(fingers(contrary, 'lh')).toBe('123123454321321')
    expect(hand(contrary, 'lh')[0]?.midi).toBe(60)
  })
})
