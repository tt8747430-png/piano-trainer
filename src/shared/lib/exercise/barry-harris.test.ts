import { describe, expect, it } from 'vitest'
import type { Performance } from '@/shared/lib/arrangement'
import { note, noteName } from '@/shared/lib/music'
import {
  arpeggiosFromTheThird,
  dominantScale,
  dropTwoSevenths,
  sixthDiminishedChords,
  sixthDiminishedScale,
} from './barry-harris'

const C = note('C')
const onset = (performance: Performance, side: 'rh' | 'lh', tick: number) =>
  performance.notes
    .filter((n) => n.hand === side && n.startTick === tick)
    .map((n) => noteName(n.spelled))
    .join(' ')
const line = (performance: Performance, side: 'rh' | 'lh' = 'rh') =>
  performance.notes
    .filter((n) => n.hand === side)
    .map((n) => noteName(n.spelled))
    .join(' ')

describe('sixthDiminishedScale', () => {
  it('runs the major 6th-diminished scale, the 6th chord’s tones on the beats', () => {
    const scale = sixthDiminishedScale({ root: C, minor: false, octaves: 1 })
    expect(line(scale)).toBe('C D E F G A♭ A B C B A A♭ G F E D C')
    const onBeats = scale.notes.filter((n) => n.hand === 'rh' && n.startTick % 12 === 0)
    expect(onBeats.slice(0, 4).map((n) => noteName(n.spelled))).toEqual(['C', 'E', 'G', 'A'])
    expect(scale.chords[0]?.symbol).toBe('C6')
    expect(scale.notes.every((n) => n.finger === undefined)).toBe(true)
  })

  it('runs the minor one over the minor 6th chord', () => {
    const scale = sixthDiminishedScale({ root: C, minor: true, octaves: 1 })
    expect(line(scale).startsWith('C D E♭ F G A♭ A B C')).toBe(true)
    expect(scale.chords[0]?.symbol).toBe('Cm6')
  })
})

describe('sixthDiminishedChords', () => {
  it('harmonises each note with the 6th chord or the diminished 7th under it', () => {
    const chords = sixthDiminishedChords({ root: C, minor: false, voicing: 'close' })
    expect(onset(chords, 'rh', 0)).toBe('E G A C')
    expect(onset(chords, 'rh', 12)).toBe('F A♭ B D')
    expect(chords.chords.slice(0, 3).map((chord) => chord.symbol)).toEqual(['C6', 'B°7', 'C6'])
    // The left hand holds the root a bar at a time.
    expect([0, 48, 96, 144].map((tick) => onset(chords, 'lh', tick))).toEqual(['C', 'C', 'C', 'C'])
  })

  it('drops the second voice from the top into the left hand in drop 2', () => {
    const chords = sixthDiminishedChords({ root: C, minor: false, voicing: 'drop2' })
    expect(onset(chords, 'rh', 0)).toBe('E G C')
    expect(onset(chords, 'lh', 0)).toBe('A')
    const [dropped] = chords.notes.filter((n) => n.hand === 'lh' && n.startTick === 0)
    expect(dropped?.midi).toBe(57)
  })
})

describe('dominantScale', () => {
  it('comes down the V7’s bebop scale two octaves, every chord tone on a beat', () => {
    const scale = dominantScale({ root: C, from: 'third' })
    expect(line(scale)).toBe('B A G F# F E D C B A G F# F E D C B')
    const onBeats = scale.notes.filter((n) => n.hand === 'rh' && n.startTick % 12 === 0)
    expect(onBeats.map((n) => noteName(n.spelled))).toEqual([
      'B',
      'G',
      'F',
      'D',
      'B',
      'G',
      'F',
      'D',
      'B',
    ])
    expect(onset(scale, 'lh', 0)).toBe('G F')
    expect(scale.chords[0]?.symbol).toBe('G7')
  })
})

describe('arpeggiosFromTheThird', () => {
  it('plays each chord’s 3-5-7-9 and the scale down, into the next chord’s 3rd', () => {
    const lines = arpeggiosFromTheThird({ root: C })
    expect(line(lines)).toBe('F A C E D C B A B D F A G F E D E G B D C B A G C')
    expect(lines.chords.map((chord) => chord.symbol)).toEqual(['Dm9', 'G9', 'CMaj9', 'CMaj9'])
    expect(onset(lines, 'lh', 0)).toBe('D C')
    expect(lines.bars).toHaveLength(4)
  })
})

describe('dropTwoSevenths', () => {
  it('walks the key’s 7ths up and back, the second voice from the top in the left hand', () => {
    const chords = dropTwoSevenths({ root: C, inversion: 0 })
    expect(onset(chords, 'rh', 0)).toBe('C E B')
    expect(onset(chords, 'lh', 0)).toBe('G')
    expect(chords.chords.map((chord) => chord.symbol).slice(0, 3)).toEqual(['CMaj7', 'Dm7', 'Em7'])
    expect(chords.chords).toHaveLength(15)
  })
})
