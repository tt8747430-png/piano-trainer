import type { ChordSheet, SheetSection } from './chord-sheet'
import { sheetToText, textToSheet } from './chord-sheet-text'

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

/** One part of three: this copy's where it changed it since `base`, else the other copy's. */
const pick = <T>(base: T, mine: T, theirs: T): T => (same(base, mine) ? theirs : mine)

function mergeSection(base: SheetSection, mine: SheetSection, theirs: SheetSection): SheetSection {
  const bars =
    base.bars.length === mine.bars.length && mine.bars.length === theirs.bars.length
      ? mine.bars.map((bar, at) => pick(base.bars[at] ?? bar, bar, theirs.bars[at] ?? bar))
      : pick(base.bars, mine.bars, theirs.bars)
  return {
    kind: pick(base.kind, mine.kind, theirs.kind),
    repeats: pick(base.repeats, mine.repeats, theirs.repeats),
    variation: pick(base.variation, mine.variation, theirs.variation),
    marks: pick(base.marks, mine.marks, theirs.marks),
    bars,
  }
}

/**
 * Two copies of a shared sheet, each changed since `base`, made one bar by bar (R39-10): a bar changed in
 * this copy keeps this copy's chords, every other bar takes the other copy's; where both changed the same
 * bar, this copy's edit, the last made, wins. A section added, removed or moved here takes this copy's
 * sections whole.
 */
export function mergeSheets(base: ChordSheet, mine: ChordSheet, theirs: ChordSheet): ChordSheet {
  const aligned =
    base.sections.length === mine.sections.length && mine.sections.length === theirs.sections.length
  return {
    key: pick(base.key, mine.key, theirs.key),
    meter: pick(base.meter, mine.meter, theirs.meter),
    sections: aligned
      ? mine.sections.map((section, at) =>
          mergeSection(base.sections[at] ?? section, section, theirs.sections[at] ?? section),
        )
      : pick(base.sections, mine.sections, theirs.sections),
  }
}

/** `mergeSheets` over the sheets' texts; the other copy's text where this copy's does not read. */
export function mergeSheetTexts(base: string, mine: string, theirs: string): string {
  const [b, m, t] = [textToSheet(base), textToSheet(mine), textToSheet(theirs)]
  if (!m || !t) return theirs
  return sheetToText(mergeSheets(b ?? m, m, t))
}
