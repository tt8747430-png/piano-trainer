import { isMethodCode, type MethodCode } from '@/entities/pattern'
import type { Chart, ChartBar, ChartChord, WrittenHands } from '@/shared/lib/arrangement'
import {
  beatsPerBar,
  beatsToTicks,
  ChordSymbolError,
  isCompound,
  parseChordSymbol,
  parseKey,
  TICKS_PER_BEAT,
  type BarMarks,
  type Chord,
  type Jump,
  type Key,
  type Meter,
} from '@/shared/lib/music'
import { MAX_BEATS, readBeats, ticksIn } from './beats'
import { ContentError, type ContentPosition } from './content-error'
import { HAND_IDS, parseHandClefs, parseHands, type HandBar, type ReadHands } from './parse-hands'
import { pieceKey, type ChartPiece } from './types'

type Fail = (problem: string) => never

/** Each jump as a chart writes it after its bar. */
export const JUMP_TOKENS: Readonly<Record<Jump, string>> = {
  dc: 'DC',
  'dc-fine': 'DC.Fine',
  'dc-coda': 'DC.Coda',
  ds: 'DS',
  'ds-fine': 'DS.Fine',
  'ds-coda': 'DS.Coda',
}

/**
 * Marks written after a bar, its end: a repeat back, a double barline, the final one; a jump, Fine,
 * To Coda (ADR 0068).
 */
const END_TOKENS: Readonly<Record<string, BarMarks>> = {
  ':|': { barline: 'repeat' },
  '||': { barline: 'double' },
  '|.': { barline: 'final' },
  ...Object.fromEntries(Object.entries(JUMP_TOKENS).map(([jump, token]) => [token, { jump }])),
  Fine: { fine: true },
  ToCoda: { toCoda: true },
}
/** Marks written before a bar: a repeat starting at it, the ending it belongs to, the signs. */
const START_TOKENS: Readonly<Record<string, BarMarks>> = {
  '|:': { repeatStart: true },
  '[1': { ending: 1 },
  '[2': { ending: 2 },
  Segno: { segno: true },
  Coda: { coda: true },
}

/** The most bars of its meter one bar may last: a bar of chords with long `@beats`. */
const BAR_LIMIT = 4

/** A bar with no chord symbol (ADR 0094): nothing printed over it, nothing a pattern plays there. */
export const NO_CHORD = '_'

interface WrittenChord {
  /** None for `_`, a bar of no chord. */
  readonly chord: Chord | null
  readonly beats: number | null
  readonly method: MethodCode | undefined
}

/** `symbol[@beats][:method]`, or `_[@beats]` for no chord. */
function readChord(text: string, fail: Fail): WrittenChord {
  const [head = '', method, ...afterMethod] = text.split(':')
  const [symbol = '', beatsText, ...afterBeats] = head.split('@')
  if (afterMethod.length > 0 || afterBeats.length > 0) fail(`cannot read the chord "${text}"`)
  if (method !== undefined && !isMethodCode(method)) fail(`unknown method code "${method}"`)
  const read = beatsText === undefined ? null : readBeats(beatsText)
  if (beatsText !== undefined && read === null)
    fail(`"${beatsText}" is not a number of beats above 0 and at most ${MAX_BEATS}`)
  const ticks = read === null ? null : ticksIn(read)
  if (read !== null && ticks === null) fail(`"${beatsText}" beats fall between ticks`)
  // Kept as the whole ticks they are, so `.3333333333` is a third of a beat exactly.
  const beats = ticks === null ? null : ticks / TICKS_PER_BEAT
  if (symbol === NO_CHORD) return { chord: null, beats, method }
  try {
    return { chord: parseChordSymbol(symbol), beats, method }
  } catch (error) {
    if (error instanceof ChordSymbolError) fail(`unknown chord symbol "${symbol}"`)
    throw error
  }
}

/** `_`, a bar of no chord (ADR 0094): the meter's length or its own `@beats`, written alone. */
function emptyBar(written: readonly WrittenChord[], meterBeats: number, fail: Fail): ChartBar {
  const [only] = written
  if (written.length > 1 || only?.method !== undefined)
    fail(`"${NO_CHORD}" is a bar of no chord, written alone`)
  return { chords: [], beats: only?.beats ?? meterBeats }
}

/**
 * Chords joined by `-` share the meter's beats, except those that give their own `@beats`; a bar in
 * which every chord gives beats lasts their sum. A chord without a method code takes its bar's first.
 */
