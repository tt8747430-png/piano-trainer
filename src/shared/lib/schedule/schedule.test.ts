import { describe, expect, it } from 'vitest'
import { arrange, parseFigure, type Chart, type Performance } from '@/shared/lib/arrangement'
import { midi, note, parseChordSymbol } from '@/shared/lib/music'
import {
  audibleHands,
  beatGroupSounds,
  schedule,
  TEMPO_RANGE,
  untilNextBeatGroup,
  type NoteSound,
  type Sound,
} from './schedule'

const C_MAJOR = { tonic: note('C'), minor: false } as const
const oneChordBar = (symbol: string) => ({
  chords: [{ ...parseChordSymbol(symbol), beats: 4 }],
  beats: 4,
})
const chart = (...symbols: string[]): Chart => ({
  key: C_MAJOR,
  meter: '4/4',
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
    melody: [{ midi: midi(72), spelled: note('C'), startTick: 0, durationTicks: 48 }],
    doubleMelody: true,
  })

const ALL = audibleHands('both')
const notes = (sounds: readonly Sound[]) =>
  sounds.filter((sound): sound is NoteSound => sound.kind === 'note')
const clicks = (sounds: readonly Sound[]) => sounds.filter((sound) => sound.kind === 'click')

describe('schedule', () => {
  it('counts a pickup as the end of a bar: no accent on it, the next bar’s first beat accented', () => {
    const withPickup = arrange(
      {
        key: C_MAJOR,
        meter: '4/4',
        sections: [
          {
            lines: [
              [{ chords: [{ ...parseChordSymbol('C'), beats: 1 }], beats: 1 }, oneChordBar('F')],
            ],
          },
        ],
      },
      { tonic: note('C'), pattern: BLOCK },
    )
    const { sounds } = schedule(withPickup, {
      tempo: 60,
      hands: ALL,
      metronome: true,
      countIn: true,
    })
    expect(clicks(sounds).slice(0, 6)).toEqual([
      { kind: 'click', at: 0, accent: false },
      { kind: 'click', at: 1, accent: true },
      { kind: 'click', at: 2, accent: false },
      { kind: 'click', at: 3, accent: false },
      { kind: 'click', at: 4, accent: false },
      { kind: 'click', at: 5, accent: true },
    ])
  })

  it('says where the pass runs and when its music starts, after a count-in', () => {
    const plain = schedule(perform('C', 'F'), { tempo: 60, hands: ALL, fromTick: 12, toTick: 60 })
    expect([plain.fromTick, plain.toTick, plain.musicStart]).toEqual([12, 60, 0])
    const counted = schedule(perform('C', 'F'), { tempo: 60, hands: ALL, countIn: true })
    expect([counted.fromTick, counted.toTick, counted.musicStart]).toEqual([0, 96, 4])
  })

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

  it('sounds a note still held where the pass starts, from there for what is left of it', () => {
    const held = arrange(chart('C', 'F'), {
      tonic: note('C'),
      pattern: BLOCK,
      melody: [{ midi: midi(72), spelled: note('C'), startTick: 0, durationTicks: 96 }],
      doubleMelody: true,
    })
    const { sounds } = schedule(held, { tempo: 60, hands: ALL, fromTick: 48 })
    const tied = notes(sounds).find((sound) => sound.midi === 84)
    expect(tied?.at).toBe(0)
    expect(tied?.duration).toBeCloseTo(4 * 0.95)
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

  it('counts in on the beats of the bar it starts in, so the music comes in on its beat', () => {
    // From beat 3: "3 4 | 1 2", then the music on beat 3, the accent on the bar's first beat.
    const { sounds, musicStart } = schedule(perform('C', 'F'), {
      tempo: 60,
      hands: ALL,
      fromTick: 24,
      countIn: true,
      metronome: true,
    })
    expect(clicks(sounds).slice(0, 6)).toEqual([
      { kind: 'click', at: 0, accent: false },
      { kind: 'click', at: 1, accent: false },
      { kind: 'click', at: 2, accent: true },
      { kind: 'click', at: 3, accent: false },
      { kind: 'click', at: 4, accent: false },
      { kind: 'click', at: 5, accent: false },
    ])
    expect(musicStart).toBe(4)
  })

  it('comes in half a beat after the last click when it starts on an off-beat', () => {
    const { sounds, musicStart } = schedule(perform('C', 'F'), {
      tempo: 60,
      hands: ALL,
      fromTick: 18,
      countIn: true,
    })
    expect(clicks(sounds).map((click) => click.at)).toEqual([0, 1, 2, 3])
    expect(musicStart).toBe(3.5)
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

  it('sounds a rolled chord a tick apart from its written onset', () => {
    const rolled = arrange(chart('C'), {
      tonic: note('C'),
      pattern: {
        id: 'rolled',
        rh: { kind: 'events', events: parseFigure('0/16 T~') },
        lh: { kind: 'events', events: parseFigure('0/16 L1') },
      },
    })
    const rh = notes(schedule(rolled, { tempo: 60, hands: audibleHands('rh') }).sounds)
    expect(rh.map((sound) => sound.at)).toEqual([0, 1 / 12, 2 / 12])
    expect(
      beatGroupSounds(rolled, 0, { tempo: 60, hands: audibleHands('rh') }).map((s) => s.at),
    ).toEqual([0, 1 / 12, 2 / 12])
  })

  it('keeps a very short note audible', () => {
    const performance = perform('C')
    const blip: Performance = {
      ...performance,
      notes: [
        {
          midi: midi(60),
          spelled: note('C'),
          hand: 'rh',
          startTick: 0,
          durationTicks: 1,
          roll: 0,
          velocity: 0.12,
          chord: 0,
        },
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

describe('TEMPO_RANGE', () => {
  it('runs from 20 to 160 beats per minute', () => {
    expect(TEMPO_RANGE).toEqual({ min: 20, max: 160 })
  })
})

describe('schedule: a passage and swing', () => {
  const performance = arrange(chart('C', 'F'), { tonic: note('C'), pattern: BEATS })

  it('ends a pass where it is told, cutting what would sound past it', () => {
    const { sounds, cues, end } = schedule(performance, {
      tempo: 60,
      hands: ALL,
      fromTick: 12,
      toTick: 36,
    })
    expect(cues.map((cue) => cue.beatGroup)).toEqual([1, 2])
    expect(end).toBe(2)
    // The bass struck on beat 1 is still held: it sounds from the pass's start to its end.
    const bass = notes(sounds).find((sound) => sound.midi < 48)
    expect(bass?.at).toBe(0)
    expect(bass?.duration).toBeCloseTo(2 * 0.95)
  })

  it('cuts a note that would sound past the pass’s end', () => {
    const { sounds } = schedule(performance, { tempo: 60, hands: ALL, toTick: 36 })
    const bass = notes(sounds).find((sound) => sound.midi < 48)
    expect(bass?.duration).toBeCloseTo(3 * 0.95)
  })

  it('swings the off-beat 8th to two thirds of the beat, the beats kept', () => {
    const eighths = arrange(chart('C'), {
      tonic: note('C'),
      pattern: {
        id: 'eighths',
        rh: { kind: 'events', events: parseFigure('0/2 C,2/2 C,4/2 C,6/2 C') },
        lh: { kind: 'events', events: parseFigure('0/16 L1') },
      },
    })
    const rh = (swing: boolean) => [
      ...new Set(
        notes(schedule(eighths, { tempo: 60, hands: audibleHands('rh'), swing }).sounds).map(
          (s) => s.at,
        ),
      ),
    ]
    expect(rh(false)).toEqual([0, 0.5, 1, 1.5])
    expect(rh(true).map((at) => Number(at.toFixed(4)))).toEqual([0, 0.6667, 1, 1.6667])
  })

  it('never swings a compound meter', () => {
    const inEighths = arrange({ ...chart('C'), meter: '6/8' }, { tonic: note('C'), pattern: BEATS })
    expect(schedule(inEighths, { tempo: 60, hands: ALL, swing: true })).toEqual(
      schedule(inEighths, { tempo: 60, hands: ALL }),
    )
  })
})
