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
  a.detail?.ru === b.detail?.ru

/** A section's heading as its kind and place name it: a verse its number among the verses, a part its letter. */
function named(kind: SectionKind, before: readonly DraftSection[]): Heading {
  const same = before.filter((section) => section.heading.kind === kind).length
  if (kind === 'verse') return { kind, n: same + 1 }
  if (kind === 'part') return { kind, label: LETTERS[same % LETTERS.length] ?? 'A' }
  return { kind }
}

/** A letter a part is named by in order (A, B, …), not a name the learner gave it (Bridge). */
const isOrderLetter = (label: string | undefined): boolean =>
  label !== undefined && label.length === 1 && LETTERS.includes(label)

/**
 * The sections named in order again after a change of them: each numbered verse its number among
 * the verses, each lettered part its letter among the parts, so a new, joined or changed section
 * leaves no two verses 2. A name the learner gave stays; a draft named in order already is itself.
 */
function inOrder(draft: Draft): Draft {
  const seen = { verse: 0, part: 0 }
  let changed = false
  const sections = draft.sections.map((section) => {
    const { heading } = section
    if (heading.kind !== 'verse' && heading.kind !== 'part') return section
    const place = seen[heading.kind]++
    const renamed: Heading =
      heading.kind === 'verse' && heading.n !== undefined
        ? { ...heading, n: place + 1 }
        : heading.kind === 'part' && isOrderLetter(heading.label)
          ? { ...heading, label: LETTERS[place % LETTERS.length] ?? 'A' }
          : heading
    if (sameHeading(renamed, heading)) return section
    changed = true
    return { ...section, heading: renamed }
  })
  return changed ? { ...draft, sections } : draft
}

/** Section `index` made a section of another kind, named afresh. */
export function setSectionKind(draft: Draft, index: number, kind: SectionKind): Draft {
  const section = draft.sections[index]
  if (!section) return draft
  const heading = named(kind, draft.sections.slice(0, index))
  if (sameHeading(heading, section.heading)) return draft
  return inOrder({
    ...draft,
    sections: draft.sections.map((other) => (other === section ? { ...other, heading } : other)),
  })
}

/** A new section from bar `index`, of the kind it was in, named next; a bar starting one changes nothing. */
export function newSection(draft: Draft, index: number): Draft {
  const slots = slotsOf(draft)
  const slot = slots[index]
  if (!slot || slot.newSection) return draft
  const containing = slots.slice(0, index).filter((other) => other.newSection).length - 1
  const kind = draft.sections[containing]?.heading.kind ?? 'verse'
  const heading = named(kind, draft.sections.slice(0, containing + 1))
  return inOrder(
    withSlots(
      draft,
      slots.map((other, i) =>
        i === index ? { ...other, newLine: true, newSection: heading } : other,
      ),
    ),
  )
}

/** Section `index` joined to the one before it, its lines after that one's. */
export function joinSection(draft: Draft, index: number): Draft {
  if (index < 1 || !draft.sections[index]) return draft
  const slots = slotsOf(draft)
  let seen = -1
  return inOrder(
    withSlots(
      draft,
      slots.map((slot) => {
        if (!slot.newSection) return slot
        seen += 1
        return seen === index ? { ...slot, newSection: null, newLine: true } : slot
      }),
    ),
  )
}
