import { describe, expect, it } from 'vitest'
import { arrange, parseFigure, type Chart } from '@/shared/lib/arrangement'
import { midi, note, parseChordSymbol } from '@/shared/lib/music'
import { audibleHands } from './schedule'
import { barSounds, chordSounds, intervalSounds, walkSounds } from './sounds'

const bar = (symbol: string) => ({ chords: [{ ...parseChordSymbol(symbol), beats: 4 }], beats: 4 })
const TWO_BARS_CHART: Chart = {
  key: { tonic: note('C'), minor: false },
  meter: '4/4',
  sections: [{ lines: [[bar('C'), bar('G')]] }],
}
const BEATS = {
  id: 'beats',
  rh: { kind: 'events', events: parseFigure('0/4 C,4/4 C,8/4 C,12/4 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1') },
} as const
const FIXTURE = arrange(TWO_BARS_CHART, { tonic: note('C'), pattern: BEATS })

describe('barSounds', () => {
  it('plays only the bar asked for, from its first beat', () => {
    const sounds = barSounds(FIXTURE, 1, { tempo: 60, hands: audibleHands('both') })
    expect(sounds.length).toBeGreaterThan(0)
    expect(Math.min(...sounds.map((s) => s.at))).toBe(0)
    expect(Math.max(...sounds.map((s) => s.at))).toBeLessThan(4)
  })

  it('plays nothing for a bar the piece does not have', () => {
    expect(barSounds(FIXTURE, 9, { tempo: 60, hands: audibleHands('both') })).toEqual([])
  })
})

describe('chordSounds', () => {
  it('strikes a chord at once, low to high', () => {
    const sounds = chordSounds([midi(67), midi(60), midi(64)], { arpeggio: false })
    expect(sounds.map((s) => [s.midi, s.at])).toEqual([
      [60, 0],
      [64, 0],
      [67, 0],
    ])
  })

  it('rolls an arpeggio upwards', () => {
    const at = chordSounds([midi(60), midi(64), midi(67)], { arpeggio: true }).map((s) => s.at)
    expect(at[0]).toBe(0)
    expect(at[1]).toBeGreaterThan(0)
    expect(at[2]).toBeGreaterThan(at[1] ?? 0)
  })
})

describe('walkSounds', () => {
  const triads = [
    [60, 64, 67],
    [62, 65, 69],
  ].map((chord) => chord.map(midi))

  it('strikes each chord for two beats', () => {
    const sounds = walkSounds(triads, { arpeggio: false, tempo: 60 })
    expect(sounds.map((s) => [s.midi, s.at])).toEqual([
      [60, 0],
      [64, 0],
      [67, 0],
      [62, 2],
      [65, 2],
      [69, 2],
    ])
  })

  it('rolls each chord upwards an 8th a note, giving a big chord the beats it needs', () => {
    const thirteenth = [[60, 64, 67, 71, 74, 77, 81].map(midi), triads[1] ?? []]
    const sounds = walkSounds(thirteenth, { arpeggio: true, tempo: 60 })
    expect(sounds.slice(0, 3).map((s) => s.at)).toEqual([0, 0.5, 1])
    // Seven notes an 8th apart take four beats before the next chord.
    expect(sounds[7]?.at).toBe(4)
  })
})

describe('intervalSounds', () => {
  const at = (sounds: readonly { midi: number; at: number }[]) =>
    sounds.map((sound) => [sound.midi, sound.at])

  it('plays the lower note then the upper going up, the upper first going down', () => {
    expect(at(intervalSounds(midi(60), midi(63), 'up'))).toEqual([
      [60, 0],
      [63, 0.6],
    ])
    expect(at(intervalSounds(midi(60), midi(63), 'down'))).toEqual([
      [63, 0],
      [60, 0.6],
    ])
  })

  it('plays both at once together', () => {
    expect(at(intervalSounds(midi(60), midi(67), 'together'))).toEqual([
      [60, 0],
      [67, 0],
    ])
  })

  it('strikes a unison’s one key twice', () => {
    expect(at(intervalSounds(midi(60), midi(60), 'up'))).toEqual([
      [60, 0],
      [60, 0.6],
    ])
  })
})
