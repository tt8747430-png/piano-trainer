import { describe, expect, it } from 'vitest'
import { midi, note } from '@/shared/lib/music'
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
  ticks: count * 12,
  time: { count, unit: 4 },
  staves: { treble: [voice], bass: [] },
  chords: [],
})

const build = (startTick: number, count: number, voice: ScoreVoice, { names = false } = {}) =>
  buildVoice(voice, {
    staff: 'treble',
    measure: measure(startTick, count, voice),
    meter: '4/4',
    fingers: false,
    names,
  })

const headsOf = (built: ReturnType<typeof buildVoice>) =>
  built.notes.map(({ note }) =>
    note instanceof StaveNote ? note.noteHeads.map((head) => head.text) : [],
  )

describe('buildVoice', () => {
  it('beams by the beat across a second voice’s hidden rest, never over it', () => {
    const voice: ScoreVoice = {
      stem: 'down',
      events: [
        played(0, eighth),
        hidden(6, eighth),
        played(12, eighth),
        played(18, eighth),
        hidden(24, { value: 2, dots: 0, triplet: false }),
      ],
    }
    const built = build(0, 4, voice)
    const tickOf = (note: unknown) => built.notes.find((each) => each.note === note)?.event.tick
    expect(built.beams.map((beam) => beam.getNotes().map(tickOf))).toEqual([[12, 18]])
  })

  it('brackets a triplet beat counted from its bar’s start', () => {
    const voice: ScoreVoice = {
      stem: 'auto',
      events: [
        played(18, tripletEighth),
        played(22, tripletEighth),
        played(26, tripletEighth),
        played(30, quarter),
      ],
    }
    const built = build(18, 2, voice)
    expect(built.tuplets.map((tuplet) => tuplet.getNotes().length)).toEqual([3])
  })

  it('names each head with Named notes, beamed eighths’ too, whose stems are set after they are built', () => {
    const voice: ScoreVoice = {
      stem: 'auto',
      events: [chord(0, eighth), chord(6, eighth), played(12, half)],
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
