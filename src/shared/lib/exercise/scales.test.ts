import { describe, expect, it } from 'vitest'
import type { Performance } from '@/shared/lib/arrangement'
import {
  note,
  noteName,
  PIANO,
  PITCH_CLASSES,
  SCALE_KINDS,
  scaleRootSpelling,
  spellScale,
} from '@/shared/lib/music'
import {
  contraryExercise,
  handOctaves,
  ownHandOctaves,
  scaleExercise,
  sequenceExercise,
} from './scales'

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
  // Every key, start and octave span: seconds, many more under coverage's instrumenting.
  it('keeps both hands on the keyboard from any start, in every key, over up to four octaves', () => {
    const outside: string[] = []
    for (const kind of SCALE_KINDS) {
      for (const pc of PITCH_CLASSES) {
        const root = scaleRootSpelling(pc, kind)
        for (const octaves of [1, 2, 3, 4]) {
          for (let start = 0; start < spellScale(root, kind).length; start++) {
            const keys = scaleExercise({
              root,
              kind,
              octaves,
              start,
              fingering: 'scale',
            }).notes.map((n) => n.midi)
            if (Math.max(...keys) > PIANO.to || Math.min(...keys) < PIANO.from)
              outside.push(`${noteName(root)} ${kind} ×${octaves} from ${start}`)
          }
        }
      }
    }
    expect(outside).toEqual([])
  }, 60_000)

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

  it('runs four octaves from middle C to the top C, the left hand two below', () => {
    const scale = scaleExercise({
      root: C,
      kind: 'major',
      octaves: 4,
      start: 0,
      fingering: 'scale',
    })
    const keys = scale.notes.map((n) => n.midi)
    expect(Math.min(...keys)).toBe(36)
    expect(Math.max(...keys)).toBe(108)
  })

  it('starts an octave lower where the run from its start would leave the keyboard', () => {
    const scale = scaleExercise({
      root: note('D'),
      kind: 'major',
      octaves: 4,
      start: 6,
      fingering: 'scale',
    })
    const keys = scale.notes.map((n) => n.midi)
    expect(Math.max(...keys)).toBe(97)
    expect(Math.min(...keys)).toBe(25)
  })

  it('starts each hand in the octave asked, its tonic there', () => {
    const scale = scaleExercise({
      root: C,
      kind: 'major',
      octaves: 1,
      start: 0,
      fingering: 'scale',
      startOctaves: { rh: 5, lh: 2 },
    })
    expect(hand(scale, 'rh')[0]?.midi).toBe(72)
    expect(hand(scale, 'lh')[0]?.midi).toBe(36)
  })

  it('keeps its own octave for a hand whose octave would leave the keyboard', () => {
    const scale = scaleExercise({
      root: C,
      kind: 'major',
      octaves: 2,
      start: 0,
      fingering: 'scale',
      startOctaves: { rh: 7 },
    })
    expect(hand(scale, 'rh')[0]?.midi).toBe(60)
  })
})

describe('handOctaves', () => {
  const run = { root: C, kind: 'major', octaves: 1, start: 0 } as const

  it('names each hand’s own start: the right hand on middle C’s octave, the left one below', () => {
    expect(ownHandOctaves(run)).toEqual({ rh: 4, lh: 3 })
    expect(ownHandOctaves({ ...run, octaves: 2 })).toEqual({ rh: 4, lh: 2 })
  })

  it('offers octaves 1 to 7, those whose run leaves the keyboard greyed with where it would go', () => {
    const two = { ...run, octaves: 2 }
    expect(handOctaves(two).map(({ octave, out }) => `${octave}${out ?? ''}`)).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7above',
    ])
    expect(handOctaves({ ...run, root: note('A') }).at(-1)).toEqual({ octave: 7, out: 'above' })
    expect(handOctaves({ ...run, root: note('A') })[0]).toEqual({ octave: 1 })
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