function chordBar(written: readonly WrittenChord[], meterBeats: number, fail: Fail): ChartBar {
  const given = written.reduce((sum, chord) => sum + (chord.beats ?? 0), 0)
  const sharing = written.filter((chord) => chord.beats === null).length
  const left = meterBeats - given
  if (sharing > 0 && left <= 0) fail(`chords with @beats leave no beats for the others`)
  const share = sharing > 0 ? left / sharing : 0
  if (sharing > 0 && ticksIn(share) === null) {
    fail(`${sharing} chords cannot share ${left} beats in whole ticks`)
  }
  const barMethod = written.find((chord) => chord.method)?.method
  const chords = written.flatMap(({ chord, beats, method = barMethod }): ChartChord[] =>
    chord ? [{ ...chord, beats: beats ?? share, ...(method ? { method } : {}) }] : [],
  )
  // Summed in ticks: six chords sharing 4/4 make 4 beats, never 3.9999999999999996 (a pickup).
  const ticks = chords.reduce((sum, chord) => sum + beatsToTicks(chord.beats), 0)
  return { chords, beats: ticks / TICKS_PER_BEAT }
}

/** A bar of chords, or of none (`_`), at most four bars of its meter long. */
function readBar(text: string, meterBeats: number, fail: Fail): ChartBar {
  const written = text.split('-').map((part) => readChord(part, fail))
  const bar = written.some(({ chord }) => chord === null)
    ? emptyBar(written, meterBeats, fail)
    : chordBar(written, meterBeats, fail)
  if (beatsToTicks(bar.beats) > BAR_LIMIT * beatsToTicks(meterBeats))
    fail(`a bar longer than four bars of its meter`)
  return bar
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

/** A section's own key, read; one that names no key is the content's mistake. */
function sectionKey(piece: ChartPiece, text: string, s: number): Key {
  const key = parseKey(text)
  if (!key) throw new ContentError(piece.id, { section: s + 1 }, `"${text}" names no key`)
  return key
}

/**
 * The meter a section's bars are counted in (ADR 0095): its own, else the piece's. One of the other
 * kind is the content's mistake: its beat would be another note, a dotted quarter for a quarter.
 */
function sectionMeter(piece: ChartPiece, meter: Meter | undefined, s: number): Meter {
  if (meter === undefined) return piece.meter
  if (isCompound(meter) !== isCompound(piece.meter))
    throw new ContentError(
      piece.id,
      { section: s + 1 },
      `"${meter}" is a meter of another kind than the piece’s "${piece.meter}"`,
    )
  return meter
}

/**
 * Reads a song's or study's chart, each section's bars in its meter and its written hands in its
 * bars, naming the bar of any mistake in a ContentError.
 */
export function parseChart(piece: ChartPiece): Chart {
  const failAt =
    (position: ContentPosition): Fail =>
    (problem) => {
      throw new ContentError(piece.id, position, problem)
    }
  const places: HandBar[] = []
  // Each section's bars counted in its own meter, else the piece's (ADR 0095).
  const meters = piece.sections.map((section, s) => sectionMeter(piece, section.meter, s))
  const sections = piece.sections.map((section, s) => ({
    key: section.key === undefined ? null : sectionKey(piece, section.key, s),
    meter: meters[s] === piece.meter ? undefined : meters[s],
    lines: section.lines.map((line, l) => {
      const fail: Fail = failAt({ section: s + 1, line: l + 1 })
      const tokens = line.split(/\s+/).filter(Boolean)
      const bars: ChartBar[] = []
      // Marks before a bar wait for it; a barline after one is its end.
      let before: BarMarks = {}
      for (const token of tokens) {
        const end = END_TOKENS[token]
        if (end) {
          const last = bars.at(-1)
          if (!last || Object.keys(before).length > 0) fail(`a barline before any bar: "${token}"`)
          if (Object.keys(end).some((mark) => mark in last))
            fail(`two of a kind after one bar: "${token}"`)
          bars[bars.length - 1] = { ...last, ...end }
          continue
        }
        const start = START_TOKENS[token]
        if (start) {
          if (Object.keys(start).some((mark) => mark in before))
            fail(`two of a kind before one bar: "${token}"`)
          before = { ...before, ...start }
          continue
        }
        const position = { section: s + 1, line: l + 1, bar: bars.length + 1 }
        const meterBeats = beatsPerBar(meters[s] ?? piece.meter)
        const read = readBar(token, meterBeats, failAt(position))
        places.push({ ticks: beatsToTicks(read.beats), position })
        bars.push({ ...before, ...read })
        before = {}
      }
      if (Object.keys(before).length > 0) fail('a repeat or ending with no bar after it')
      if (bars.length === 0) fail('empty line')
      return bars
    }),
  }))
  const hands = parseHands(piece, places)
  const clefs = parseHandClefs(piece, places)
  let index = 0
  return {
    key: pieceKey(piece),
    meter: piece.meter,
    ...(piece.timeSymbol ? { timeSymbol: true } : {}),
    sections: sections.map((section) => ({
      ...(section.key ? { key: section.key } : {}),
      ...(section.meter ? { meter: section.meter } : {}),
      lines: section.lines.map((line) =>
        line.map((bar) => {
          const clef = clefs[index]
          const written = barHands(hands, index++)
          return {
            ...bar,
            ...(written ? { hands: written } : {}),
            ...(clef ? { clefs: clef } : {}),
          }
        }),
      ),
    })),
  }
}
