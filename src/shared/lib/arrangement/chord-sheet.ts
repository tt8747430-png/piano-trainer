import {
  beatsPerBar,
  beatsToTicks,
  C_MAJOR,
  transposedKey,
  type Chord,
  type Key,
  type Meter,
  type Tick,
} from '@/shared/lib/music'
import { transposeChord } from './arrange'
import type { Chart, ChartBar, ChartSection } from './types'

/**
 * A chord sheet (R29 CP2): a lead sheet's sections, each played its repeats, made of bars, each
 * holding its chords, each lasting whole beats. A bar is as long as its chords: an edit to one chord
 * never retimes another, and a bar whose beats are not the meter's is kept and marked (owner,
 * 2026-11-13: "accept the edit with this exclamation sign … and not change all the other chords
 * timing"). What the Chord player shows, edits and plays in a style.
 */
export const SECTION_KINDS = [
  'intro',
  'verse',
  'preChorus',
  'chorus',
  'bridge',
  'solo',
  'outro',
] as const
export type SectionKind = (typeof SECTION_KINDS)[number]
export const isSectionKind = (value: unknown): value is SectionKind =>
  typeof value === 'string' && (SECTION_KINDS as readonly string[]).includes(value)

/** A style's variations: a section plays one of them. */
export const VARIATIONS = [1, 2, 3, 4] as const
export type Variation = (typeof VARIATIONS)[number]
export const isVariation = (value: unknown): value is Variation =>
  typeof value === 'number' && (VARIATIONS as readonly number[]).includes(value)

/** A chord lasts 1 to 8 beats; a section repeats 1 to 8 times; a sheet holds 1 to 12 sections. */
export const CHORD_BEATS = { min: 1, max: 8 } as const
export const SECTION_REPEATS = { min: 1, max: 8 } as const
export const MOST_SECTIONS = 12

/** The time signatures a chord sheet is counted in: each a whole number of beats a bar. */
export const SHEET_METERS = ['2/4', '3/4', '4/4', '6/8', '12/8'] as const satisfies readonly Meter[]
export type SheetMeter = (typeof SHEET_METERS)[number]
export const isSheetMeter = (value: unknown): value is SheetMeter =>
  typeof value === 'string' && (SHEET_METERS as readonly string[]).includes(value)

export interface SheetChord {
  readonly chord: Chord
  readonly beats: number
}
/** A bar as written: its chords in order. */
export interface WrittenBar {
  readonly chords: readonly SheetChord[]
}
/** An arranger's numbered Intros and Endings (a Genos has three of each). */
export const ARRANGER_NUMBERS = [1, 2, 3] as const
export type ArrangerNumber = (typeof ARRANGER_NUMBERS)[number]
/** An arranger's Main sections. */
export const MAINS = ['A', 'B', 'C', 'D'] as const
export type Main = (typeof MAINS)[number]
/** What leads into the next section on the arranger: a Fill-in or a one-bar Break. */
export const INTOS = ['fill', 'break'] as const
export type Into = (typeof INTOS)[number]
/**
 * What a section has a followed arranger play (the Genos's panel sections): an Intro before the
 * sheet, the Main for each time through, a Fill-in or Break into the next section, an Ending after
 * the sheet. Unset (null) sends nothing, so the arranger plays as its panel says.
 */
export interface SectionMarks {
  readonly intro: ArrangerNumber | null
  /** The Main for each time through, by its pass; a pass past the list is unset. */
  readonly mains: readonly (Main | null)[]
  readonly into: Into | null
  readonly ending: ArrangerNumber | null
}
export const NO_MARKS: SectionMarks = { intro: null, mains: [], into: null, ending: null }
export const isArrangerNumber = (value: unknown): value is ArrangerNumber =>
  ARRANGER_NUMBERS.some((number) => number === value)
