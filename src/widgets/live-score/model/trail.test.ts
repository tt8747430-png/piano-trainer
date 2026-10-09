import { describe, expect, it } from 'vitest'
import { midi, note, type Key } from '@/shared/lib/music'
import { EMPTY_TRAIL, strike, trailMusic, TRAIL_CHORDS, type Trail } from './trail'

const struck = (...keys: [number, number][]): Trail =>
  keys.reduce((trail, [key, time]) => strike(trail, midi(key), time), EMPTY_TRAIL)

const D_MAJOR: Key = { tonic: note('D'), minor: false }

describe('strike', () => {
  it('makes keys struck within 50 ms of each other one chord, lowest first', () => {
    expect(struck([67, 0], [60, 20], [64, 40])).toEqual([{ keys: [60, 64, 67], last: 40 }])
  })

  it('starts the next chord with a key struck later', () => {
    expect(struck([60, 0], [64, 300]).map((chord) => chord.keys)).toEqual([[60], [64]])
  })

  it('counts a key struck twice within the window once', () => {
    expect(struck([60, 0], [60, 10])).toEqual([{ keys: [60], last: 0 }])
  })

  it('keeps the chord held now and the four before it, the oldest pushed out', () => {
    const trail = struck(
      ...Array.from({ length: 6 }, (_, i): [number, number] => [60 + i, i * 100]),
    )
    expect(trail).toHaveLength(TRAIL_CHORDS)
    expect(trail.map((chord) => chord.keys)).toEqual([[61], [62], [63], [64], [65]])
  })
})

describe('trailMusic', () => {
  it('writes each chord a whole note in its own bar, the treble from middle C up, spelled in the key', () => {
    const music = trailMusic([[midi(48), midi(64), midi(66)]], D_MAJOR, ['D'])
    expect(music.bars).toEqual([{ startTick: 0, beats: 4 }])
    expect(music.notes.map(({ midi: key, hand }) => [key, hand])).toEqual([
      [48, 'lh'],
      [64, 'rh'],
      [66, 'rh'],
    ])
    expect(music.notes[2]?.spelled).toEqual(note('F', 1))
    expect(music.chords).toEqual([{ startTick: 0, symbol: 'D' }])
  })

  it('leaves a staff with no key blank, and an empty trail one blank bar', () => {
    expect(trailMusic([[midi(60)], [midi(40)]], D_MAJOR, ['', '']).bars).toEqual([
      { startTick: 0, beats: 4, blank: ['bass'] },
      { startTick: 48, beats: 4, blank: ['treble'] },
    ])
    expect(trailMusic([], D_MAJOR, []).bars).toEqual([
      { startTick: 0, beats: 4, blank: ['treble', 'bass'] },
    ])
  })
})
