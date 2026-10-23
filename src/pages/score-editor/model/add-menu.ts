import type { BarMarkChoice, Line } from '@/features/score-editor'
import { isOneOf } from '@/shared/lib'
import {
  midi,
  note,
  TICKS_PER_BEAT,
  type BarMarks,
  type Clef,
  type Hand,
  type Key,
  type Meter,
  type NoteMarks,
  type Pedal,
} from '@/shared/lib/music'
import type { TimedMusic, TimedNote } from '@/shared/lib/notation'

/**
 * What the Insert menu puts at the caret (ADR 0065, 0080), as a notation app's palettes do, each kind
 * a tab of tiles named as MuseScore and Dorico name them: bars (added, deleted, a line or section
 * begun, the caret's bar's own length); repeats (barlines, endings, the signs and jumps); slurs and
 * hairpins (with the octave lines), each one tile drawn over the notes in one go; expression text and
 * the pedal; a hand's fingering (its bar written out as notes first); and the clef change of the
 * caret's staff. What is the song's as a whole (its key, time signature, tempo, parts) is the Song
 * sheet's alone.
 */
export const ADD_TABS = ['bars', 'repeats', 'lines', 'expression', 'fingering', 'clef'] as const
export type AddTab = (typeof ADD_TABS)[number]

/**
 * The lines Insert draws, one tile each, in two groups: slurs and hairpins, then the octave lines;
 * each with how its tile draws it, from a first note to a last.
 */
export const LINE_TILES = [
  { line: 'slur', group: 'slurs', from: { slurStart: true }, to: { slurEnd: true } },
  { line: 'cresc', group: 'slurs', from: { hairpin: 'cresc' }, to: { hairpin: 'end' } },
  { line: 'dim', group: 'slurs', from: { hairpin: 'dim' }, to: { hairpin: 'end' } },
  { line: '8va', group: 'octaves', from: { octave: '8va' }, to: { octave: '8va' } },
  { line: '8vb', group: 'octaves', from: { octave: '8vb' }, to: { octave: '8vb' } },
] as const satisfies readonly {
  line: Line
  group: 'slurs' | 'octaves'
  from: NoteMarks
  to: NoteMarks
}[]
export type LineTile = (typeof LINE_TILES)[number]

/** The pedal's tiles: each mark as a score prints it, Ped. down and ✱ up (a change both). */
export const PEDAL_TILES = [
  { pedal: 'down', glyph: '𝆮' },
  { pedal: 'change', glyph: '𝆯𝆮' },
  { pedal: 'up', glyph: '𝆯' },
] as const satisfies readonly { pedal: Pedal; glyph: string }[]

const C_MAJOR: Key = { tonic: note('C'), minor: false }

/** How each of the Barlines' tiles draws its mark on a bar. */
export const BARLINE_TILES: Readonly<Record<BarMarkChoice, BarMarks>> = {
  repeatStart: { repeatStart: true },
  repeatEnd: { barline: 'repeat' },
  ending1: { ending: 1 },
  ending2: { ending: 2 },
  double: { barline: 'double' },
  final: { barline: 'final' },
  plain: {},
  segno: { segno: true },
  coda: { coda: true },
  toCoda: { toCoda: true },
  fine: { fine: true },
  dc: { jump: 'dc' },
  'dc-fine': { jump: 'dc-fine' },
  'dc-coda': { jump: 'dc-coda' },
  ds: { jump: 'ds' },
  'ds-fine': { jump: 'ds-fine' },
  'ds-coda': { jump: 'ds-coda' },
}

/**
 * The repeats' marks a score prints as a sign or words (as `scoreToMei` prints them), which their
 * tiles show as such rather than engraved over a bar: a bar wide enough for "D.S. al Coda" would not
 * fit a phone's tile.
 */
export const JUMP_SIGNS = {
  segno: '\u{1D10B}',
  coda: '\u{1D10C}',
} as const satisfies Partial<Readonly<Record<BarMarkChoice, string>>>
/** The jumps printed as words, each glossed under them in its tile. */
export const JUMP_WORDS = {
  toCoda: 'To Coda',
  fine: 'Fine',
  dc: 'D.C.',
  'dc-fine': 'D.C. al Fine',
  'dc-coda': 'D.C. al Coda',
  ds: 'D.S.',
  'ds-fine': 'D.S. al Fine',
  'ds-coda': 'D.S. al Coda',
} as const satisfies Partial<Readonly<Record<BarMarkChoice, string>>>
export type JumpWords = keyof typeof JUMP_WORDS
export type JumpSign = keyof typeof JUMP_SIGNS
export const isJumpWords = isOneOf(Object.keys(JUMP_WORDS) as JumpWords[])
export const isJumpSign = isOneOf(Object.keys(JUMP_SIGNS) as JumpSign[])

/** A clef tile's picture: an empty bar in C whose hand's staff is in the clef. */
export function clefBar(hand: Hand, clef: Clef): TimedMusic {
  return {
    key: C_MAJOR,
    meter: '4/4',
    bars: [{ startTick: 0, beats: 1, blank: ['treble', 'bass'], clefs: { [hand]: clef } }],
    notes: [],
    chords: [],
  }
}

/**
 * A tile's empty bar of `beats` in `meter`: what a barline's or a bar length's tile engraves. In C,
 * whatever the song's key, so no signature crowds the mark out of its tile.
 */
export function emptyBar(meter: Meter, beats: number, marks: BarMarks = {}): TimedMusic {
  return {
    key: C_MAJOR,
    meter,
    bars: [{ startTick: 0, beats, blank: ['treble', 'bass'], ...marks }],
    notes: [],
    chords: [],
  }
}

/** A line's tile: a bar of four quarter notes on the treble staff, C5 up to F5, the line drawn over them all. */
export function lineMusic({ from, to }: LineTile): TimedMusic {
  const steps = [
    [72, 'C'],
    [74, 'D'],
    [76, 'E'],
    [77, 'F'],
  ] as const
  return {
    key: C_MAJOR,
    meter: '4/4',
    bars: [{ startTick: 0, beats: 4, blank: ['bass'] }],
    notes: steps.map(([key, letter], i): TimedNote => {
      const marks =
        i === 0 ? from : i === steps.length - 1 ? to : 'octave' in from ? from : undefined
      return {
        midi: midi(key),
        spelled: note(letter),
        hand: 'rh',
        startTick: i * TICKS_PER_BEAT,
        durationTicks: TICKS_PER_BEAT,
        ...(marks ? { marks } : {}),
      }
    }),
    chords: [],
  }
}