export const isMain = (value: unknown): value is Main => MAINS.some((main) => main === value)
export const isInto = (value: unknown): value is Into => INTOS.some((into) => into === value)

export interface SheetSection {
  readonly kind: SectionKind
  readonly repeats: number
  readonly variation: Variation
  readonly marks: SectionMarks
  readonly bars: readonly WrittenBar[]
}

/** A section's chords in order, across its bars: the index a screen names a chord by. */
export const sectionChords = (section: SheetSection): SheetChord[] =>
  section.bars.flatMap((bar) => bar.chords)

/** A bar's length in beats: its chords', whatever the meter says. */
export const writtenBeats = (bar: WrittenBar): number =>
  bar.chords.reduce((sum, { beats }) => sum + beats, 0)
export interface ChordSheet {
  readonly key: Key
  readonly meter: SheetMeter
  readonly sections: readonly SheetSection[]
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Math.round(value)))
const clampBeats = (beats: number) => clamp(beats, CHORD_BEATS.min, CHORD_BEATS.max)

export const emptySection = (kind: SectionKind = 'verse'): SheetSection => ({
  kind,
  repeats: 1,
  variation: 1,
  marks: NO_MARKS,
  bars: [],
})

/** A new sheet: one empty Verse in C major, in 4/4. */
export const emptySheet = (): ChordSheet => ({
  key: C_MAJOR,
  meter: '4/4',
  sections: [emptySection()],
})

/** A line of chords as a sheet: one Verse, a chord a bar. */
export function lineSheet(chords: readonly Chord[], key: Key, meter: SheetMeter): ChordSheet {
  const beats = beatsPerBar(meter)
  return {
    key,
    meter,
    sections: [
      { ...emptySection(), bars: chords.map((chord) => ({ chords: [{ chord, beats }] })) },
    ],
  }
}

/** Where a section's chord `index` is: its bar, and its place in that bar. */
function placeOf(section: SheetSection, index: number): { bar: number; at: number } | null {
  let left = index
  for (let bar = 0; bar < section.bars.length; bar++) {
    const count = section.bars[bar]?.chords.length ?? 0
    if (left < count) return { bar, at: left }
    left -= count
  }
  return null
}
/** A section with its bars changed, any bar left empty dropped. */
const withBars = (section: SheetSection, bars: readonly WrittenBar[]): SheetSection => ({
  ...section,
  bars: bars.filter((bar) => bar.chords.length > 0),
})
const changedBar = (
  section: SheetSection,
  bar: number,
  change: (chords: SheetChord[]) => SheetChord[],
): SheetSection =>
  withBars(
    section,
    section.bars.map((each, i) => (i === bar ? { chords: change([...each.chords]) } : each)),
  )

/** A piece of a chord in a bar: which chord, from which beat of the bar, for how many. */
export interface BarPiece {
  readonly chord: number
  readonly from: number
  readonly beats: number
}
export interface SheetBar {
  readonly pieces: readonly BarPiece[]
  /** Its length in beats, its chords': the meter's, unless an edit left it longer or shorter. */
  readonly beats: number
  /** Whether its beats are not the meter's: the bar is kept as written and marked (the !). */
  readonly wrong: boolean
}

/** A section's bars as shown: each chord by its index in the section, from its beat in the bar. */
export function sectionBars(section: SheetSection, meter: Meter): SheetBar[] {
  const perBar = beatsPerBar(meter)
  let index = 0
  return section.bars.map((bar) => {
    let from = 0
    const pieces = bar.chords.map(({ beats }) => {
      const piece = { chord: index++, from, beats }
      from += beats
      return piece
    })
    return { pieces, beats: from, wrong: from !== perBar }
  })
}

/** A section's bar count. */
export const barCount = (section: SheetSection): number => section.bars.length

