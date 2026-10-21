import {
  beatsPerBar,
  isCompound,
  parseNoteInOctave,
  TICKS_PER_BEAT,
  type Hand,
  type Key,
} from '@/shared/lib/music'
import type { TimedMusic, TimedNote } from '@/shared/lib/notation'

/** The meters a line of notes is written in: simple ones, whose beat is a quarter note, and compound
 *  ones, whose beat is a dotted quarter. */
export type NoteLineMeter = '2/4' | '3/4' | '4/4' | '6/8' | '12/8'

/** A value's length in quarter notes: 1 a whole note, 16 a sixteenth. */
const QUARTERS = new Map([
  ['1', 4],
  ['2', 2],
  ['4', 1],
  ['8', 0.5],
  ['16', 0.25],
])
const TOKEN = /^([^/~]+)(?:\/(\d+)(\.?))?(~?)$/

/**
 * A line of notes as a lesson writes it, `E4 G4/2 B4/8. r/4 C5/2~ C5/4`: each note with its octave,
 * then its value after a slash (1 whole, 2 half, 4 quarter, 8 eighth, 16 sixteenth; a quarter when left
 * out) and a dot for half as long again; `r` a rest; `~` ties a note to the next, of the same pitch,
 * into one note (written tied where it crosses a barline). One hand's, in a key and a meter, simple
 * or compound.
 */
export function noteLine(
  text: string,
  options: { readonly hand: Hand; readonly meter: NoteLineMeter; readonly key: Key },
): TimedMusic {
  const tokens = text.split(/\s+/).filter(Boolean)
  if (tokens.length === 0) throw new RangeError('A line of notes needs a note')
  // A compound meter's beat is a dotted quarter: a quarter is two thirds of it.
  const ticksPerQuarter = isCompound(options.meter) ? (TICKS_PER_BEAT * 2) / 3 : TICKS_PER_BEAT
  const notes: TimedNote[] = []
  let tick = 0
  let tied: TimedNote | undefined
  for (const token of tokens) {
    const [, name = '', value = '4', dot = '', tie = ''] = TOKEN.exec(token) ?? []
    const quarters = QUARTERS.get(value)
    const rest = name === 'r'
    const read = rest ? undefined : parseNoteInOctave(name)
    if ((!rest && !read) || quarters === undefined || (rest && tie)) {
      throw new RangeError(`Cannot read "${token}" as a note`)
    }
    const length = quarters * ticksPerQuarter * (dot ? 1.5 : 1)
    if (!Number.isInteger(length)) throw new RangeError(`"${token}" falls between ticks`)
    if (tied && (!read || read.midi !== tied.midi)) {
      throw new RangeError(`"${token}" is not the note tied to it`)
    }
    if (tied) {
      const longer = { ...tied, durationTicks: tied.durationTicks + length }
      notes[notes.length - 1] = longer
      tied = tie ? longer : undefined
    } else if (read) {
      const played: TimedNote = {
        midi: read.midi,
        spelled: read.note,
        hand: options.hand,
        startTick: tick,
        durationTicks: length,
      }
      notes.push(played)
      tied = tie ? played : undefined
    }
    tick += length
  }
  if (tied) throw new RangeError('A tie needs a note after it')
  if (notes.length === 0) throw new RangeError('A line of notes needs a note')
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

/**
 * Two hands' lines as one passage on the grand staff, played together: the right hand's notes over
 * the left's, as long as the longer of the two.
 */
export function twoHands(right: TimedMusic, left: TimedMusic): TimedMusic {
  const longer = left.bars.length > right.bars.length ? left : right
  return {
    ...right,
    bars: longer.bars,
    notes: [...right.notes, ...left.notes].sort((a, b) => a.startTick - b.startTick),
  }
}
