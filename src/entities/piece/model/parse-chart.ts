import { isMethodCode, type MethodCode } from '@/entities/pattern'
import type { Chart, ChartBar, ChartChord } from '@/shared/lib/arrangement'
import { ChordSymbolError, parseChordSymbol, type Chord } from '@/shared/lib/music'
import { readBeats, ticksIn } from './beats'
import { ContentError, type ContentPosition } from './content-error'
import { beatsPerBar, pieceKey, type ChartPiece } from './types'

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
  const beats = beatsText === undefined ? null : readBeats(beatsText)
  if (beatsText !== undefined && beats === null)
    fail(`"${beatsText}" is not a number of beats above 0`)
  if (beats !== null && ticksIn(beats) === null) fail(`"${beatsText}" beats fall between ticks`)
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

/** Reads a song's or exercise's chart, naming the bar of any mistake in a ContentError. */
export function parseChart(piece: ChartPiece): Chart {
  const meterBeats = beatsPerBar(piece.meter)
  const failAt =
    (position: ContentPosition): Fail =>
    (problem) => {
      throw new ContentError(piece.id, position, problem)
    }
  return {
    key: pieceKey(piece),
    beatsPerBar: meterBeats,
    sections: piece.sections.map((section, s) => ({
      lines: section.lines.map((line, l) => {
        const bars = line.split(/\s+/).filter(Boolean)
        if (bars.length === 0) failAt({ section: s + 1, line: l + 1 })('empty line')
        return bars.map((bar, b) =>
          readBar(bar, meterBeats, failAt({ section: s + 1, line: l + 1, bar: b + 1 })),
        )
      }),
    })),
  }
}
