import { describe, expect, it } from 'vitest'
import { midi, note, type SpelledNote } from '@/shared/lib/music'
import { notate } from './notate'
import type { NotesEvent, RestEvent, ScoreEvent, TimedMusic, TimedNote } from './types'
import { ticksOf } from './values'

const n = (
  key: number,
  spelled: SpelledNote,
  hand: TimedNote['hand'],
  startTick: number,
  durationTicks: number,
  extra: Partial<TimedNote> = {},
): TimedNote => ({ midi: midi(key), spelled, hand, startTick, durationTicks, ...extra })

const music = (notes: TimedNote[], extra: Partial<TimedMusic> = {}): TimedMusic => ({
  key: { tonic: note('C'), minor: false },
  meter: '4/4',
  bars: [{ startTick: 0, beats: 4 }],
  notes,
  chords: [{ startTick: 0, symbol: 'C' }],
  ...extra,
})

const shape = (events: readonly ScoreEvent[]) =>
  events.map((event) => [event.kind, event.tick, ticksOf(event.duration, '4/4')])
const notesOf = (event: ScoreEvent | undefined) => (event?.kind === 'notes' ? event.notes : [])

describe('notate', () => {
  it('writes a pickup under the meter’s signature, as a short first bar', () => {
    const score = notate(
      music([n(60, note('C'), 'rh', 0, 12), n(64, note('E'), 'rh', 12, 48)], {
        bars: [
          { startTick: 0, beats: 1 },
          { startTick: 12, beats: 4 },
        ],
      }),
    )
    expect(score.measures.map((measure) => [measure.time, measure.ticks])).toEqual([
      [{ count: 4, unit: 4 }, 12],
      [{ count: 4, unit: 4 }, 48],
    ])
  })

  it('writes a bar of C on a grand staff, with its chord symbol and time signature', () => {
    const score = notate(
      music([
        n(60, note('C'), 'rh', 0, 48),
        n(64, note('E'), 'rh', 0, 48),
        n(48, note('C'), 'lh', 0, 48),
      ]),
    )
    const [measure] = score.measures
    expect(measure?.time).toEqual({ count: 4, unit: 4 })
    expect(measure?.chords).toEqual([{ tick: 0, symbol: 'C' }])
    expect(measure?.staves.treble.map((voice) => shape(voice.events))).toEqual([[['notes', 0, 48]]])
    expect(
      notesOf(measure?.staves.treble[0]?.events[0]).map((w) => [w.octave, w.accidental]),
    ).toEqual([
      [4, null],
      [4, null],
    ])
    expect(measure?.staves.bass[0]?.events).toHaveLength(1)
  })

  it('rests where a voice is silent, and writes an empty staff as a whole-bar rest', () => {
    const score = notate(music([n(60, note('C'), 'rh', 12, 12)]))
    const [measure] = score.measures
    expect(shape(measure?.staves.treble[0]?.events ?? [])).toEqual([
      ['rest', 0, 12],
      ['notes', 12, 12],
      ['rest', 24, 24],
    ])
    expect(shape(measure?.staves.bass[0]?.events ?? [])).toEqual([['rest', 0, 48]])
  })

  it('ties a note across the barline', () => {
    const score = notate(
      music([n(48, note('C'), 'lh', 36, 24)], {
        bars: [
          { startTick: 0, beats: 4 },
          { startTick: 48, beats: 4 },
        ],
      }),
    )
    const [first, second] = score.measures
    const tied = first?.staves.bass[0]?.events.at(-1)
    expect(notesOf(tied)[0]?.tie).toBe(true)
    expect(notesOf(second?.staves.bass[0]?.events[0])[0]).toMatchObject({
      tie: false,
      accidental: null,
    })
  })

  it('prints the accidentals the key and the bar do not say', () => {
    const score = notate(
      music(
        [
          n(66, note('F', 1), 'rh', 0, 12),
          n(65, note('F'), 'rh', 12, 12),
          n(65, note('F'), 'rh', 24, 12),
          n(66, note('F', 1), 'rh', 36, 12),
        ],
        { key: { tonic: note('G'), minor: false } },
      ),
    )
    const events = score.measures[0]?.staves.treble[0]?.events ?? []
    expect(events.map((event) => notesOf(event)[0]?.accidental)).toEqual([null, 0, null, 1])
  })

  it('writes a hand’s tied pieces with one finger', () => {
    const score = notate(
      music([
        n(60, note('C'), 'rh', 6, 12, { finger: 1 }),
        n(64, note('E'), 'rh', 6, 12, { finger: 3 }),
      ]),
    )
    const events = (score.measures[0]?.staves.treble[0]?.events ?? []).filter(
      (event): event is NotesEvent => event.kind === 'notes',
    )
    expect(events.map((event) => [event.tick, event.notes.map((w) => [w.tie, w.finger])])).toEqual([
      [
        6,
        [
          [true, 1],
          [true, 3],
        ],
      ],
      [
        12,
        [
          [false, undefined],
          [false, undefined],
        ],
      ],
    ])
  })

  it('writes each bar’s time signature', () => {
    const score = notate(
      music([], {
        bars: [
          { startTick: 0, beats: 4 },
          { startTick: 48, beats: 2 },
        ],
      }),
    )
    expect(score.measures.map((measure) => measure.time)).toEqual([
      { count: 4, unit: 4 },
      { count: 2, unit: 4 },
    ])
  })

  it('prints the first voice’s rests and hides the second’s', () => {
    const score = notate(music([n(55, note('G'), 'lh', 0, 12), n(48, note('C'), 'lh', 0, 24)]))
    const voices = score.measures[0]?.staves.bass ?? []
    expect(
      voices.map((voice) =>
        voice.events
          .filter((event): event is RestEvent => event.kind === 'rest')
          .map((rest) => [rest.tick, rest.hidden]),
      ),
    ).toEqual([
      [
        [12, false],
        [24, false],
      ],
      [[24, true]],
    ])
  })
})

describe('notate with a blank staff', () => {
  it('writes a staff the bar leaves blank as one hidden rest', () => {
    const score = notate(
      music([n(60, note('C'), 'melody', 0, 48)], {
        bars: [{ startTick: 0, beats: 4, blank: ['bass'] }],
      }),
    )
    const [measure] = score.measures
    expect(measure?.staves.bass).toEqual([
      { events: [expect.objectContaining({ kind: 'rest', tick: 0, hidden: true })], stem: 'auto' },
    ])
    expect(measure?.staves.bass[0]?.events).toHaveLength(1)
  })
})
