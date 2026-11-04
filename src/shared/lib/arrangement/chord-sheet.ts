import {
  barTicks,
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
 * A chord sheet (R29 CP2): a lead sheet's sections, each played its repeats, made of chords that
 * last whole beats, laid end to end across the bar lines. What the Chord player shows, edits and
 * plays in a style.
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
export interface SheetSection {
  readonly kind: SectionKind
  readonly repeats: number
  readonly variation: Variation
  readonly chords: readonly SheetChord[]
}
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
  chords: [],
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
    sections: [{ ...emptySection(), chords: chords.map((chord) => ({ chord, beats })) }],
  }
}

/** Where each chord starts, in beats from its section's start. */
const starts = (chords: readonly SheetChord[]): number[] => {
  let at = 0
  return chords.map(({ beats }) => {
    const start = at
    at += beats
    return start
  })
}
const sectionBeats = (section: SheetSection) =>
  section.chords.reduce((sum, { beats }) => sum + beats, 0)

/** A piece of a chord in a bar: which chord, from which beat of the bar, for how many. */
export interface BarPiece {
  readonly chord: number
  readonly from: number
  readonly beats: number
  /** Whether the chord began in an earlier bar and is held over the bar line into this one. */
  readonly held: boolean
}
export interface SheetBar {
  readonly pieces: readonly BarPiece[]
  /** Beats of the bar a chord fills: all of them but in a section's last bar. */
  readonly filled: number
}

/** A section's bars: its chords laid end to end across the bar lines, the last bar maybe part filled. */
export function sectionBars(section: SheetSection, meter: Meter): SheetBar[] {
  const perBar = beatsPerBar(meter)
  const total = sectionBeats(section)
  const count = Math.ceil(total / perBar)
  const at = starts(section.chords)
  return Array.from({ length: count }, (_, bar) => {
    const barStart = bar * perBar
    const barEnd = barStart + perBar
    const pieces = section.chords.flatMap(({ beats }, chord): BarPiece[] => {
      const start = at[chord] ?? 0
      const from = Math.max(start, barStart)
      const to = Math.min(start + beats, barEnd)
      return to > from
        ? [{ chord, from: from - barStart, beats: to - from, held: start < barStart }]
        : []
    })
    return { pieces, filled: Math.min(perBar, total - barStart) }
  })
}

/** A section's bar count. */
export const barCount = (section: SheetSection, meter: Meter): number =>
  Math.ceil(sectionBeats(section) / beatsPerBar(meter))

const withChords = (section: SheetSection, chords: readonly SheetChord[]): SheetSection => ({
  ...section,
  chords,
})

/**
 * A box's length changed: it lasts 1 to 8 beats; the chord after it gives up or takes the beats, so
 * no bar is left short, itself never under a beat nor over 8. The last box grows or shrinks its section.
 */
export function resizeChord(section: SheetSection, index: number, beats: number): SheetSection {
  const chord = section.chords[index]
  if (!chord) return section
  const next = section.chords[index + 1]
  let wanted = clampBeats(beats)
  if (next) {
    // The next chord stays between 1 and 8 beats.
    const total = chord.beats + next.beats
    wanted = clamp(wanted, Math.max(CHORD_BEATS.min, total - CHORD_BEATS.max), total - 1)
    return withChords(
      section,
      section.chords.map((each, i) =>
        i === index
          ? { ...each, beats: wanted }
          : i === index + 1
            ? { ...each, beats: total - wanted }
            : each,
      ),
    )
  }
  return withChords(
    section,
    section.chords.map((each, i) => (i === index ? { ...each, beats: wanted } : each)),
  )
}

/** A chord put in place of a box's. */
export const setChord = (section: SheetSection, index: number, chord: Chord): SheetSection =>
  withChords(
    section,
    section.chords.map((each, i) => (i === index ? { ...each, chord } : each)),
  )

/**
 * A chord put at `at`: at the end it takes what is left of the last bar (a whole bar where the last
 * is full); between two chords, half the beats of the one before it, which keeps the rest; `beats`
 * where given.
 */
export function insertChord(
  section: SheetSection,
  at: number,
  chord: Chord,
  meter: Meter,
  beats?: number,
): SheetSection {
  const chords = [...section.chords]
  const index = clamp(at, 0, chords.length)
  if (beats !== undefined) {
    chords.splice(index, 0, { chord, beats: clampBeats(beats) })
    return withChords(section, chords)
  }
  const before = chords[index - 1]
  if (index === chords.length || !before) {
    const perBar = beatsPerBar(meter)
    const left = perBar - (sectionBeats(section) % perBar)
    const length = index === chords.length ? clampBeats(left) : clampBeats(perBar)
    chords.splice(index, 0, { chord, beats: length })
    return withChords(section, chords)
  }
  if (before.beats < 2) {
    chords.splice(index, 0, { chord, beats: 1 })
    return withChords(section, chords)
  }
  const half = Math.floor(before.beats / 2)
  chords[index - 1] = { ...before, beats: before.beats - half }
  chords.splice(index, 0, { chord, beats: half })
  return withChords(section, chords)
}

