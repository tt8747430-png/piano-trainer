import { describe, expect, it } from 'vitest'
import { arrange, parseFigure, type Chart, type Performance } from '@/shared/lib/arrangement'
import { midi, note, parseChordSymbol } from '@/shared/lib/music'
import {
  audibleHands,
  beatGroupSounds,
  schedule,
  untilNextBeatGroup,
  type NoteSound,
  type Sound,
} from './schedule'

const C_MAJOR = { tonic: note('C'), mode: 'major' } as const
const oneChordBar = (symbol: string) => ({
  chords: [{ ...parseChordSymbol(symbol), beats: 4 }],
  beats: 4,
})
const chart = (...symbols: string[]): Chart => ({
  key: C_MAJOR,
  beatsPerBar: 4,
  sections: [{ lines: [symbols.map(oneChordBar)] }],
})
const BLOCK = {
  id: 'block',
  rh: { kind: 'events', events: parseFigure('0/16 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1') },
} as const
const BEATS = {
  id: 'beats',
  rh: { kind: 'events', events: parseFigure('0/4 C,4/4 C,8/4 C,12/4 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1') },
} as const
const perform = (...symbols: string[]): Performance =>
  arrange(chart(...symbols), {
    tonic: note('C'),
    pattern: BLOCK,
    melody: [{ midi: midi(72), startTick: 0, durationTicks: 48 }],
    doubleMelody: true,
  })

const ALL = audibleHands('both')
const notes = (sounds: readonly Sound[]) =>
  sounds.filter((sound): sound is NoteSound => sound.kind === 'note')
const clicks = (sounds: readonly Sound[]) => sounds.filter((sound) => sound.kind === 'click')

describe('schedule', () => {
  it('times a bar in seconds at 60 bpm', () => {
    const { sounds, end } = schedule(perform('C'), { tempo: 60, hands: ALL })
    expect(notes(sounds).map((sound) => sound.at)).toEqual([0, 0, 0, 0, 0])
    expect(notes(sounds)[0]?.duration).toBeCloseTo(3.8)
    expect(end).toBe(4)
  })

  it('halves the time at 120 bpm', () => {
    const { sounds, end } = schedule(perform('C'), { tempo: 120, hands: ALL })
    expect(notes(sounds)[0]?.duration).toBeCloseTo(1.9)
    expect(end).toBe(2)
  })

  it('starts from a tick', () => {
    const performance = perform('C', 'F')
    const { sounds, end } = schedule(performance, { tempo: 60, hands: ALL, fromTick: 48 })
    const played = notes(sounds)
    expect(played.map((sound) => sound.midi % 12).sort()).toEqual([0, 5, 5, 9])
    expect(played.every((sound) => sound.at === 0)).toBe(true)
    expect(end).toBe(4)
  })

  it('counts in one bar of clicks before the music', () => {
    const { sounds, end } = schedule(perform('C'), { tempo: 60, hands: ALL, countIn: true })
    expect(clicks(sounds)).toEqual([
      { kind: 'click', at: 0, accent: true },
      { kind: 'click', at: 1, accent: false },
      { kind: 'click', at: 2, accent: false },
      { kind: 'click', at: 3, accent: false },
    ])
    expect(notes(sounds).every((sound) => sound.at === 4)).toBe(true)
    expect(end).toBe(8)
  })

  it('clicks every beat with the metronome, accenting each bar’s first', () => {
    const whole = schedule(perform('C'), { tempo: 60, hands: ALL, metronome: true })
    expect(clicks(whole.sounds)).toEqual([
      { kind: 'click', at: 0, accent: true },
      { kind: 'click', at: 1, accent: false },
      { kind: 'click', at: 2, accent: false },
      { kind: 'click', at: 3, accent: false },
    ])
    const late = schedule(perform('C'), { tempo: 60, hands: ALL, metronome: true, fromTick: 24 })
    expect(clicks(late.sounds)).toEqual([
      { kind: 'click', at: 0, accent: false },
      { kind: 'click', at: 1, accent: false },
    ])
  })

  it('plays only the audible hands, and always the tune', () => {
    expect(audibleHands('rh')).toEqual({ rh: true, lh: false, melody: true })
    expect(audibleHands('lh')).toEqual({ rh: false, lh: true, melody: true })
    const { sounds } = schedule(perform('C'), { tempo: 60, hands: audibleHands('rh') })
    expect(notes(sounds).map((sound) => sound.midi)).toEqual([60, 64, 67, 84])
  })

  it('cues each beat group from the start tick', () => {
    const performance = arrange(chart('C', 'F'), { tonic: note('C'), pattern: BEATS })
    const { cues } = schedule(performance, { tempo: 60, hands: ALL, fromTick: 48 })
    expect(cues).toEqual([
      { beatGroup: 4, at: 0 },
      { beatGroup: 5, at: 1 },
      { beatGroup: 6, at: 2 },
      { beatGroup: 7, at: 3 },
    ])
  })

  it('keeps a very short note audible', () => {
    const performance = perform('C')
    const blip: Performance = {
      ...performance,
      notes: [
        { midi: midi(60), hand: 'rh', startTick: 0, durationTicks: 1, velocity: 0.12, chord: 0 },
      ],
    }
    expect(notes(schedule(blip, { tempo: 60, hands: ALL }).sounds)[0]?.duration).toBe(0.15)
  })
})

describe('beatGroupSounds', () => {
  it('sounds one beat group now, long enough to hear', () => {
    const performance = arrange(chart('C'), { tonic: note('C'), pattern: BEATS })
    const sounds = beatGroupSounds(performance, 1, { tempo: 60, hands: audibleHands('rh') })
    expect(sounds.map((sound) => sound.midi)).toEqual([60, 64, 67])
    expect(sounds.every((sound) => sound.at === 0 && sound.duration === 1)).toBe(true)
    const fast = beatGroupSounds(performance, 1, { tempo: 160, hands: ALL })
    expect(fast.every((sound) => sound.duration === 0.375)).toBe(true)
    const faster = beatGroupSounds(performance, 1, { tempo: 240, hands: ALL })
    expect(faster.every((sound) => sound.duration === 0.35)).toBe(true)
  })

  it('has nothing for a beat group that does not exist', () => {
    const performance = arrange(chart('C'), { tonic: note('C'), pattern: BEATS })
    expect(beatGroupSounds(performance, 99, { tempo: 60, hands: ALL })).toEqual([])
  })
})

describe('untilNextBeatGroup', () => {
  const performance = arrange(chart('C', 'F'), { tonic: note('C'), pattern: BEATS })

  it('lasts until the next beat group sounds, whole beats exactly', () => {
    expect(untilNextBeatGroup(performance, 0, { tempo: 60 })).toBe(1)
    expect(untilNextBeatGroup(performance, 3, { tempo: 72 })).toBe(60 / 72)
  })

  it('gives the last beat group one beat', () => {
    expect(untilNextBeatGroup(performance, 7, { tempo: 120 })).toBe(0.5)
  })
})

describe('a tempo', () => {
  it.each([0, -60, Number.NaN])('refuses %s', (tempo) => {
    expect(() => schedule(perform('C'), { tempo, hands: ALL })).toThrow(RangeError)
    expect(() => untilNextBeatGroup(perform('C'), 0, { tempo })).toThrow(RangeError)
  })
})
