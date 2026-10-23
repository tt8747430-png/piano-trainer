import type { PatternId } from '@/entities/pattern'
import type { SectionKind } from '@/entities/piece'
import type { Draft, DraftSection } from './draft'
import { slotsOf, withSlots, type Heading } from './structure'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const sameHeading = (a: Heading, b: Heading): boolean =>
  a.kind === b.kind &&
  a.n === b.n &&
  a.label === b.label &&
  a.last === b.last &&
  a.detail?.en === b.detail?.en &&
  a.detail?.ru === b.detail?.ru &&
  a.key === b.key &&
  a.pattern === b.pattern

/**
 * A new section's heading as its kind and place name it: a verse the number after the verses before
 * it, a part the first letter no part of the piece has yet (a part's letter names its music, so A A B A
 * is a form, and no part is ever lettered again).
 */
function named(
  kind: SectionKind,
  before: readonly DraftSection[],
  all: readonly DraftSection[],
): Heading {
  if (kind === 'verse')
    return { kind, n: before.filter((section) => section.heading.kind === 'verse').length + 1 }
  if (kind === 'part') {
    const used = new Set(all.map((section) => section.heading.label))
    return { kind, label: [...LETTERS].find((letter) => !used.has(letter)) ?? 'A' }
  }
  return { kind }
}

/**
 * The numbered verses from section `from` on moved by `by` where their number is `atLeast` or more:
 * a verse put in before them counts them on, one taken out counts them back, so no two verses are 2.
 */
function countVerses(draft: Draft, from: number, atLeast: number, by: 1 | -1): Draft {
  let changed = false
  const sections = draft.sections.map((section, i) => {
    const { heading } = section
    if (i < from || heading.kind !== 'verse' || heading.n === undefined || heading.n < atLeast)
      return section
    changed = true
    return { ...section, heading: { ...heading, n: heading.n + by } }
  })
  return changed ? { ...draft, sections } : draft
}

/**
 * The numbered verses counted 1, 2, 3… in order: after bars are taken, a verse that went (or one whose
 * heading gave way to the section after it) leaves no gap, nor a piece that starts at Verse 2.
 */
export function versesInOrder(draft: Draft): Draft {
  let count = 0
  let changed = false
  const sections = draft.sections.map((section) => {
    const { heading } = section
    if (heading.kind !== 'verse' || heading.n === undefined) return section
    count += 1
    if (heading.n === count) return section
    changed = true
    return { ...section, heading: { ...heading, n: count } }
  })
  return changed ? { ...draft, sections } : draft
}

/** The verses after section `index` counted back where it was a numbered verse that goes. */
const withoutVerse = (draft: Draft, index: number, heading: Heading | undefined): Draft =>
  heading?.kind === 'verse' && heading.n !== undefined
    ? countVerses(draft, index + 1, heading.n + 1, -1)
    : draft

/** The verses after section `index` counted on where it became a numbered verse. */
const withVerse = (draft: Draft, index: number, heading: Heading): Draft =>
  heading.kind === 'verse' && heading.n !== undefined
    ? countVerses(draft, index + 1, heading.n, 1)
    : draft

/** Section `index` made a section of another kind, named afresh. */
export function setSectionKind(draft: Draft, index: number, kind: SectionKind): Draft {
  const section = draft.sections[index]
  if (!section) return draft
  const others = draft.sections.filter((other) => other !== section)
  // Named afresh, it keeps what it plays: its key and its own pattern.
  const { key, pattern } = section.heading
  const heading: Heading = {
    ...named(kind, draft.sections.slice(0, index), others),
    ...(key === undefined ? {} : { key }),
    ...(pattern === undefined ? {} : { pattern }),
  }
  if (sameHeading(heading, section.heading)) return draft
  const renamed: Draft = {
    ...draft,
    sections: draft.sections.map((other) => (other === section ? { ...other, heading } : other)),
  }
  return withVerse(withoutVerse(renamed, index, section.heading), index, heading)
}

/** Section `index` playing a pattern of its own (ADR 0065), or the piece's again (`null`). */
export function setSectionPattern(draft: Draft, index: number, pattern: PatternId | null): Draft {
  const section = draft.sections[index]
  if (!section || (section.heading.pattern ?? null) === pattern) return draft
  const { pattern: _was, ...rest } = section.heading
  const heading: Heading = pattern === null ? rest : { ...rest, pattern }
  return {
    ...draft,
    sections: draft.sections.map((other) => (other === section ? { ...other, heading } : other)),
  }
}

/** A new section from bar `index`, of the kind it was in, named next; a bar starting one changes nothing. */
export function newSection(draft: Draft, index: number): Draft {
  const slots = slotsOf(draft)
  const slot = slots[index]
  if (!slot || slot.newSection) return draft
  const containing = slots.slice(0, index).filter((other) => other.newSection).length - 1
  const kind = draft.sections[containing]?.heading.kind ?? 'verse'
  const heading = named(kind, draft.sections.slice(0, containing + 1), draft.sections)
  const split = withSlots(
    draft,
    slots.map((other, i) =>
      i === index ? { ...other, newLine: true, newSection: heading } : other,
    ),
  )
  return withVerse(split, containing + 1, heading)
}

/** Section `index` joined to the one before it, its lines after that one's. */
export function joinSection(draft: Draft, index: number): Draft {
  const joined = draft.sections[index]
  if (index < 1 || !joined) return draft
  const slots = slotsOf(draft)
  let seen = -1
  const merged = withSlots(
    draft,
    slots.map((slot) => {
      if (!slot.newSection) return slot
      seen += 1
      return seen === index ? { ...slot, newSection: null, newLine: true } : slot
    }),
  )
  return withoutVerse(merged, index - 1, joined.heading)
}
