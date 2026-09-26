import { describe, expect, it } from 'vitest'
import { arrange, parseFigure, type Chart } from '@/shared/lib/arrangement'
import { midi, note, parseChordSymbol, type Midi } from '@/shared/lib/music'
import { audibleHands } from './schedule'
import {
  barSounds,
  chordSounds,
  keySound,
  placedChordSounds,
  PRACTICE_RHYTHMS,
  scaleRun,
} from './sounds'

const bar = (symbol: string) => ({ chords: [{ ...parseChordSymbol(symbol), beats: 4 }], beats: 4 })
const TWO_BARS_CHART: Chart = {
  key: { tonic: note('C'), minor: false },
  beatsPerBar: 4,
  sections: [{ lines: [[bar('C'), bar('G')]] }],
}
const BEATS = {
  id: 'beats',
  rh: { kind: 'events', events: parseFigure('0/4 C,4/4 C,8/4 C,12/4 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1') },
} as const
const FIXTURE = arrange(TWO_BARS_CHART, { tonic: note('C'), pattern: BEATS })
const C_MAJOR: Midi[] = [60, 62, 64, 65, 67, 69, 71, 72].map(midi)

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

describe('scaleRun', () => {
  it('goes up and back down in even eighth notes', () => {
    const run = scaleRun(C_MAJOR, { rhythm: 'even', tempo: 60, hands: 'rh' })
    expect(run.map((sound) => sound.midi)).toEqual([
      60, 62, 64, 65, 67, 69, 71, 72, 71, 69, 67, 65, 64, 62, 60,
    ])
    expect(run[1]?.at).toBeCloseTo(0.5)
    expect(run.at(-1)?.at).toBeCloseTo(14 * 0.5)
  })

  it('repeats the rhythm’s lengths', () => {
    const run = scaleRun(C_MAJOR, { rhythm: 'long-short', tempo: 60, hands: 'rh' })
    expect(run.slice(0, 3).map((sound) => sound.at)).toEqual([0, 0.75, 1])
    expect(PRACTICE_RHYTHMS['long-short']).toEqual([1.5, 0.5])
  })

  it('plays the left hand an octave lower, and both hands together', () => {
    expect(scaleRun(C_MAJOR, { rhythm: 'even', tempo: 60, hands: 'lh' })[0]?.midi).toBe(48)
    const both = scaleRun(C_MAJOR, { rhythm: 'even', tempo: 60, hands: 'both' })
    expect(
      both
        .filter((s) => s.at === 0)
        .map((s) => s.midi)
        .sort(),
    ).toEqual([48, 60])
  })
})

describe('keySound', () => {
  it('sounds one key now, as a tap on it', () => {
    expect(keySound(midi(66))).toMatchObject({ kind: 'note', midi: 66, at: 0 })
    expect(keySound(midi(66)).duration).toBeGreaterThan(0.5)
  })
})

describe('placedChordSounds', () => {
  it('sounds a chord as the explorers place it, struck or rolled', () => {
    const c = { root: note('C'), quality: 'maj' } as const
    expect(placedChordSounds(c).map((s) => [s.midi, s.at])).toEqual([
      [60, 0],
      [64, 0],
      [67, 0],
    ])
    expect(placedChordSounds(c, { arpeggio: true }).map((s) => s.at)).toEqual([0, 0.22, 0.44])
    expect(placedChordSounds(c, { bothHands: true }).some((s) => s.midi < 60)).toBe(true)
  })
})
