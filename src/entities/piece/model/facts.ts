import type { PatternId } from '@/entities/pattern'
import type { ChartBar } from '@/shared/lib/arrangement'
import {
  noteName,
  numeralReadings,
  playOrder,
  sameKey,
  type Chord,
  type ChordQuality,
  type Key,
  type Numeral,
  type SpelledNote,
} from '@/shared/lib/music'
import { chartOf, chordsOf, patternsOfPiece } from './chart'
import type { Piece } from './types'

/** A stretch of a song's chords in one key, with no bar of no chord in it: where a progression runs. */
export interface ChordStretch {
  readonly key: Key
  readonly chords: readonly Chord[]
  /** Each chord's written bar. */
  readonly bars: readonly number[]
  /** The chords read as numerals in the key, each reading `findNumerals` tries. */
  readonly readings: readonly (readonly Numeral[])[]
}

/**
 * What the app knows of a piece without its music in hand (ADR 0116): what every list, Skill and
 * progression search across the songs reads. Worked out from the music here; once content comes from
 * the database, each catalog entry carries its own, worked out the same way when it is published.
 */
export interface PieceFacts {
  /** Each chord it writes once, its root as spelled and its quality, in the order it first comes. */
  readonly chords: readonly { readonly root: SpelledNote; readonly quality: ChordQuality }[]
  /** The built-in patterns it plays. */
  readonly patterns: readonly PatternId[]
  /** Its chords in stretches, each in its key. */
  readonly stretches: readonly ChordStretch[]
  /** The written bars in the order they are played. */
  readonly order: readonly number[]
}

function chordsOnce(chords: readonly Chord[]): PieceFacts['chords'] {
  const seen = new Map<string, { root: SpelledNote; quality: ChordQuality }>()
  for (const { root, quality } of chords) {
    const name = `${noteName(root)} ${quality}`
    if (!seen.has(name)) seen.set(name, { root, quality })
  }
  return [...seen.values()]
}

function stretchesOf(sections: ReturnType<typeof chartOf>['sections'], key: Key) {
  const stretches: ChordStretch[] = []
  const all: ChartBar[] = []
  let open: { key: Key; chords: Chord[]; bars: number[] } | null = null
  const close = () => {
    if (open && open.chords.length > 0)
      stretches.push({
        key: open.key,
        chords: open.chords,
        bars: open.bars,
        readings: numeralReadings(open.chords, open.key),
      })
    open = null
  }
  for (const section of sections) {
    const sectionKey = section.key ?? key
    if (open && !sameKey(open.key, sectionKey)) close()
    for (const bar of section.lines.flat()) {
      const at = all.length
      all.push(bar)
      if (bar.chords.length === 0) {
        close()
        continue
      }
      open ??= { key: sectionKey, chords: [], bars: [] }
      for (const chord of bar.chords) {
        open.chords.push(chord)
        open.bars.push(at)
      }
    }
  }
  close()
  return { stretches, order: playOrder(all) }
}

const known = new WeakMap<Piece, PieceFacts>()

/** A piece's facts, worked out once per object, so a list reading a row again reads the same. */
export function factsOf(piece: Piece): PieceFacts {
  const found = known.get(piece)
  if (found) return found
  const chart = chartOf(piece)
  const facts: PieceFacts = {
    chords: chordsOnce(chordsOf(chart)),
    patterns: [...patternsOfPiece(piece)],
    ...stretchesOf(chart.sections, chart.key),
  }
  known.set(piece, facts)
  return facts
}
