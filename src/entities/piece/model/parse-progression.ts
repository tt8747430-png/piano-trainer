import {
  TICKS_PER_BEAT,
  type Chart,
  type ChartBar,
  type ChartChord,
  type Tick,
} from '@/shared/lib/arrangement'
import {
  CHORD_QUALITIES,
  scaleIntervals,
  spellAbove,
  spellChord,
  type Chord,
  type ChordQuality,
  type ChordRole,
} from '@/shared/lib/music'
import { isOneOf } from '@/shared/lib'
import { readBeats, ticksIn } from './beats'
import { ContentError } from './content-error'
import { beatsPerBar, pieceKey, VOICINGS, type ProgressionPiece, type Voicing } from './types'

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

/** How each function's chord grows with the voicing: triads, sevenths, ninths. */
const FUNCTIONS = new Map<string, Readonly<Record<Voicing, ChordQuality>>>([
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

const BARS_PER_LINE = 4

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
  voicing: Voicing,
  fail: (problem: string) => never,
): TimedChord {
  const [, chromatic = '', numeral = '', written = '', beatsText = '', bassText] =
    TOKEN.exec(token) ?? fail(`cannot read the chord "${token}"`)
  const degree =
    MAJOR_SCALE[NUMERALS.indexOf(numeral.toUpperCase())] ?? fail(`unknown degree in "${token}"`)
  const fixed = written.startsWith('=') ? written.slice(1) : null
  const quality =
    fixed === null
      ? (FUNCTIONS.get(written)?.[voicing] ?? fail(`unknown function in "${token}"`))
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
    fail(`"${token}" has no ${role} for the bass at ${voicing}`)
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

/** Reads a progression at a voicing into a chart of real bars, four to a line. */
export function parseProgression(piece: ProgressionPiece, voicing: Voicing): Chart {
  if (!VOICINGS.includes(voicing)) throw new RangeError(`Unknown voicing "${voicing}"`)
  const meterBeats = beatsPerBar(piece.meter)
  const chords = piece.progression
    .split(/\s+/)
    .filter(Boolean)
    .map((token, i) =>
      readChord(token, piece, voicing, (problem) => {
        throw new ContentError(piece.id, { chord: i + 1 }, problem)
      }),
    )
  const bars = packIntoBars(chords, meterBeats * TICKS_PER_BEAT)
  const lines = Array.from({ length: Math.ceil(bars.length / BARS_PER_LINE) }, (_, i) =>
    bars.slice(i * BARS_PER_LINE, (i + 1) * BARS_PER_LINE),
  )
  return { key: pieceKey(piece), beatsPerBar: meterBeats, sections: [{ lines }] }
}
