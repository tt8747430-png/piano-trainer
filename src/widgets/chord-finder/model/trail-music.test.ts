import { describe, expect, it } from 'vitest'
import { midi, note, type Key } from '@/shared/lib/music'
import { trailMusic } from './trail-music'

const D_MAJOR: Key = { tonic: note('D'), minor: false }

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
