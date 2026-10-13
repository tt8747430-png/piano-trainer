import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { readHands, voicingsMusic } from './voicings'

const C_MINOR = { tonic: note('C'), minor: true }

describe('readHands', () => {
  it('reads the left hand before the bar and the right after it, each from its lowest key', () => {
    const { lh, rh } = readHands('D3 A♭3 | F4 C4')
    expect(lh.map((each) => each.midi)).toEqual([50, 56])
    expect(rh.map((each) => each.midi)).toEqual([60, 65])
    expect(rh[1]?.note).toEqual(note('F'))
  })

  it('reads one hand alone, either side of the bar', () => {
    expect(readHands('| B3 E♭4 G4').lh).toEqual([])
    expect(readHands('C3 G3 |').rh).toEqual([])
    expect(readHands('C4 E4 G4').lh).toEqual([])
  })

  it('reads nothing that is not notes in octaves, and no hands with no key', () => {
    expect(() => readHands('D3 X | C4')).toThrow(RangeError)
    expect(() => readHands('C3 | C4 | E4')).toThrow(RangeError)
    expect(() => readHands(' | ')).toThrow(RangeError)
  })
})

describe('voicingsMusic', () => {
  it('writes each voicing a whole bar, its symbol over it, each hand on its staff as spelled', () => {
    const music = voicingsMusic(
      [
        { symbol: 'Dm7♭5', hands: 'D3 A♭3 | C4 F4' },
        { symbol: 'G7♭13', hands: 'F3 B3 | E♭4 G4' },
      ],
      C_MINOR,
    )
    expect(music.key).toEqual(C_MINOR)
    expect(music.bars).toEqual([
      { startTick: 0, beats: 4 },
      { startTick: 48, beats: 4 },
    ])
    expect(music.chords).toEqual([
      { startTick: 0, symbol: 'Dm7♭5' },
      { startTick: 48, symbol: 'G7♭13' },
    ])
    expect(
      music.notes.map((each) => [each.midi, each.hand, each.startTick, each.durationTicks]),
    ).toEqual([
      [50, 'lh', 0, 48],
      [56, 'lh', 0, 48],
      [60, 'rh', 0, 48],
      [65, 'rh', 0, 48],
      [53, 'lh', 48, 48],
      [59, 'lh', 48, 48],
      [63, 'rh', 48, 48],
      [67, 'rh', 48, 48],
    ])
    expect(music.notes[1]?.spelled).toEqual(note('A', -1))
  })

  it('leaves a staff with no hand on it blank', () => {
    const music = voicingsMusic([{ symbol: 'C+', hands: '| B3 E♭4 G4' }], C_MINOR)
    expect(music.bars).toEqual([{ startTick: 0, beats: 4, blank: ['bass'] }])
  })
})