/**
 * A box deleted. Its beats go to the chord before it where that one ends inside its bar, else to
 * the chord after it where it ends inside a bar; a chord that filled whole bars takes its bars with it.
 */
export function removeChord(
  section: SheetSection,
  index: number,
  meter: Meter = '4/4',
): SheetSection {
  const removed = section.chords[index]
  if (!removed) return section
  const perBar = beatsPerBar(meter)
  const start = starts(section.chords)[index] ?? 0
  const end = start + removed.beats
  const chords = [...section.chords]
  chords.splice(index, 1)
  const give = (at: number) => {
    const taker = chords[at]
    if (!taker) return
    chords[at] = { ...taker, beats: Math.min(CHORD_BEATS.max, taker.beats + removed.beats) }
  }
  if (start % perBar !== 0 && index > 0) give(index - 1)
  else if (end % perBar !== 0 && index < chords.length) give(index)
  return withChords(section, chords)
}

/** A box moved to another place: the chords move, the lengths stay where they are, so every bar keeps its beats. */
export function moveChord(section: SheetSection, from: number, to: number): SheetSection {
  const symbols = section.chords.map(({ chord }) => chord)
  const [moved] = symbols.splice(from, 1)
  if (!moved) return section
  symbols.splice(clamp(to, 0, symbols.length), 0, moved)
  return withChords(
    section,
    section.chords.map((each, i) => ({ ...each, chord: symbols[i] ?? each.chord })),
  )
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

/** A box moved to another section: taken out of its own (its beats given as a delete gives them), added to the other's end or at `index`. */
export function moveChordAcross(sheet: ChordSheet, from: ChordPlace, to: ChordPlace): ChordSheet {
  if (from.section === to.section)
    return withSection(sheet, from.section, (s) => moveChord(s, from.index, to.index))
  const chord = sheet.sections[from.section]?.chords[from.index]
  if (!chord) return sheet
  const taken = withSection(sheet, from.section, (s) => removeChord(s, from.index, sheet.meter))
  return withSection(taken, to.section, (s) => insertChord(s, to.index, chord.chord, sheet.meter))
}

/** The time signature changed: a chord of whole bars stays as many whole bars; another keeps its beats. */
export function relayMeter(sheet: ChordSheet, meter: SheetMeter): ChordSheet {
  const from = beatsPerBar(sheet.meter)
  const to = beatsPerBar(meter)
  return {
    ...sheet,
    meter,
    sections: sheet.sections.map((section) =>
      withChords(
        section,
        section.chords.map((each) => ({
          ...each,
          beats: clampBeats(each.beats % from === 0 ? (each.beats / from) * to : each.beats),
        })),
      ),
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
      withChords(
        section,
        section.chords.map((each) => ({
          ...each,
          chord: transposeChord(each.chord, sheet.key.tonic, key.tonic),
        })),
      ),
    ),
  }
}

/** A chord as a bar plays it: from which beat of the bar, for how many, and which box it is. */
export interface PlayedChord {
  readonly chord: Chord
  readonly index: number
  readonly from: number
  readonly beats: number
  /** Held over the bar line from the bar before. */
  readonly held: boolean
}
/** A bar as played: its section, the repeat and its bar there, where it starts, its chords. */
export interface PlayedBar {
  readonly section: number
  readonly repeat: number
  readonly bar: number
  readonly startTick: Tick
  readonly beats: number
  readonly chords: readonly PlayedChord[]
  /** The first bar of a section, the first time round: where a style may strike a crash. */
  readonly sectionStart: boolean
  /** The last bar of a section, the last time round: where a style plays its fill. */
  readonly fill: boolean
}

/**
 * The sheet's bars in the order they play: each section its repeats. A part-filled last bar's last
 * chord rings to the bar's end; a section with no chords plays nothing.
 */
export function playOrder(sheet: ChordSheet): PlayedBar[] {
  const perBar = beatsPerBar(sheet.meter)
  const length = barTicks(sheet.meter)
  const played: PlayedBar[] = []
  sheet.sections.forEach((section, index) => {
    const bars = sectionBars(section, sheet.meter)
    for (let repeat = 0; repeat < section.repeats; repeat++)
      bars.forEach((bar, at) => {
        const last = at === bars.length - 1
        const chords = bar.pieces.flatMap((piece, i): PlayedChord[] => {
          const chord = section.chords[piece.chord]
          if (!chord) return []
          const isLast = last && i === bar.pieces.length - 1
          return [
            {
              chord: chord.chord,
              index: piece.chord,
              from: piece.from,
              beats: isLast ? perBar - piece.from : piece.beats,
              held: piece.held,
            },
          ]
        })
        played.push({
          section: index,
          repeat,
          bar: at,
          startTick: played.length * length,
          beats: perBar,
          chords,
          sectionStart: repeat === 0 && at === 0,
          fill: repeat === section.repeats - 1 && last,
        })
      })
  })
  return played
}

/** Every bar's length in ticks, as `playOrder` lays them. */
export const playedTicks = (sheet: ChordSheet): Tick =>
  playOrder(sheet).length * barTicks(sheet.meter)

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
