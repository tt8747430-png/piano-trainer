import type { Performance, PerformanceNote } from '@/shared/lib/arrangement'
import {
  isCompound,
  meterBeats,
  TICKS_PER_BEAT,
  timeSignature,
  type Meter,
  type Tick,
} from '@/shared/lib/music'
import {
  MIDI_DIVISION,
  noteEvents,
  standardMidiFile,
  type MidiNote,
  type TimedMidiEvent,
} from '@/shared/lib/standard-midi-file'
import { checkedTempo } from './grid'
import { loudness, stressOf } from './marks'
import { pedalSpans } from './pedal-marks'
import { tempoSteps } from './tempo-marks'
import { gainVelocity } from './velocity'

/** The sustain pedal's controller. */
const SUSTAIN = 64
/** The hands' channels; each single staff's after them, past the drums' (channel 10: 9 from 0). */
const RIGHT_CHANNEL = 0
const LEFT_CHANNEL = 1
const DRUMS = 9
const LAST_CHANNEL = 15

/**
 * Each part's name as the screen names it, in the learner's language: a single staff's by its place,
 * top down (ADR 0097: its own name, else its place's), and each hand's.
 */
export interface PartNames {
  readonly staff: (place: number) => string
  readonly rh: string
  readonly lh: string
}

export interface PerformanceMidiOptions {
  /** Beats a minute in the meter's beat, a compound meter's a dotted quarter: the Player's tempo. */
  readonly tempo: number
  /** The music's name, the first track's. */
  readonly title: string
  /** The parts' tracks' names. */
  readonly names: PartNames
  /**
   * Seconds of silence before bar 1, at the first tempo: where a recording's bar 1 begins, so the
   * file lies under it time aligned (ADR 0107). None by default: bar 1 starts the file.
   */
  readonly lead?: number
}

/** A part of the score as a track: its name, its channel, its notes (by index), the pedal's or not. */
interface Part {
  readonly name: string
  readonly channel: number
  readonly notes: readonly number[]
  readonly pedal: boolean
}

/** A staff's channel, by its place: after the hands', the drums' passed over, the last shared. */
function staffChannel(place: number): number {
  const channel = LEFT_CHANNEL + 1 + place
  return Math.min(LAST_CHANNEL, channel >= DRUMS ? channel + 1 : channel)
}

/**
 * The parts top down as the score prints them, named as the screen names them: each single staff,
 * then the right and the left hand, the pedal's.
 */
function partsOf(performance: Performance, names: PartNames): Part[] {
  const playing = (part: (n: PerformanceNote) => boolean) =>
    performance.notes.flatMap((n, i) => (part(n) ? [i] : []))
  const staves = performance.notes.reduce(
    (most, n) => (n.hand === 'staff' ? Math.max(most, (n.staff ?? 0) + 1) : most),
    performance.staves?.length ?? 0,
  )
  return [
    ...Array.from({ length: staves }, (_, place) => ({
      name: names.staff(place),
      channel: staffChannel(place),
      notes: playing((n) => n.hand === 'staff' && (n.staff ?? 0) === place),
      pedal: false,
    })),
    {
      name: names.rh,
      channel: RIGHT_CHANNEL,
      notes: playing((n) => n.hand === 'rh'),
      pedal: true,
    },
    {
      name: names.lh,
      channel: LEFT_CHANNEL,
      notes: playing((n) => n.hand === 'lh'),
      pedal: true,
    },
  ]
}

/**
 * A bar's length as a time signature writes it: a part beat no signature writes (a triplet's) to
 * the nearest sixteenth, the finest a signature counts (a quarter of a simple beat, a sixth of a
 * compound one).
 */
function writtenTime(beats: number, meter: Meter) {
  const sixteenths = isCompound(meter) ? 6 : 4
  return timeSignature(Math.max(1, Math.round(beats * sixteenths)) / sixteenths, meter)
}

/**
 * The music as the Player plays it at `tempo`, as a Standard MIDI File (format 1) a DAW opens: a
 * first track of its title, its tempo as its marks move it (`tempoSteps`, the Player's rule) and a
 * time signature wherever a bar's length or meter changes (a pickup, a short bar, a section's
 * meter); then a track for each part on a channel of its own, top down as the score prints them,
 * each note struck and let go as written, as loud as its dynamics and accents play it, and the
 * sustain pedal as its marks hold it on the hands' tracks. Notes written silent are written too: the
 * file is the whole score, and a DAW mutes nothing.
 */
