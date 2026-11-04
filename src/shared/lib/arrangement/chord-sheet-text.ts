import { beatsPerBar, chordSymbol, keySymbol, parseKey, readChordSymbol } from '@/shared/lib/music'
import {
  CHORD_BEATS,
  isSectionKind,
  isSheetMeter,
  isVariation,
  SECTION_KINDS,
  SECTION_REPEATS,
  type ChordSheet,
  type SectionKind,
  type SheetChord,
  type SheetSection,
} from './chord-sheet'

/**
 * A chord sheet as one line of text (R29 CP5), what a Share link carries and a saved sheet keeps:
 * `Am 3/4; intro v4: Am; verse x2: Am:2 G/B:1 C`. The key and the time, then each section: its
 * kind, `xN` its repeats and `vN` its variation where not 1, and its chords, `:N` a chord's beats
 * where it does not last a bar.
 */
export function sheetToText(sheet: ChordSheet): string {
  const bar = beatsPerBar(sheet.meter)
  const sections = sheet.sections.map((section) => {
    const head = [
      section.kind,
      ...(section.repeats === 1 ? [] : [`x${section.repeats}`]),
      ...(section.variation === 1 ? [] : [`v${section.variation}`]),
    ].join(' ')
    const chords = section.chords.map(
      ({ chord, beats }) => chordSymbol(chord) + (beats === bar ? '' : `:${beats}`),
    )
    return [`${head}:`, ...chords].join(' ')
  })
  return [`${keySymbol(sheet.key)} ${sheet.meter}`, ...sections].join('; ')
}

const KINDS = new Map<string, SectionKind>(SECTION_KINDS.map((kind) => [kind.toLowerCase(), kind]))

const bounded = (text: string | undefined, min: number, max: number, otherwise: number) => {
  const value = Number(text)
  return Number.isInteger(value) ? Math.min(max, Math.max(min, value)) : otherwise
}

/** A section's text read: its head's words in any case and order, its chords that read. */
function readSection(text: string, bar: number): SheetSection | null {
  const colon = text.indexOf(':')
  const head = (colon < 0 ? text : text.slice(0, colon)).trim().split(/\s+/)
  const kind = KINDS.get(head[0]?.toLowerCase() ?? '')
  if (!kind || !isSectionKind(kind)) return null
  const repeats = head.find((word) => /^x\d+$/i.test(word))?.slice(1)
  const variation = head.find((word) => /^v\d+$/i.test(word))?.slice(1)
  const words =
    colon < 0
      ? []
      : text
          .slice(colon + 1)
          .trim()
          .split(/\s+/)
          .filter(Boolean)
  const chords = words.flatMap((word): SheetChord[] => {
    const [symbol = '', beats] = word.split(':')
    const chord = readChordSymbol(symbol)
    return chord ? [{ chord, beats: bounded(beats, CHORD_BEATS.min, CHORD_BEATS.max, bar) }] : []
  })
  const v = Number(variation)
  return {
    kind,
    repeats: bounded(repeats, SECTION_REPEATS.min, SECTION_REPEATS.max, 1),
    variation: isVariation(v) ? v : 1,
    chords,
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
