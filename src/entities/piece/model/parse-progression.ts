import type { Chart, ChartBar, ChartChord } from '@/shared/lib/arrangement'
import {
  beatsPerBar,
  CHORD_QUALITIES,
  scaleIntervals,
  spellAbove,
  spellChord,
  TICKS_PER_BEAT,
  type Chord,
  type ChordQuality,
  type ChordRole,
  type Tick,
} from '@/shared/lib/music'
import { isOneOf } from '@/shared/lib'
import { readBeats, ticksIn } from './beats'
import { fourToALine } from './chart-layout'
import { ContentError, type ContentPosition } from './content-error'
import { CHORD_SIZES, pieceKey, type ChordSize, type ProgressionPiece } from './types'

/** Roman numerals name the degrees of the major scale from the tonic. */
const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
const MAJOR_SCALE = scaleIntervals('major')

const CHROMATIC = new Map([
  ['', 0],
  ['b', -1],
  ['♭', -1],
  ['#', 1],
  ['♯', 1],
])

/** How each function's chord grows with the chord size: triads, sevenths, ninths. */
const FUNCTIONS = new Map<string, Readonly<Record<ChordSize, ChordQuality>>>([
  ['maj', { triads: 'maj', sevenths: 'maj7', ninths: 'maj9' }],
  ['min', { triads: 'min', sevenths: 'm7', ninths: 'm9' }],
  ['dom', { triads: 'maj', sevenths: 'd7', ninths: 'n9' }],
  ['domb9', { triads: 'maj', sevenths: 'd7', ninths: 'b9' }],
  ['hd', { triads: 'dim', sevenths: 'hd', ninths: 'hd' }],
])

const BASS_ROLES = new Map<string, ChordRole>([
  ['3', '3rd'],
  ['5', '5th'],
  ['7', '7th'],
])

const isQuality = isOneOf(CHORD_QUALITIES)

const TOKEN = /^([b♭#♯]?)([ivIV]+):([^:]+):([^/]+)(?:\/(.))?$/

/** A chord and how long it lasts, before it is packed into bars. */
interface TimedChord {
  readonly chord: Chord
  readonly ticks: Tick
}

/** `degree:function:beats[/3|/5|/7]`, e.g. `♭VII:dom:2` or `i:min:2/3`. */
function readChord(
  token: string,
  piece: ProgressionPiece,
  size: ChordSize,
  fail: (problem: string) => never,
): TimedChord {
  const [, chromatic = '', numeral = '', written = '', beatsText = '', bassText] =
    TOKEN.exec(token) ?? fail(`cannot read the chord "${token}"`)
  const degree =
    MAJOR_SCALE[NUMERALS.indexOf(numeral.toUpperCase())] ?? fail(`unknown degree in "${token}"`)
  const fixed = written.startsWith('=') ? written.slice(1) : null
  const quality =
    fixed === null
      ? (FUNCTIONS.get(written)?.[size] ?? fail(`unknown function in "${token}"`))
      : isQuality(fixed)
        ? fixed
        : fail(`unknown chord quality in "${token}"`)
  const beats = readBeats(beatsText)
  const ticks = beats === null ? null : ticksIn(beats)
  if (ticks === null) fail(`"${token}" needs beats above 0 on whole ticks`)
  const root = spellAbove(pieceKey(piece).tonic, {
    steps: degree.steps,
    semitones: degree.semitones + (CHROMATIC.get(chromatic) ?? 0),
  })
  if (bassText === undefined) return { chord: { root, quality }, ticks }
  const role = BASS_ROLES.get(bassText) ?? fail(`unknown bass in "${token}"`)
  const bass =
    spellChord(root, quality).find((tone) => tone.role === role)?.note ??
    fail(`"${token}" has no ${role} for the bass at ${size}`)
  return { chord: { root, quality, bass }, ticks }
}

/** Fills bars of the meter in order, a chord longer than the room left tied into the next bar. */
function packIntoBars(chords: readonly TimedChord[], meterTicks: Tick): ChartBar[] {
  const bars: ChartBar[] = []
  let current: ChartChord[] = []
  let room = meterTicks
  const close = () => {
    bars.push({ chords: current, beats: (meterTicks - room) / TICKS_PER_BEAT })
    current = []
    room = meterTicks
  }
  for (const { chord, ticks } of chords) {
    let left = ticks
    while (left > 0) {
      const taken = Math.min(left, room)
      current.push({ ...chord, beats: taken / TICKS_PER_BEAT })
      left -= taken
      room -= taken
      if (room === 0) close()
    }
  }
  if (current.length > 0) close()
  return bars
}

/**
 * Reads a progression at a chord size into a chart of real bars: one string four bars a line, or
 * sections line by line, each line starting on a new bar.
 */
export function parseProgression(piece: ProgressionPiece, size: ChordSize): Chart {
  if (!CHORD_SIZES.includes(size)) throw new RangeError(`Unknown chord size "${size}"`)
  const meterTicks = beatsPerBar(piece.meter) * TICKS_PER_BEAT
  const barsOf = (written: string, at: ContentPosition): ChartBar[] =>
    packIntoBars(
      written
        .split(/\s+/)
        .filter(Boolean)
        .map((token, i) =>
          readChord(token, piece, size, (problem) => {
            throw new ContentError(piece.id, { ...at, chord: i + 1 }, problem)
          }),
        ),
      meterTicks,
    )
  const sections =
    typeof piece.progression === 'string'
      ? [{ lines: fourToALine(barsOf(piece.progression, {})) }]
      : piece.progression.map((section, s) => ({
          lines: section.lines.map((line, l) => barsOf(line, { section: s + 1, line: l + 1 })),
        }))
  return { key: pieceKey(piece), meter: piece.meter, sections }
}