export function performanceMidi(
  performance: Performance,
  options: PerformanceMidiOptions,
): Uint8Array<ArrayBuffer> {
  const tempo = checkedTempo(options.tempo)
  // A compound meter's beat, its click, is a dotted quarter.
  const click = isCompound(performance.meter) ? 1.5 : 1
  // The tempo and the pedal as every part marks them, whichever the learner hears (ADR 0097).
  const marked = performance.timing ?? performance.notes
  const steps = tempoSteps(marked)
  // The silence before bar 1, in the file's ticks at the music's first tempo.
  const first = tempo * (steps[0]?.factor ?? 1) * click
  const lead = Math.round(((options.lead ?? 0) * first * MIDI_DIVISION) / 60)
  const fileTick = (tick: Tick) =>
    lead + Math.round((tick * MIDI_DIVISION * click) / TICKS_PER_BEAT)
  // What holds from bar 1 holds from the file's start, through the lead.
  const markTick = (tick: Tick) => (tick === 0 ? 0 : fileTick(tick))
  const end = fileTick(performance.totalTicks)

  const signatures: TimedMidiEvent[] = []
  for (const bar of performance.bars) {
    const meter = bar.meter ?? performance.meter
    const { count, unit } = writtenTime(bar.beats, meter)
    const last = signatures.at(-1)
    if (last?.kind === 'time' && last.count === count && last.unit === unit) continue
    // Clicked on the meter's counted beat (ADR 0114): a half in 2/2, two eighths first in 7/8.
    const beat = ((meterBeats(meter)[0] ?? TICKS_PER_BEAT) / TICKS_PER_BEAT) * click
    signatures.push({ tick: markTick(bar.startTick), kind: 'time', count, unit, click: beat })
  }
  const music: TimedMidiEvent[] = [
    { tick: 0, kind: 'name', text: options.title },
    ...signatures,
    ...steps.map((step): TimedMidiEvent => ({
      tick: markTick(step.tick),
      kind: 'tempo',
      quarters: tempo * step.factor * click,
    })),
  ]

  const levels = loudness(performance.notes)
  /**
   * A part's notes; a key it strikes twice at once (a figure's voice doubling its chord) struck
   * once, held the longer, as loud as the louder.
   */
  const notesOf = (part: Part): MidiNote[] => {
    const struck = new Map<string, MidiNote>()
    for (const i of part.notes) {
      const n = performance.notes[i]
      if (!n) continue
      const note: MidiNote = {
        key: n.midi,
        on: fileTick(n.startTick),
        // The Player cuts what sounds past the music's end there.
        off: fileTick(Math.min(n.startTick + n.durationTicks, performance.totalTicks)),
        velocity: gainVelocity(n.velocity * (levels[i] ?? 1) * stressOf(n.marks)),
      }
      const place = `${note.key} ${note.on}`
      const there = struck.get(place)
      struck.set(
        place,
        there
          ? {
              ...there,
              off: Math.max(there.off, note.off),
              velocity: Math.max(there.velocity, note.velocity),
            }
          : note,
      )
    }
    return [...struck.values()]
  }
  const pedal = (channel: number): TimedMidiEvent[] =>
    pedalSpans(marked).flatMap(({ from, to }): TimedMidiEvent[] => [
      { tick: fileTick(from), kind: 'control', channel, controller: SUSTAIN, value: 127 },
      // A pedal never let up comes up where the music ends.
      {
        tick: fileTick(Math.min(to, performance.totalTicks)),
        kind: 'control',
        channel,
        controller: SUSTAIN,
        value: 0,
      },
    ])

  return standardMidiFile([
    { events: music, end },
    ...partsOf(performance, options.names).map((part) => ({
      events: [
        { tick: 0, kind: 'name', text: part.name } satisfies TimedMidiEvent,
        ...noteEvents(notesOf(part), part.channel),
        ...(part.pedal ? pedal(part.channel) : []),
      ],
      end,
    })),
  ])
}
