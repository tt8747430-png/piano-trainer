import { beatCells, type CellBar } from '@/features/practice'
import type { BarWords, BeatWords } from '@/widgets/chord-chart'
import type { Performance, PerformanceNote } from '@/shared/lib/arrangement'
import { beatsToTicks, type Syllable, type Tick } from '@/shared/lib/music'

// Chords over lyrics (ADR 0099), as ChordPro's renderers lay a song out: each line of the chart a
// row of segments, a segment a chord over the words sung up to the next, so no two chords ever
// overlap. Every tick here is a bar's first pass: each bar is written once, as the chart writes it.

/** Ticks from one to another, the second left out. */
export interface Span {
  readonly from: Tick
  readonly to: Tick
}

/** A verse's words in a segment: its syllables, a word's joined. */
export interface SungWords {
  readonly text: string
  /** It ends in a word the next segment carries on: a hyphen draws it on. */
  readonly goesOn: boolean
}

/** A chord over the words sung up to the next. */
export interface LyricSegment extends Span {
  /**
   * The chord shown, an index into the performance's chords: where it starts, and the same chord
   * held on over bar lines, from its start to its last bar's end. None for the words before a
   * line's first chord.
   */
  readonly chord: number | null
  /** Each verse's words here, verse 1 first; empty where a verse sings nothing here. */
  readonly verses: readonly SungWords[]
}

/** A word of a line as sung: its syllables joined, from the tick its first is sung at. */
export interface SungWord {
  /** A word the next line goes on with ends in a hyphen. */
  readonly text: string
  readonly at: Tick
}

/** A line of the chart as Chords over lyrics shows it. */
export interface LyricLine extends Span {
  readonly section: number
  /** Its bars as written. */
  readonly bars: readonly number[]
  readonly segments: readonly LyricSegment[]
  /** Each verse's words in time, verse 1 first: what the Diagrams view lights as they are sung. */
  readonly words: readonly (readonly SungWord[])[]
  /** A verse sings in it: else it is its chords alone, a chip for each. */
  readonly sung: boolean
}

/** The staff a note is written on, top down as the sheet prints them: single staves, then the piano's. */
const staffRank = (note: PerformanceNote): number =>
  note.hand === 'staff' ? (note.staff ?? 0) : note.hand === 'rh' ? 1000 : 1001

/**
 * The notes the words are sung on, one an onset, in time: those of the staff they are written under,
 * the top one where two carry them (a tune the right hand doubles), as the sheet prints them (ADR
 * 0093).
 */
function sungNotes(performance: Performance): PerformanceNote[] {
  const singing = performance.notes.filter((note) => note.lyrics)
  if (singing.length === 0) return []
  const staff = Math.min(...singing.map(staffRank))
  const onsets = new Map<Tick, PerformanceNote>()
  for (const note of singing) {
    if (staffRank(note) === staff && !onsets.has(note.startTick)) onsets.set(note.startTick, note)
  }
  return [...onsets.values()].sort((a, b) => a.startTick - b.startTick)
}

/** A segment being built: its chord and each verse's syllables. */
interface Building extends Span {
  readonly chord: number | null
  readonly sung: Syllable[][]
}

/** A verse's syllables as words: a word's syllables joined, words parted by a space. */
function wordsOf(syllables: readonly Syllable[]): SungWords {
  const text = syllables
    .map((syllable, i) =>
      i > 0 && !syllables[i - 1]?.hyphen ? ` ${syllable.text}` : syllable.text,
    )
    .join('')
  return { text, goesOn: syllables.at(-1)?.hyphen ?? false }
}

/** A syllable sung, at its note's tick. */
interface TimedSyllable {
  readonly syllable: Syllable
  readonly at: Tick
}

/** A verse's syllables in a line as its words in time: each from its first syllable's tick. */
function timedWords(syllables: readonly TimedSyllable[]): SungWord[] {
  const words: { text: string; at: Tick }[] = []
  syllables.forEach(({ syllable, at }, i) => {
    const word = words.at(-1)
    if (word && syllables[i - 1]?.syllable.hyphen) word.text += syllable.text
    else words.push({ text: syllable.text, at })
  })
  const last = words.at(-1)
  if (last && syllables.at(-1)?.syllable.hyphen) last.text += '-'
  return words
}

/** A line's bars, in time, their chords run together where one is held over a bar line. */
function lineOf(
  performance: Performance,
  bars: readonly CellBar[],
  sung: readonly PerformanceNote[],
  verses: number,
): LyricLine {
  const segments: Building[] = []
  const open = (chord: number | null, span: Span) =>
    segments.push({ chord, ...span, sung: Array.from({ length: verses }, () => []) })
  // Each verse's syllables in the line, in time.
  const timed: TimedSyllable[][] = Array.from({ length: verses }, () => [])
  // The chord last shown, while it is held on: a bar of no chord lets it go.
  let held: string | null = null
  const starts = bars.map((each) => performance.bars[each.played]?.startTick ?? 0)
  bars.forEach((each, index) => {
    const bar = performance.bars[each.played]
    const start = starts[index] ?? 0
    if (!bar) return
    const end = start + beatsToTicks(bar.beats)
    if (bar.chords.length === 0) held = null
    const chords = bar.chords.flatMap((chord) => {
      const performed = performance.chords[chord]
      return performed ? [{ chord, ...performed }] : []
    })
    const notes = sung.filter((note) => note.startTick >= start && note.startTick < end)
    let next = 0
    for (const note of notes) {
      // The chords starting before the note, or with it, come first.
      while (next < chords.length && (chords[next]?.startTick ?? Infinity) <= note.startTick) {
        showChord(chords[next++])
      }
      if (segments.length === 0) open(null, { from: start, to: start })
      const segment = segments.at(-1)
      note.lyrics?.forEach((syllable, verse) => {
        if (!syllable) return
        segment?.sung[verse]?.push(syllable)
        timed[verse]?.push({ syllable, at: note.startTick })
      })
    }
    while (next < chords.length) showChord(chords[next++])
  })

  function showChord(
    performed: { chord: number; symbol: string; startTick: Tick; durationTicks: Tick } | undefined,
  ) {
    if (!performed) return
    const span = { from: performed.startTick, to: performed.startTick + performed.durationTicks }
    const last = segments.at(-1)
    if (held === performed.symbol && last && last.chord !== null) {
      segments[segments.length - 1] = { ...last, to: span.to }
      return
    }
    held = performed.symbol
    open(performed.chord, span)
  }

  const first = bars[0]
  const last = bars.at(-1)
  const lastBar = last ? performance.bars[last.played] : undefined
  const from = starts[0] ?? 0
  const shown = segments.map(({ sung: syllables, ...segment }) => ({
    ...segment,
    verses: syllables.map(wordsOf),
  }))
  return {
    section: first?.section ?? 0,
    bars: bars.map((each) => each.written),
    from,
    to: (starts.at(-1) ?? from) + (lastBar ? beatsToTicks(lastBar.beats) : 0),
    segments: shown,
    words: timed.map(timedWords),
    sung: shown.some(({ verses: words }) => words.some(({ text }) => text !== '')),
  }
}

