import { describe, expect, it } from 'vitest'
import { midi, note, TICKS_PER_BEAT } from '@/shared/lib/music'
import type { Duration, Measure, ScoreEvent, ScoreVoice } from '@/shared/lib/notation'
import { StaveNote } from 'vexflow/core'
import { buildVoice } from './vexflow-notes'

const eighth: Duration = { value: 8, dots: 0, triplet: false }
const tripletEighth: Duration = { value: 8, dots: 0, triplet: true }
const quarter: Duration = { value: 4, dots: 0, triplet: false }
const half: Duration = { value: 2, dots: 0, triplet: false }

const played = (tick: number, duration: Duration): ScoreEvent => ({
  kind: 'notes',
  tick,
  duration,
  notes: [{ midi: midi(60), spelled: note('C'), octave: 4, accidental: null, tie: false }],
})
const chord = (tick: number, duration: Duration): ScoreEvent => ({
  kind: 'notes',
  tick,
  duration,
  notes: [
    { midi: midi(66), spelled: note('F', 1), octave: 4, accidental: null, tie: false },
    { midi: midi(74), spelled: note('D'), octave: 5, accidental: null, tie: false },
  ],
})
const hidden = (tick: number, duration: Duration): ScoreEvent => ({
  kind: 'rest',
  tick,
  duration,
  hidden: true,
})

const measure = (startTick: number, count: number, voice: ScoreVoice): Measure => ({
  startTick,
  ticks: count * TICKS_PER_BEAT,
  time: { count, unit: 4 },
  staves: { melody: [], treble: [voice], bass: [] },
  chords: [],
})

const build = (startTick: number, count: number, voice: ScoreVoice, { names = false } = {}) =>
  buildVoice(voice, {
    staff: 'treble',
    measure: measure(startTick, count, voice),
    meter: '4/4',
    fingers: false,
    names,
    key: { tonic: note('C'), minor: false },
  })

const headsOf = (built: ReturnType<typeof buildVoice>) =>
  built.notes.map(({ note }) =>
    note instanceof StaveNote ? note.noteHeads.map((head) => head.text) : [],
  )

describe('buildVoice', () => {
  it('draws a note’s marks on it: articulations, an ornament, a roll, grace notes and a dynamic', () => {
    const voice: ScoreVoice = {
      stem: 'auto',
      events: [
        {
          kind: 'notes',
          tick: 0,
          duration: { value: 1, dots: 0, triplet: false },
          notes: [{ midi: midi(72), spelled: note('C'), octave: 5, accidental: null, tie: false }],
          marks: {
            articulations: ['accent', 'fermata'],
            ornament: 'trill',
            arpeggio: true,
            grace: [{ midi: midi(74), spelled: note('D') }],
            dynamic: 'mf',
          },
        },
      ],
    }
    const [built] = build(0, 4, voice).notes
    const kinds = built?.note
      .getModifiers()
      .map((modifier) => modifier.getCategory())
      .sort()
    expect(kinds).toEqual([
      'Annotation',
      'Articulation',
      'Articulation',
      'GraceNoteGroup',
      'Ornament',
      'Stroke',
    ])
  })

  it('beams by the beat across a second voice’s hidden rest, never over it', () => {
    const voice: ScoreVoice = {
      stem: 'down',
      events: [
        played(0, eighth),
        hidden(12, eighth),
        played(24, eighth),
        played(36, eighth),
        hidden(48, { value: 2, dots: 0, triplet: false }),
      ],
    }
    const built = build(0, 4, voice)
    const tickOf = (note: unknown) => built.notes.find((each) => each.note === note)?.event.tick
    expect(built.beams.map((beam) => beam.getNotes().map(tickOf))).toEqual([[24, 36]])
  })

  it('brackets a triplet beat counted from its bar’s start', () => {
    const voice: ScoreVoice = {
      stem: 'auto',
      events: [
        played(36, tripletEighth),
        played(44, tripletEighth),
        played(52, tripletEighth),
        played(60, quarter),
      ],
    }
    const built = build(36, 2, voice)
    expect(built.tuplets.map((tuplet) => tuplet.getNotes().length)).toEqual([3])
  })

  it('names each head with Named notes, beamed eighths’ too, whose stems are set after they are built', () => {
    const voice: ScoreVoice = {
      stem: 'auto',
      events: [chord(0, eighth), chord(12, eighth), played(24, half)],
    }
    // F♯ and D filled, then C in a half note's hollow head (SMuFL's note name noteheads).
    expect(headsOf(build(0, 3, voice, { names: true }))).toEqual([
      ['\uE1A7', '\uE1A0'],
      ['\uE1A7', '\uE1A0'],
      ['\uE186'],
    ])
  })

  it('keeps plain heads without Named notes', () => {
    const voice: ScoreVoice = { stem: 'auto', events: [played(0, quarter)] }
    expect(headsOf(build(0, 1, voice))).toEqual([['\uE0A4']])
  })
})
