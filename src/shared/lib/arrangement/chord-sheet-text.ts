import { beatsPerBar, chordSymbol, keySymbol, parseKey, readChordSymbol } from '@/shared/lib/music'
import {
  CHORD_BEATS,
  isSectionKind,
  isSheetMeter,
  isArrangerNumber,
  isInto,
  isMain,
  isVariation,
  NO_MARKS,
  SECTION_KINDS,
  SECTION_REPEATS,
  type ChordSheet,
  type SectionKind,
  type SheetChord,
  type SheetSection,
} from './chord-sheet'

/**
 * A chord sheet as one line of text (R29 CP5), what a Share link carries and a saved sheet keeps:
 * `Am 3/4; intro v4: Am; verse x2: Am:2 G/B:1 | C`. The key and the time, then each section: its
 * kind, `xN` its repeats and `vN` its variation where not 1, its arranger marks where set (`i1` its
 * Intro, `mAB` its Main each time through, `-` for one unset, `fill` or `break` into the next, `e2` its
 * Ending), and its bars between `|`, `:N` a chord's beats where it does not last a bar.
 */
export function sheetToText(sheet: ChordSheet): string {
  const bar = beatsPerBar(sheet.meter)
  const sections = sheet.sections.map((section) => {
    const head = [
      section.kind,
      ...(section.repeats === 1 ? [] : [`x${section.repeats}`]),
      ...(section.variation === 1 ? [] : [`v${section.variation}`]),
      ...marksText(section.marks),
    ].join(' ')
    const bars = section.bars.map((each) =>
      each.chords
        .map(({ chord, beats }) => chordSymbol(chord) + (beats === bar ? '' : `:${beats}`))
        .join(' '),
    )
    return `${head}: ${bars.join(' | ')}`.trimEnd()
  })
  return [`${keySymbol(sheet.key)} ${sheet.meter}`, ...sections].join('; ')
}

/** A section's arranger marks as head words: none for what is unset. */
function marksText(marks: SheetSection['marks']): string[] {
  const mains = marks.mains.map((main) => main ?? '-').join('')
  return [
    ...(marks.intro === null ? [] : [`i${marks.intro}`]),
    ...(mains.replaceAll('-', '') === '' ? [] : [`m${mains}`]),
    ...(marks.into === null ? [] : [marks.into]),
    ...(marks.ending === null ? [] : [`e${marks.ending}`]),
  ]
}

/** A section's arranger marks read from its head words, what does not read left unset. */
function readMarks(head: readonly string[]): SheetSection['marks'] {
  const numbered = (letter: string) => {
    const value = Number(
      head.find((word) => new RegExp(`^${letter}\\d$`, 'i').test(word))?.slice(1),
    )
    return isArrangerNumber(value) ? value : null
  }
  const mains = head.find((word) => /^m[a-d-]+$/i.test(word))
  const into = head.map((word) => word.toLowerCase()).find(isInto)
  return {
    ...NO_MARKS,
    intro: numbered('i'),
    mains: mains
      ? [...mains.slice(1).toUpperCase()].map((letter) => (isMain(letter) ? letter : null))
      : [],
    into: into ?? null,
    ending: numbered('e'),
  }
}

const KINDS = new Map<string, SectionKind>(SECTION_KINDS.map((kind) => [kind.toLowerCase(), kind]))

const bounded = (text: string | undefined, min: number, max: number, otherwise: number) => {
  const value = Number(text)
  return Number.isInteger(value) ? Math.min(max, Math.max(min, value)) : otherwise
}

/** Chords laid end to end into bars of `perBar` beats, a new bar once one is full. */
function layIntoBars(chords: readonly SheetChord[], perBar: number): { chords: SheetChord[] }[] {
  const bars: { chords: SheetChord[] }[] = []
  let filled = perBar
  for (const chord of chords) {
    if (filled >= perBar) {
      bars.push({ chords: [] })
      filled = 0
    }
    bars[bars.length - 1]?.chords.push(chord)
    filled += chord.beats
  }
  return bars
}

/** A section's text read: its head's words in any case and order, its chords that read. */
function readSection(text: string, bar: number): SheetSection | null {
  const colon = text.indexOf(':')
  const head = (colon < 0 ? text : text.slice(0, colon)).trim().split(/\s+/)
  const kind = KINDS.get(head[0]?.toLowerCase() ?? '')
  if (!kind || !isSectionKind(kind)) return null
  const repeats = head.find((word) => /^x\d+$/i.test(word))?.slice(1)
  const variation = head.find((word) => /^v\d+$/i.test(word))?.slice(1)
  const bars = (colon < 0 ? '' : text.slice(colon + 1))
    .split('|')
    .map((part) => ({
      chords: part
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .flatMap((word): SheetChord[] => {
          const [symbol = '', beats] = word.split(':')
          const chord = readChordSymbol(symbol)
          return chord
            ? [{ chord, beats: bounded(beats, CHORD_BEATS.min, CHORD_BEATS.max, bar) }]
            : []
        }),
    }))
    .filter((each) => each.chords.length > 0)
  // A sheet saved before bars were written (no `|`): its chords laid into bars of the meter, as they
  // played; a chord that crossed a bar line stays whole in the bar it starts in, which is then marked.
  const laid =
    !text.includes('|') && bars.length === 1 ? layIntoBars(bars[0]?.chords ?? [], bar) : bars
  const v = Number(variation)
  return {
    kind,
    repeats: bounded(repeats, SECTION_REPEATS.min, SECTION_REPEATS.max, 1),
    variation: isVariation(v) ? v : 1,
    marks: readMarks(head),
    bars: laid,
  }
}

/**
 * A sheet's text read back, as leniently as it can be (Postel's law): a section or a chord that
 * does not read is left out, numbers kept in their range, a time no sheet has read as 4/4. Null
 * without a key or a section.
 */
export function textToSheet(text: string): ChordSheet | null {
  const [first = '', ...rest] = text.split(';')
  const [keyText = '', meterText = ''] = first.trim().split(/\s+/)
  const key = parseKey(keyText.charAt(0).toUpperCase() + keyText.slice(1))
  if (!key) return null
  const meter = isSheetMeter(meterText) ? meterText : '4/4'
  const bar = beatsPerBar(meter)
  const sections = rest.flatMap((part) => readSection(part, bar) ?? [])
  return sections.length > 0 ? { key, meter, sections } : null
}
