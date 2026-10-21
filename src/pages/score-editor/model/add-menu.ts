import { barLengths, metersFor, type BarMarkChoice, type MarkChoice } from '@/features/score-editor'
import {
  keySignature,
  LETTERS,
  midi,
  note,
  ROOT_ACCIDENTALS,
  TICKS_PER_BEAT,
  isWrittenKey,
  type BarMarks,
  type Key,
  type Meter,
  type NoteMarks,
  type Tick,
} from '@/shared/lib/music'
import type { TimedMusic, TimedNote } from '@/shared/lib/notation'

/**
 * What the + menu adds to the score, as Sibelius's does, each kind a tab of tiles: bars, lines and
 * sections; barlines (repeats, endings, a double or final barline); lines over notes (slurs, hairpins, octave lines); the key signature; the time signature;
 * and the staves (the tune's, the chord names' row).
 */
export const ADD_TABS = ['bars', 'barlines', 'lines', 'key', 'time', 'staves'] as const
export type AddTab = (typeof ADD_TABS)[number]

/** Sharps first, fewest first, then flats: a signature's place in a chooser, as a score's index lists them. */
const signatureOrder = (key: Key) => {
  const count = keySignature(key)
  return count >= 0 ? count : 7 - count
}

/** Every key a signature writes, in one mode: its fifteen, C (or A) first, then sharps, then flats. */
export function keyTiles(minor: boolean): Key[] {
  return LETTERS.flatMap((letter) =>
    ROOT_ACCIDENTALS.map((accidental): Key => ({ tonic: note(letter, accidental), minor })),
  )
    .filter(isWrittenKey)
    .sort((a, b) => signatureOrder(a) - signatureOrder(b))
}

/** The time signature tiles: the song's meters of its kind, and the lengths the caret's bar may take. */
export function timeTiles(meter: Meter): { meters: Meter[]; lengths: Tick[] } {
  return { meters: metersFor(meter), lengths: barLengths(meter) }
}

/**
 * The lines the + menu adds over the notes at the caret, as the palette's marks are added; each with
 * how its tile draws it, from a first note to a second.
 */
export const LINE_TILES = [
  {
    mark: { kind: 'slurStart' },
    word: 'slurStart',
    from: { slurStart: true },
    to: { slurEnd: true },
  },
  { mark: { kind: 'slurEnd' }, word: 'slurEnd', from: { slurStart: true }, to: { slurEnd: true } },
  {
    mark: { kind: 'hairpin', hairpin: 'cresc' },
    word: 'cresc',
    from: { hairpin: 'cresc' },
    to: { hairpin: 'end' },
  },
  {
    mark: { kind: 'hairpin', hairpin: 'dim' },
    word: 'dim',
    from: { hairpin: 'dim' },
    to: { hairpin: 'end' },
  },
  {
    mark: { kind: 'hairpin', hairpin: 'end' },
    word: 'hairpinEnd',
    from: { hairpin: 'cresc' },
    to: { hairpin: 'end' },
  },
  {
    mark: { kind: 'octave', octave: '8va' },
    word: 'ottava',
    from: { octave: '8va' },
    to: { octave: '8va' },
  },
  {
    mark: { kind: 'octave', octave: '8vb' },
    word: 'ottavaBassa',
    from: { octave: '8vb' },
    to: { octave: '8vb' },
  },
] as const satisfies readonly { mark: MarkChoice; word: string; from: NoteMarks; to: NoteMarks }[]
export type LineTile = (typeof LINE_TILES)[number]

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
}

/** A tile's empty bar of `beats`, in `key` and `meter`: what a signature's tile engraves. */
export function emptyBar(key: Key, meter: Meter, beats: number, marks: BarMarks = {}): TimedMusic {
  return {
    key,
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
