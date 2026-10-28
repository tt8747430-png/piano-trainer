import { describe, expect, it } from 'vitest'
import { midi, note, noteName, TICKS_PER_BEAT, type SpelledNote } from '@/shared/lib/music'
import { notate } from './notate'
import type {
  NotesEvent,
  RestEvent,
  ScoreEvent,
  ScoreVoice,
  StaffId,
  TimedMusic,
  TimedNote,
} from './types'
import { ticksOf } from './values'

const B = TICKS_PER_BEAT

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
  it('writes each single staff over the grand staff, top down, its notes on it alone (ADR 0097)', () => {
    const notes = [
      n(72, note('C'), 'staff', 0, 4 * B, { staff: 0 }),
      n(43, note('G'), 'staff', 0, 4 * B, { staff: 1 }),
      n(60, note('C'), 'rh', 0, 4 * B),
    ]
    const score = notate(music(notes, { staves: [{ clef: 'treble' }, { clef: 'bass' }] }))
    expect(score.staves).toEqual(['staff0', 'staff1', 'treble', 'bass'])
    const [bar] = score.measures
    const written = (voices: readonly ScoreVoice[] | undefined) =>
      (voices ?? []).flatMap((voice) => voice.events.flatMap(notesOf)).map((w) => w.midi)
    expect(written(bar?.staves.staff0)).toEqual([72])
    expect(written(bar?.staves.staff1)).toEqual([43])
    expect(written(bar?.staves.treble)).toEqual([60])
    // A single staff in the bass clef says so in every measure; the others keep their own.
    expect(bar?.clefs).toEqual({ staff1: 'bass' })
  })

  it('writes a single staff with nothing on it as a bar’s rest, and no staff the music has not', () => {
    const score = notate(
      music([n(60, note('C'), 'rh', 0, 4 * B), n(76, note('E'), 'staff', 0, 4 * B, { staff: 3 })], {
        staves: [{ clef: 'treble' }],
      }),
    )
    expect(score.staves).toEqual(['staff0', 'treble', 'bass'])
    expect(score.measures[0]?.staves.staff0?.map((voice) => shape(voice.events))).toEqual([
      [['rest', 0, 4 * B]],
    ])
    expect(score.measures[0]?.staves.staff3).toBeUndefined()
    expect(notate(music([n(60, note('C'), 'rh', 0, 4 * B)])).staves).toEqual(['treble', 'bass'])
  })

  it('keeps each bar’s barlines: a repeat, its ending, a double or final barline', () => {
    const score = notate(
      music([n(60, note('C'), 'rh', 0, 4 * B)], {
        bars: [
          { startTick: 0, beats: 4, repeatStart: true, ending: 1, barline: 'repeat' },
          { startTick: 4 * B, beats: 4, barline: 'final' },
        ],
      }),
    )
    expect(
      score.measures.map(({ repeatStart, ending, barline }) => [repeatStart, ending, barline]),
    ).toEqual([
      [true, 1, 'repeat'],
      [undefined, undefined, 'final'],
    ])
  })

  it('writes a pickup under the meter’s signature, as a short first bar', () => {
    const score = notate(
      music([n(60, note('C'), 'rh', 0, B), n(64, note('E'), 'rh', B, 4 * B)], {
        bars: [
          { startTick: 0, beats: 1 },
          { startTick: B, beats: 4 },
        ],
      }),
    )
    expect(score.measures.map((measure) => [measure.time, measure.ticks])).toEqual([
      [{ count: 4, unit: 4 }, B],
      [{ count: 4, unit: 4 }, 4 * B],
    ])
  })

  it('writes a pickup’s values on the meter’s beats: an 8th then a quarter in a beat and a half', () => {
    const score = notate(
      music([n(60, note('C'), 'rh', 0, 0.5 * B), n(64, note('E'), 'rh', 0.5 * B, B)], {
        bars: [
          { startTick: 0, beats: 1.5 },
          { startTick: 1.5 * B, beats: 4 },
        ],
      }),
    )
    const [pickup] = score.measures
    expect(pickup?.staves.treble.map((voice) => shape(voice.events))).toEqual([
      [
        ['notes', 0, 0.5 * B],
        ['notes', 0.5 * B, B],
      ],
    ])
    expect(pickup?.staves.bass.map((voice) => shape(voice.events))).toEqual([
      [
        ['rest', 0, 0.5 * B],
        ['rest', 0.5 * B, B],
      ],
    ])
  })

  it('writes no chord symbol over a bar of no chord (ADR 0114)', () => {
    const score = notate(
      music([n(60, note('C'), 'rh', 0, 4 * B), n(62, note('D'), 'rh', 4 * B, 4 * B)], {
        bars: [
          { startTick: 0, beats: 4 },
          { startTick: 4 * B, beats: 4 },
        ],
      }),
    )
    expect(score.measures.map((measure) => measure.chords)).toEqual([
      [{ tick: 0, symbol: 'C' }],
      [],
    ])
  })

  it('writes a bar of C on a grand staff, with its chord symbol and time signature', () => {
    const score = notate(
      music([
        n(60, note('C'), 'rh', 0, 4 * B),
        n(64, note('E'), 'rh', 0, 4 * B),
        n(48, note('C'), 'lh', 0, 4 * B),
      ]),
    )
    const [measure] = score.measures
    expect(measure?.time).toEqual({ count: 4, unit: 4 })
    expect(measure?.chords).toEqual([{ tick: 0, symbol: 'C' }])
    expect(measure?.staves.treble.map((voice) => shape(voice.events))).toEqual([
      [['notes', 0, 4 * B]],
    ])
    expect(
      notesOf(measure?.staves.treble[0]?.events[0]).map((w) => [w.octave, w.accidental]),
    ).toEqual([
      [4, null],
      [4, null],
    ])
    expect(measure?.staves.bass[0]?.events).toHaveLength(1)
  })

  it('rests where a voice is silent, and writes an empty staff as a whole-bar rest', () => {
    const score = notate(music([n(60, note('C'), 'rh', B, B)]))
    const [measure] = score.measures
    expect(shape(measure?.staves.treble[0]?.events ?? [])).toEqual([
      ['rest', 0, B],
      ['notes', B, B],
      ['rest', 2 * B, 2 * B],
    ])
    expect(shape(measure?.staves.bass[0]?.events ?? [])).toEqual([['rest', 0, 4 * B]])
  })

  it('ties a note across the barline', () => {
    const score = notate(
      music([n(48, note('C'), 'lh', 3 * B, 2 * B)], {
        bars: [
          { startTick: 0, beats: 4 },
          { startTick: 4 * B, beats: 4 },
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

  it('writes a note cut short before the barline afresh in the next bar, its accidental printed', () => {
    const score = notate(
      music(
        [
          // A third voice's F♯ joins the chord starting with it, cut short where that chord ends.
          n(72, note('C'), 'rh', 0, 4 * B),
          n(69, note('A'), 'rh', 2 * B, B),
          n(66, note('F', 1), 'rh', 2 * B, 4 * B),
        ],
        {
          bars: [
            { startTick: 0, beats: 4 },
            { startTick: 4 * B, beats: 4 },
          ],
        },
      ),
    )
    const [first, second] = score.measures
    const cut = first?.staves.treble
      .flatMap((voice) => voice.events)
      .flatMap((event) => notesOf(event))
      .find((written) => written.midi === 66)
    expect(cut?.tie).toBe(false)
    const fresh = second?.staves.treble
      .flatMap((voice) => voice.events)
      .flatMap((event) => notesOf(event))
      .find((written) => written.midi === 66)
    expect(fresh).toMatchObject({ accidental: 1, tie: false })
  })

  it('writes a bar in its own key: its measure carries it, and its signature says its flats', () => {
    const beat = TICKS_PER_BEAT
    const gFlat = n(66, note('G', -1), 'rh', 4 * beat, 4 * beat)
    const score = notate(
      music([n(66, note('G', -1), 'rh', 0, 4 * beat), gFlat], {
        bars: [
          { startTick: 0, beats: 4 },
          { startTick: 4 * beat, beats: 4, key: { tonic: note('D', -1), minor: false } },
        ],
      }),
    )
    expect(score.measures.map((measure) => measure.key && noteName(measure.key.tonic))).toEqual([
      undefined,
      'D♭',
    ])
    const accidentals = score.measures.map(
      (measure) => notesOf(measure.staves.treble[0]?.events[0])[0]?.accidental,
    )
    expect(accidentals).toEqual([-1, null])
  })

  it('puts a note’s marks on the piece it starts, its slur’s end on the piece it ends', () => {
    const beat = TICKS_PER_BEAT
    const marks = {
      articulations: ['accent' as const],
      slurStart: true as const,
      slurEnd: true as const,
    }
    // A note from beat 2 to beat 4 is written as two tied quarters.
    const score = notate(music([n(72, note('C'), 'rh', beat, 2 * beat, { marks })]))
    const events = score.measures[0]?.staves.treble[0]?.events.filter((e) => e.kind === 'notes')
    expect(events?.map((event) => event.kind === 'notes' && event.marks)).toEqual([
      { articulations: ['accent'], slurStart: true },
      { slurEnd: true },
    ])
  })

  it('writes a note under an 8va line an octave lower than it sounds, every piece marked', () => {
    const score = notate(
      music([n(84, note('C'), 'rh', 0, 4 * TICKS_PER_BEAT, { marks: { octave: '8va' } })]),
    )
    const [event] = score.measures[0]?.staves.treble[0]?.events ?? []
    expect(event?.kind === 'notes' && [event.notes[0]?.octave, event.notes[0]?.midi]).toEqual([
      5, 84,
    ])
    expect(event?.kind === 'notes' && event.marks).toEqual({ octave: '8va' })
  })

  it('prints the accidentals the key and the bar do not say', () => {
    const score = notate(
      music(
        [
          n(66, note('F', 1), 'rh', 0, B),
          n(65, note('F'), 'rh', B, B),
          n(65, note('F'), 'rh', 2 * B, B),
          n(66, note('F', 1), 'rh', 3 * B, B),
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
        n(60, note('C'), 'rh', 0.5 * B, B, { finger: 1 }),
        n(64, note('E'), 'rh', 0.5 * B, B, { finger: 3 }),
      ]),
    )
    const events = (score.measures[0]?.staves.treble[0]?.events ?? []).filter(
      (event): event is NotesEvent => event.kind === 'notes',
    )
    expect(events.map((event) => [event.tick, event.notes.map((w) => [w.tie, w.finger])])).toEqual([
      [
        0.5 * B,
        [
          [true, 1],
          [true, 3],
        ],
      ],
      [
        B,
        [
          [false, undefined],
          [false, undefined],
        ],
      ],
    ])
  })

  it('writes a bar in its own meter whole, a pickup only where it is short of that meter (ADR 0097)', () => {
    const score = notate(
      music([n(60, note('C'), 'rh', 0, 3 * B)], {
        bars: [
          { startTick: 0, beats: 3, meter: '3/4' },
          { startTick: 3 * B, beats: 2, meter: '3/4' },
          { startTick: 5 * B, beats: 4 },
        ],
      }),
    )
    expect(score.measures.map((measure) => [measure.time, measure.ticks])).toEqual([
      [{ count: 3, unit: 4 }, 3 * B],
      [{ count: 2, unit: 4 }, 2 * B],
      [{ count: 4, unit: 4 }, 4 * B],
    ])
    // Its note from the bar's first beat: a dotted half, no rest before it.
    expect(score.measures[0]?.staves.treble.map((voice) => shape(voice.events))).toEqual([
      [['notes', 0, 3 * B]],
    ])
    const pickup = notate(
      music([], {
        bars: [
          { startTick: 0, beats: 1, meter: '3/4' },
          { startTick: B, beats: 3, meter: '3/4' },
        ],
      }),
    )
    expect(pickup.measures.map((measure) => measure.time)).toEqual([
      { count: 3, unit: 4 },
      { count: 3, unit: 4 },
    ])
  })

  it('writes a short first bar of music going on from bars before as a short bar, no pickup', () => {
    const score = notate(
      music([n(60, note('C'), 'rh', 0, 2 * B)], {
        bars: [
          { startTick: 0, beats: 2 },
          { startTick: 2 * B, beats: 4 },
        ],
        continued: true,
      }),
    )
    expect(score.measures.map((measure) => measure.time)).toEqual([
      { count: 2, unit: 4 },
      { count: 4, unit: 4 },
    ])
  })

  it('writes each bar’s time signature', () => {
    const score = notate(
      music([], {
        bars: [
          { startTick: 0, beats: 4 },
          { startTick: 4 * B, beats: 2 },
        ],
      }),
    )
    expect(score.measures.map((measure) => measure.time)).toEqual([
      { count: 4, unit: 4 },
      { count: 2, unit: 4 },
    ])
  })

  it('prints the first voice’s rests and hides the second’s', () => {
    const score = notate(music([n(55, note('G'), 'lh', 0, B), n(48, note('C'), 'lh', 0, 2 * B)]))
    const voices = score.measures[0]?.staves.bass ?? []
    expect(
      voices.map((voice) =>
        voice.events
          .filter((event): event is RestEvent => event.kind === 'rest')
          .map((rest) => [rest.tick, rest.hidden]),
      ),
    ).toEqual([
      [
        [B, false],
        [2 * B, false],
      ],
      [[2 * B, true]],
    ])
  })
})

describe('notate with a blank staff', () => {
  it('writes a staff the bar leaves blank as one hidden rest', () => {
    const score = notate(
      music([n(60, note('C'), 'rh', 0, 4 * B)], {
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

describe('notate a lead sheet (ADR 0114)', () => {
  it('writes no piano where the music leaves it out: its single staves alone', () => {
    const notes = [
      n(72, note('C'), 'staff', 0, 4 * B, { staff: 0 }),
      n(60, note('C'), 'rh', 0, 4 * B),
    ]
    const lead = notate(music(notes, { staves: [{ clef: 'treble' }], piano: false }))
    expect(lead.staves).toEqual(['staff0'])
    expect(lead.measures[0]?.staves.treble).toEqual([])
  })
})

describe('notate the words (ADR 0097)', () => {
  const sung = (text: string, hyphen = false, held = 0) => ({ text, hyphen, held })
  /** Each voice's written notes' syllables in order, rests left out. */
  const verses = (score: ReturnType<typeof notate>, staff: StaffId) =>
    score.measures.flatMap((measure) =>
      (measure.staves[staff] ?? []).flatMap((voice) =>
        voice.events.flatMap((event) => (event.kind === 'notes' ? [event.lyrics ?? null] : [])),
      ),
    )
  const OVER = { staves: [{ clef: 'treble' as const }] }

  it('writes each syllable on the piece that starts its note, none on a tied continuation', () => {
    const score = notate(
      music(
        [
          n(72, note('C'), 'staff', 0, 2 * B, { staff: 0, lyrics: [sung('Si', true, 1)] }),
          n(74, note('D'), 'staff', 2 * B, B, { staff: 0 }),
          n(76, note('E'), 'staff', 3 * B, 2 * B, {
            staff: 0,
            lyrics: [sung('lent'), sung('ho', true)],
          }),
        ],
        {
          bars: [
            { startTick: 0, beats: 4 },
            { startTick: 4 * B, beats: 4 },
          ],
          ...OVER,
        },
      ),
    )
    expect(verses(score, 'staff0')).toEqual([
      [sung('Si', true, 1)],
      null,
      [sung('lent'), sung('ho', true)],
      null,
    ])
  })

  it('writes the words under the top staff whose notes sing them alone', () => {
    const notes = [
      n(72, note('C'), 'staff', 0, 4 * B, { staff: 1, lyrics: [sung('one')] }),
      n(76, note('E'), 'staff', 0, 4 * B, { staff: 0 }),
      n(64, note('E'), 'rh', 0, 4 * B, { lyrics: [sung('one')] }),
      n(48, note('C'), 'lh', 0, 4 * B, { lyrics: [sung('one')] }),
    ]
    const score = notate(music(notes, { staves: [{ clef: 'treble' }, { clef: 'treble' }] }))
    expect(verses(score, 'staff0')).toEqual([null])
    expect(verses(score, 'staff1')).toEqual([[sung('one')]])
    expect(verses(score, 'treble')).toEqual([null])
    expect(verses(score, 'bass')).toEqual([null])
  })

  it('writes them under the upper staff where its notes sing them, in its first voice alone', () => {
    const notes = [
      n(76, note('E'), 'staff', 0, 4 * B, { staff: 0 }),
      n(72, note('C'), 'rh', 0, 4 * B, { lyrics: [sung('one')] }),
      n(64, note('E'), 'rh', 0, 2 * B, { lyrics: [sung('one')] }),
      n(62, note('D'), 'rh', 2 * B, 2 * B),
    ]
    const score = notate(music(notes, OVER))
    // Two voices on the treble: the upper sings, the lower under it is silent.
    expect(verses(score, 'treble')).toEqual([[sung('one')], null, null])
    expect(verses(score, 'staff0')).toEqual([null])
  })

  it('lets a chord’s one note sing for the chord', () => {
    const score = notate(
      music([
        n(72, note('C'), 'rh', 0, 4 * B, { lyrics: [sung('one')] }),
        n(76, note('E'), 'rh', 0, 4 * B),
        n(60, note('C'), 'rh', 0, 4 * B),
      ]),
    )
    expect(verses(score, 'treble')).toEqual([[sung('one')]])
  })
})