/**
 * The chart's lines as Chords over lyrics shows them (ADR 0099): each a row of segments, a chord
 * over the words sung from where it starts up to the next chord, verse by verse; a chord held over
 * bar lines once. Words are the verses on the notes of the staff they are written under; a line with
 * none is its chords alone. Each bar once, as it is first played.
 */
export function lyricLines(performance: Performance): LyricLine[] {
  const sung = sungNotes(performance)
  const verses = Math.max(0, ...sung.map((note) => note.lyrics?.length ?? 0))
  const lines: CellBar[][] = []
  for (const bar of beatCells(performance)) {
    const line = lines.at(-1)
    const previous = line?.at(-1)
    if (line && previous && previous.section === bar.section && previous.line === bar.line)
      line.push(bar)
    else lines.push([bar])
  }
  return lines.map((bars) => lineOf(performance, bars, sung, verses))
}

/**
 * The lines Chords over lyrics shows, on the screen and in print, each with its place among them
 * all: a line of neither words nor chords (an own song's bars of no chord symbol and nothing sung)
 * shows nothing, so it is left out, and its section's name heads its first line shown (`starts`).
 */
export function shownLines<Line extends LyricLine>(
  lines: readonly Line[],
): { readonly line: Line; readonly index: number; readonly starts: boolean }[] {
  const shown = lines.flatMap((line, index) =>
    line.sung || line.segments.some(({ chord }) => chord !== null) ? [{ line, index }] : [],
  )
  return shown.map((each, at) => ({
    ...each,
    starts: shown[at - 1]?.line.section !== each.line.section,
  }))
}

/** A line's words in a verse (verse 1 by default), as one line of text: the Diagrams view's. */
export function lineWords(line: LyricLine, verse = 0): string {
  return line.segments
    .map(({ verses }) => {
      const words = verses[verse]
      return words ? `${words.text}${words.goesOn || words.text === '' ? '' : ' '}` : ''
    })
    .join('')
    .trim()
}

/**
 * Where the chord sounding in a beat is shown (as written, its first pass): its line and segment,
 * the later where two sound in it; none where no chord does (a bar of none). A line shown once for
 * the copies written after it (ADR 0108) marks theirs too, each `copies` on from its own start.
 */
export function soundingChip(
  lines: readonly (LyricLine & { readonly copies?: readonly Tick[] })[],
  beat: Span,
): { readonly line: number; readonly segment: number } | null {
  let found: { line: number; segment: number } | null = null
  lines.forEach(({ segments, copies = [0] }, line) =>
    segments.forEach(({ chord, from, to }, segment) => {
      const sounds = copies.some((by) => from + by < beat.to && to + by > beat.from)
      if (chord !== null && sounds) found = { line, segment }
    }),
  )
  return found
}

/**
 * The Grid's words (ADR 0108): each bar's, as written (its first pass), verse by verse, each verse
 * the words sung in each beat, a word the next beat goes on with hyphened. Only the bars with words;
 * none for music of none.
 */
export function gridWords(performance: Performance): ReadonlyMap<number, BarWords> {
  const sung = sungNotes(performance)
  const verses = Math.max(0, ...sung.map((note) => note.lyrics?.length ?? 0))
  const words = new Map<number, BarWords>()
  if (verses === 0) return words
  for (const bar of beatCells(performance)) {
    const start = performance.bars[bar.played]?.startTick ?? 0
    const end = start + (bar.cells.at(-1)?.to ?? 0)
    // Each verse's syllables by beat, in time.
    const beats = Array.from({ length: verses }, () => new Map<number, Syllable[]>())
    for (const note of sung) {
      if (note.startTick < start || note.startTick >= end) continue
      const beat = Math.max(
        0,
        bar.cells.findLastIndex(({ from }) => from <= note.startTick - start),
      )
      note.lyrics?.forEach((syllable, verse) => {
        if (!syllable) return
        const sungThere = beats[verse]?.get(beat) ?? []
        beats[verse]?.set(beat, [...sungThere, syllable])
      })
    }
    const shown = beats.map((byBeat) =>
      [...byBeat].map(([beat, syllables]): BeatWords => {
        const { text, goesOn } = wordsOf(syllables)
        return { beat, text: goesOn ? `${text}-` : text }
      }),
    )
    if (shown.some((verse) => verse.length > 0)) words.set(bar.written, shown)
  }
  return words
}