/** A chord's length changed, 1 to 8 beats; nothing else moves, so its bar may no longer add up. */
export function resizeChord(section: SheetSection, index: number, beats: number): SheetSection {
  const place = placeOf(section, index)
  if (!place) return section
  return changedBar(section, place.bar, (chords) =>
    chords.map((each, i) => (i === place.at ? { ...each, beats: clampBeats(beats) } : each)),
  )
}

/** A chord put in place of another, keeping its length. */
export function setChord(section: SheetSection, index: number, chord: Chord): SheetSection {
  const place = placeOf(section, index)
  if (!place) return section
  return changedBar(section, place.bar, (chords) =>
    chords.map((each, i) => (i === place.at ? { ...each, chord } : each)),
  )
}

/**
 * A chord added after chord `at - 1` (`at` past the last: at the section's end). At the end it fills
 * what the last bar lacks, else it starts a bar of its own; between chords it joins the bar of the
 * chord before it, `beats` long (a bar of the meter where not given), and that bar is marked if it no
 * longer adds up. Nothing else moves.
 */
export function insertChord(
  section: SheetSection,
  at: number,
  chord: Chord,
  meter: Meter,
  beats?: number,
): SheetSection {
  const perBar = beatsPerBar(meter)
  const total = sectionChords(section).length
  const last = section.bars[section.bars.length - 1]
  if (at >= total || !last) {
    const left = last ? perBar - writtenBeats(last) : 0
    if (beats === undefined && last && left > 0)
      return changedBar(section, section.bars.length - 1, (chords) => [
        ...chords,
        { chord, beats: left },
      ])
    return withBars(section, [
      ...section.bars,
      { chords: [{ chord, beats: clampBeats(beats ?? perBar) }] },
    ])
  }
  const before = placeOf(section, Math.max(0, at - 1))
  if (!before) return section
  if (at === 0)
    return withBars(section, [
      { chords: [{ chord, beats: clampBeats(beats ?? perBar) }] },
      ...section.bars,
    ])
  return changedBar(section, before.bar, (chords) => {
    chords.splice(before.at + 1, 0, { chord, beats: clampBeats(beats ?? perBar) })
    return chords
  })
}

/**
 * A chord's copy after it: a chord alone in its bar is copied as a bar of its own after it; one
 * sharing its bar is copied into that bar, which is then marked. Nothing else moves.
 */
export function duplicateChord(section: SheetSection, index: number): SheetSection {
  const place = placeOf(section, index)
  const bar = place ? section.bars[place.bar] : undefined
  const chord = bar?.chords[place?.at ?? 0]
  if (!place || !bar || !chord) return section
  if (bar.chords.length === 1) {
    const bars = [...section.bars]
    bars.splice(place.bar + 1, 0, { chords: [chord] })
    return withBars(section, bars)
  }
  return changedBar(section, place.bar, (chords) => {
    chords.splice(place.at + 1, 0, chord)
    return chords
  })
}

/** A chord deleted: its bar goes with it when it was alone there; nothing else moves. */
export function removeChord(section: SheetSection, index: number): SheetSection {
  const place = placeOf(section, index)
  if (!place) return section
  return changedBar(section, place.bar, (chords) => chords.filter((_, i) => i !== place.at))
}

/** A chord taken out of a section, and the section without it. */
function takeChord(
  section: SheetSection,
  index: number,
): { chord: SheetChord; alone: boolean; rest: SheetSection } | null {
  const place = placeOf(section, index)
  const bar = place ? section.bars[place.bar] : undefined
  const chord = bar?.chords[place?.at ?? 0]
  if (!place || !bar || !chord) return null
  return { chord, alone: bar.chords.length === 1, rest: removeChord(section, index) }
}

/**
 * A chord put down before chord `to` (past the last: at the end), keeping its own length: a chord
 * that was alone in its bar lands as a bar of its own, before the bar of chord `to`; one that shared
 * a bar lands in that bar, which is marked if it no longer adds up.
 */
