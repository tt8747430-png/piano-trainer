import { factsOf, type Piece } from '@/entities/piece'
import {
  chordSymbol,
  findNumerals,
  parseNumerals,
  type Chord,
  type Key,
  type Numeral,
} from '@/shared/lib/music'
import { PROGRESSION_LIBRARY } from '../content/library'
import { progressionMode } from './selectors'
import type { LibraryProgression } from './types'

// The library's progressions in the songs (ADR 0112): each song's chords read as numerals in the key
// they are written in, a section's own where it has one, and every line of the library found there.

/** Bars counted from 0, first to last. */
export interface Bars {
  readonly first: number
  readonly last: number
}

/** Where a progression is heard in a song. */
export interface SongPlace {
  /** From its first chord's bar to the bar its last arrives in, as written. */
  readonly bars: Bars
  /** The same bars as the Player plays them, its repeats taken: what its loop goes round. */
  readonly played: Bars
  /** The key it is heard in: the song's, or its section's. */
  readonly key: Key
  /** Its chords' symbols as written, a chord held over several once: `G C G`. */
  readonly chords: readonly string[]
}

/** Written bars as the Player plays them: where they first run on in its order, else from each's first pass. */
function playedBars(order: readonly number[], bars: Bars): Bars {
  const length = bars.last - bars.first
  const together = order.findIndex(
    (written, at) =>
      written === bars.first &&
      Array.from({ length }, (_, i) => order[at + i + 1]).every(
        (next, i) => next === bars.first + i + 1,
      ),
  )
  if (together >= 0) return { first: together, last: together + length }
  const first = Math.max(0, order.indexOf(bars.first))
  const last = order.findIndex((written, at) => at >= first && written === bars.last)
  return { first, last: Math.max(first, last) }
}

/** A place in a stretch, as the chords' indexes there, with its bars and the key it is in. */
interface Found extends SongPlace {
  readonly stretch: number
  readonly span: Bars
}

/** Chords' symbols as written, a chord held over several once. */
const heldOnce = (chords: readonly Chord[]): string[] =>
  chords.map(chordSymbol).filter((symbol, i, all) => i === 0 || symbol !== all[i - 1])

const placeOf = ({ bars, played, key, chords }: Found): SongPlace => ({ bars, played, key, chords })

function found(piece: Piece, numerals: readonly Numeral[], minor: boolean): Found[] {
  const { stretches, order } = factsOf(piece)
  return stretches.flatMap((stretch, at) =>
    stretch.key.minor !== minor
      ? []
      : findNumerals(stretch.readings, numerals).map((span) => {
          const bars = { first: stretch.bars[span.first] ?? 0, last: stretch.bars[span.last] ?? 0 }
          return {
            stretch: at,
            span,
            bars,
            played: playedBars(order, bars),
            key: stretch.key,
            chords: heldOnce(stretch.chords.slice(span.first, span.last + 1)),
          }
        }),
  )
}

/**
 * Where a line of numerals is heard in a song, in order: in each stretch of its chords written in a
 * key of `minor`'s mode, a progression's line being one mode's. None for a line of one chord.
 */
export const progressionPlaces = (
  piece: Piece,
  numerals: readonly Numeral[],
  minor: boolean,
): SongPlace[] => found(piece, numerals, minor).map(placeOf)

/** A song a progression is heard in, and where. */
export interface SongWith {
  readonly piece: Piece
  readonly places: readonly SongPlace[]
}

/** The songs a line of numerals is heard in, in the order given, each with its places. */
export const songsWith = (
  pieces: readonly Piece[],
  numerals: readonly Numeral[],
  minor: boolean,
): SongWith[] =>
  pieces.flatMap((piece) => {
    const places = progressionPlaces(piece, numerals, minor)
    return places.length > 0 ? [{ piece, places }] : []
  })

/** A library progression a song uses, the key it is first heard in, and where. */
export interface UsedProgression {
  readonly progression: LibraryProgression
  readonly key: Key
  readonly places: readonly SongPlace[]
}

/**
 * The line a song must hold for a progression to be heard in it. A modal vamp is heard as its mode
 * only coming back round (I–II–I), never in a major song passing through (I–II⁷ on to V).
 */
export function heardLine(numerals: readonly Numeral[], modal: boolean): readonly Numeral[] {
  const [first] = numerals
  return modal && first && numerals.at(-1) !== first ? [...numerals, first] : numerals
}

/** Each progression of the library with its lines, one for each mode it has. */
const LINES = PROGRESSION_LIBRARY.map((progression) => ({
  progression,
  lines: [false, true].flatMap((minor) => {
    if (progressionMode(progression, minor) !== minor) return []
    const numerals = parseNumerals(progression[minor ? 'minor' : 'major'] ?? '')
    return numerals
      ? [{ minor, numerals: heardLine(numerals, progression.mode !== undefined) }]
      : []
  }),
}))

const inside = (inner: Found, outer: Found): boolean =>
  inner.stretch === outer.stretch &&
  outer.span.first <= inner.span.first &&
  inner.span.last <= outer.span.last &&
  outer.span.last - outer.span.first > inner.span.last - inner.span.first

/**
 * The library's progressions a song uses, in the order it first uses them: each where it is heard
 * other than wholly inside a longer one heard there (the I–IV–I of a I–IV–I–V is that one's), with
 * the key it is first heard in.
 */
export function progressionsOf(piece: Piece): UsedProgression[] {
  const all = LINES.map(({ progression, lines }) => ({
    progression,
    places: lines.flatMap(({ minor, numerals }) => found(piece, numerals, minor)),
  }))
  const everywhere = all.flatMap(({ places }) => places)
  return all
    .flatMap(({ progression, places }) => {
      const own = places.filter((place) => !everywhere.some((other) => inside(place, other)))
      const [first] = own
      return first ? [{ progression, key: first.key, places: own, first }] : []
    })
    .sort(
      (a, b) =>
        a.first.stretch - b.first.stretch ||
        a.first.span.first - b.first.span.first ||
        a.first.span.last - b.first.span.last,
    )
    .map(({ progression, key, places }) => ({
      progression,
      key,
      places: places.map(placeOf),
    }))
}
