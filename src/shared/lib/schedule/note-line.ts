import {
  beatsPerBar,
  parseNoteInOctave,
  TICKS_PER_BEAT,
  type Hand,
  type Key,
} from '@/shared/lib/music'
import type { TimedMusic, TimedNote } from '@/shared/lib/notation'

/** The meters a line of notes is written in: simple ones, whose beat is a quarter note. */
export const NOTE_LINE_METERS = ['2/4', '3/4', '4/4'] as const
export type NoteLineMeter = (typeof NOTE_LINE_METERS)[number]

/** A value's length in quarter notes: 1 a whole note, 8 an eighth. */
const QUARTERS = new Map([
  ['1', 4],
  ['2', 2],
  ['4', 1],
  ['8', 0.5],
])
const TOKEN = /^([^/]+)(?:\/(\d+)(\.?))?$/

/**
 * A line of notes as a lesson writes it, `E4 G4/2 B4/8.`: each note with its octave, then its value
 * after a slash (1 whole, 2 half, 4 quarter, 8 eighth; a quarter when left out) and a dot for half as
 * long again; in whole bars of its meter, one hand's, in a key.
 */
export function noteLine(
  text: string,
  options: { readonly hand: Hand; readonly meter: NoteLineMeter; readonly key: Key },
): TimedMusic {
  const tokens = text.split(/\s+/).filter(Boolean)
  if (tokens.length === 0) throw new RangeError('A line of notes needs a note')
  const notes: TimedNote[] = []
  let tick = 0
  for (const token of tokens) {
    const [, name = '', value = '4', dot = ''] = TOKEN.exec(token) ?? []
    const read = parseNoteInOctave(name)
    const quarters = QUARTERS.get(value)
    if (!read || quarters === undefined) throw new RangeError(`Cannot read "${token}" as a note`)
    const length = quarters * TICKS_PER_BEAT * (dot ? 1.5 : 1)
    notes.push({
      midi: read.midi,
      spelled: read.note,
      hand: options.hand,
      startTick: tick,
      durationTicks: length,
      roll: 0,
    })
    tick += length
  }
  const beats = beatsPerBar(options.meter)
  const barTicks = beats * TICKS_PER_BEAT
  return {
    key: options.key,
    meter: options.meter,
    bars: Array.from({ length: Math.ceil(tick / barTicks) }, (_, bar) => ({
      startTick: bar * barTicks,
      beats,
    })),
    notes,
    chords: [],
  }
}