function putChord(
  section: SheetSection,
  to: number,
  { chord, alone }: { chord: SheetChord; alone: boolean },
): SheetSection {
  const place = placeOf(section, to)
  if (!place) {
    const last = section.bars.length - 1
    return alone || last < 0
      ? withBars(section, [...section.bars, { chords: [chord] }])
      : changedBar(section, last, (chords) => [...chords, chord])
  }
  if (alone) {
    const bars = [...section.bars]
    bars.splice(place.bar, 0, { chords: [chord] })
    return withBars(section, bars)
  }
  return changedBar(section, place.bar, (chords) => {
    chords.splice(place.at, 0, chord)
    return chords
  })
}

/** A chord moved to another place in its section, with its own length; nothing else is retimed. */
export function moveChord(section: SheetSection, from: number, to: number): SheetSection {
  const taken = takeChord(section, from)
  if (!taken || from === to) return section
  // The chord lands at index `to` of the result: before what then stands there.
  return putChord(taken.rest, to, taken)
}

/** The sheet with section `index` in place of its own. */
export const withSection = (
  sheet: ChordSheet,
  index: number,
  change: (section: SheetSection) => SheetSection,
): ChordSheet => ({
  ...sheet,
  sections: sheet.sections.map((section, i) => (i === index ? change(section) : section)),
})

/** A Verse after the last section; none past 12. */
export const addSection = (sheet: ChordSheet, kind: SectionKind = 'verse'): ChordSheet =>
  sheet.sections.length >= MOST_SECTIONS
    ? sheet
    : { ...sheet, sections: [...sheet.sections, emptySection(kind)] }

/** A section's copy after it; none past 12. */
export function duplicateSection(sheet: ChordSheet, index: number): ChordSheet {
  const section = sheet.sections[index]
  if (!section || sheet.sections.length >= MOST_SECTIONS) return sheet
  const sections = [...sheet.sections]
  sections.splice(index + 1, 0, section)
  return { ...sheet, sections }
}

/** A section deleted; the last one left is emptied instead, a sheet always having one. */
export function removeSection(sheet: ChordSheet, index: number): ChordSheet {
  if (sheet.sections.length === 1) return { ...sheet, sections: [emptySection()] }
  return { ...sheet, sections: sheet.sections.filter((_, i) => i !== index) }
}

/** A section moved to another place among them. */
export function moveSection(sheet: ChordSheet, from: number, to: number): ChordSheet {
  const sections = [...sheet.sections]
  const [moved] = sections.splice(from, 1)
  if (!moved) return sheet
  sections.splice(clamp(to, 0, sections.length), 0, moved)
  return { ...sheet, sections }
}

/** A box's place: its section and its index there. */
export interface ChordPlace {
  readonly section: number
  readonly index: number
}

/** A chord dragged into another section, an empty one too, before chord `to.index` or at its end: it keeps its own length, and neither section is retimed. */
export function moveChordAcross(sheet: ChordSheet, from: ChordPlace, to: ChordPlace): ChordSheet {
  if (from.section === to.section)
    return withSection(sheet, from.section, (s) => moveChord(s, from.index, to.index))
  const source = sheet.sections[from.section]
  const taken = source ? takeChord(source, from.index) : null
  if (!taken) return sheet
  const out = withSection(sheet, from.section, () => taken.rest)
  return withSection(out, to.section, (s) => putChord(s, to.index, taken))
}

/** Every chord of a section changed alike, the bars kept. */
export const eachChord = (
  section: SheetSection,
  change: (chord: SheetChord) => SheetChord,
): SheetSection => ({
  ...section,
  bars: section.bars.map((bar) => ({ chords: bar.chords.map(change) })),
})

/** The time signature changed: a chord of whole bars stays as many whole bars; another keeps its beats. */
export function relayMeter(sheet: ChordSheet, meter: SheetMeter): ChordSheet {
  const from = beatsPerBar(sheet.meter)
  const to = beatsPerBar(meter)
  return {
    ...sheet,
    meter,
    sections: sheet.sections.map((section) =>
      eachChord(section, (each) => ({
        ...each,
        beats: clampBeats(each.beats % from === 0 ? (each.beats / from) * to : each.beats),
      })),
    ),
  }
}

