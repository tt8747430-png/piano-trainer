import { isMethodCode, type MethodCode } from '@/entities/pattern'
import type { Chart, ChartBar, ChartChord, WrittenHands } from '@/shared/lib/arrangement'
import {
  beatsPerBar,
  beatsToTicks,
  ChordSymbolError,
  parseChordSymbol,
  TICKS_PER_BEAT,
  type Chord,
} from '@/shared/lib/music'
import { readBeats, ticksIn } from './beats'
import { ContentError, type ContentPosition } from './content-error'
import { HAND_IDS, parseHands, type HandBar, type ReadHands } from './parse-hands'
import { pieceKey, type ChartPiece } from './types'

type Fail = (problem: string) => never

interface WrittenChord {
  readonly chord: Chord
  readonly beats: number | null
  readonly method: MethodCode | undefined
}

/** `symbol[@beats][:method]` */
function readChord(text: string, fail: Fail): WrittenChord {
  const [head = '', method, ...afterMethod] = text.split(':')
  const [symbol = '', beatsText, ...afterBeats] = head.split('@')
  if (afterMethod.length > 0 || afterBeats.length > 0) fail(`cannot read the chord "${text}"`)
  if (method !== undefined && !isMethodCode(method)) fail(`unknown method code "${method}"`)
  const read = beatsText === undefined ? null : readBeats(beatsText)
  if (beatsText !== undefined && read === null)
    fail(`"${beatsText}" is not a number of beats above 0`)
  const ticks = read === null ? null : ticksIn(read)
  if (read !== null && ticks === null) fail(`"${beatsText}" beats fall between ticks`)
  // Kept as the whole ticks they are, so `.3333333333` is a third of a beat exactly.
  const beats = ticks === null ? null : ticks / TICKS_PER_BEAT
  try {
    return { chord: parseChordSymbol(symbol), beats, method }
  } catch (error) {
    if (error instanceof ChordSymbolError) fail(`unknown chord symbol "${symbol}"`)
    throw error
  }
}

/**
 * Chords joined by `-` share the meter's beats, except those that give their own `@beats`; a bar in
 * which every chord gives beats lasts their sum. A chord without a method code takes its bar's first.
 */
function readBar(text: string, meterBeats: number, fail: Fail): ChartBar {
  const written = text.split('-').map((part) => readChord(part, fail))
  const given = written.reduce((sum, chord) => sum + (chord.beats ?? 0), 0)
  const sharing = written.filter((chord) => chord.beats === null).length
  const left = meterBeats - given
  if (sharing > 0 && left <= 0) fail(`chords with @beats leave no beats for the others`)
  const share = sharing > 0 ? left / sharing : 0
  if (sharing > 0 && ticksIn(share) === null) {
    fail(`${sharing} chords cannot share ${left} beats in whole ticks`)
  }
  const barMethod = written.find((chord) => chord.method)?.method
  const chords = written.map(({ chord, beats, method = barMethod }): ChartChord => ({
    ...chord,
    beats: beats ?? share,
    ...(method ? { method } : {}),
  }))
  return { chords, beats: chords.reduce((sum, chord) => sum + chord.beats, 0) }
}

/** The hands a bar writes, from what was read for every bar; none when it writes neither. */
function barHands(read: ReadHands, index: number): WrittenHands | undefined {
  const hands: { rh?: WrittenHands['rh']; lh?: WrittenHands['lh'] } = {}
  for (const hand of HAND_IDS) {
    const notes = read[hand]?.[index]
    if (notes) hands[hand] = notes
  }
  return hands.rh || hands.lh ? hands : undefined
}

/** Reads a song's or study's chart, its written hands in its bars, naming the bar of any mistake in a ContentError. */
export function parseChart(piece: ChartPiece): Chart {
  const meterBeats = beatsPerBar(piece.meter)
  const failAt =
    (position: ContentPosition): Fail =>
    (problem) => {
      throw new ContentError(piece.id, position, problem)
    }
  const places: HandBar[] = []
  const sections = piece.sections.map((section, s) => ({
    lines: section.lines.map((line, l) => {
      const bars = line.split(/\s+/).filter(Boolean)
      if (bars.length === 0) failAt({ section: s + 1, line: l + 1 })('empty line')
      return bars.map((bar, b) => {
        const position = { section: s + 1, line: l + 1, bar: b + 1 }
        const read = readBar(bar, meterBeats, failAt(position))
        places.push({ ticks: beatsToTicks(read.beats), position })
        return read
      })
    }),
  }))
  const hands = parseHands(piece, places)
  let index = 0
  return {
    key: pieceKey(piece),
    meter: piece.meter,
    sections: sections.map((section) => ({
      lines: section.lines.map((line) =>
        line.map((bar) => {
          const written = barHands(hands, index++)
          return written ? { ...bar, hands: written } : bar
        }),
      ),
    })),
  }
}