/** The sheet moved by `semitones`: its key and every chord, spelled in the key it lands in. */
export function transposeSheet(sheet: ChordSheet, semitones: number): ChordSheet {
  if (semitones === 0) return sheet
  const key = transposedKey(sheet.key, semitones)
  return {
    ...sheet,
    key,
    sections: sheet.sections.map((section) =>
      eachChord(section, (each) => ({
        ...each,
        chord: transposeChord(each.chord, sheet.key.tonic, key.tonic),
      })),
    ),
  }
}

/** A chord as a bar plays it: from which beat of the bar, for how many, and which chord it is. */
export interface PlayedChord {
  readonly chord: Chord
  readonly index: number
  readonly from: number
  readonly beats: number
}
/** A bar as played: its section, the repeat and its bar there, where it starts, its chords. */
export interface PlayedBar {
  readonly section: number
  readonly repeat: number
  readonly bar: number
  readonly startTick: Tick
  /** As long as its chords: a bar left longer or shorter by an edit plays as written. */
  readonly beats: number
  readonly chords: readonly PlayedChord[]
  /** The first bar of a section, the first time round: where a style may strike a crash. */
  readonly sectionStart: boolean
  /** The last bar of a section, the last time round: where a style plays its fill. */
  readonly fill: boolean
}

/** The sheet's bars in the order they play: each section its repeats, each bar as long as its chords. */
export function playOrder(sheet: ChordSheet): PlayedBar[] {
  const played: PlayedBar[] = []
  let tick = 0
  sheet.sections.forEach((section, index) => {
    const bars = sectionBars(section, sheet.meter)
    const chords = sectionChords(section)
    for (let repeat = 0; repeat < section.repeats; repeat++)
      bars.forEach((bar, at) => {
        played.push({
          section: index,
          repeat,
          bar: at,
          startTick: tick,
          beats: bar.beats,
          chords: bar.pieces.flatMap((piece): PlayedChord[] => {
            const chord = chords[piece.chord]
            return chord
              ? [{ chord: chord.chord, index: piece.chord, from: piece.from, beats: piece.beats }]
              : []
          }),
          sectionStart: repeat === 0 && at === 0,
          fill: repeat === section.repeats - 1 && at === bars.length - 1,
        })
        tick += beatsToTicks(bar.beats)
      })
  })
  return played
}

/** The sheet's length in ticks, as `playOrder` lays its bars. */
export const playedTicks = (sheet: ChordSheet): Tick =>
  playOrder(sheet).reduce((sum, bar) => sum + beatsToTicks(bar.beats), 0)

/** A chart of the bars in play order (`arrange`'s input): each section's each time round a section of it, four bars a line. */
export function sheetToChart(sheet: ChordSheet): Chart {
  // Each section's each time round, its bars in order.
  const rounds = new Map<string, ChartBar[]>()
  for (const bar of playOrder(sheet)) {
    const round = `${bar.section}.${bar.repeat}`
    rounds.set(round, [
      ...(rounds.get(round) ?? []),
      { beats: bar.beats, chords: bar.chords.map(({ chord, beats }) => ({ ...chord, beats })) },
    ])
  }
  const sections = [...rounds.values()].map((bars): ChartSection => ({
    lines: Array.from({ length: Math.ceil(bars.length / 4) }, (_, line) =>
      bars.slice(line * 4, line * 4 + 4),
    ),
  }))
  return { key: sheet.key, meter: sheet.meter, sections }
}

/** Where a beat of a played bar falls, in ticks. */
export const beatTick = (bar: PlayedBar, beat: number): Tick => bar.startTick + beatsToTicks(beat)
