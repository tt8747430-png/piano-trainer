import type { Section } from '@/entities/piece'
import type { Tick } from '@/shared/lib/music'
import type { Draft, DraftBar, DraftNote, DraftSection } from './draft'

export type Heading = Omit<Section, 'lines'>

/** A bar in the piece's order, saying whether it starts a line or a section (the first bar starts one). */
export interface Slot {
  readonly bar: DraftBar
  readonly newLine: boolean
  readonly newSection: Heading | null
}

export function slotsOf(draft: Draft): Slot[] {
  return draft.sections.flatMap((section) =>
    section.lines.flatMap((line, l) =>
      line.map((bar, b) => ({
        bar,
        newLine: b === 0,
        newSection: l === 0 && b === 0 ? section.heading : null,
      })),
    ),
  )
}

/** The sections the slots make: a heading starts a section, a line start a line. */
export function sectionsOf(slots: readonly Slot[]): DraftSection[] {
  const sections: { heading: Heading; lines: DraftBar[][] }[] = []
  for (const slot of slots) {
    const current = sections.at(-1)
    if (slot.newSection || !current) {
      sections.push({ heading: slot.newSection ?? { kind: 'verse' }, lines: [[slot.bar]] })
    } else if (slot.newLine) {
      current.lines.push([slot.bar])
    } else {
      current.lines.at(-1)?.push(slot.bar)
    }
  }
  return sections
}

export const withSlots = (draft: Draft, slots: readonly Slot[]): Draft => ({
  ...draft,
  sections: sectionsOf(slots),
})

/**
 * Notes after the timeline is cut at `at`: [at, at + removed) taken out and `inserted` ticks put in.
 * A note starting in what is taken goes; one held into `at` stops there; later ones move.
 */
export function spliceNotes(
  notes: readonly DraftNote[],
  at: Tick,
  removed: Tick,
  inserted: Tick,
): DraftNote[] {
  return notes.flatMap((n) => {
    if (n.startTick >= at + removed) return [{ ...n, startTick: n.startTick + inserted - removed }]
    if (n.startTick >= at) return []
    return n.startTick + n.durationTicks > at ? [{ ...n, durationTicks: at - n.startTick }] : [n]
  })
}

/** The melody's and each hand's notes spliced alike. */
export const spliceAll = (draft: Draft, at: Tick, removed: Tick, inserted: Tick): Draft => ({
  ...draft,
  melody: spliceNotes(draft.melody, at, removed, inserted),
  hands: {
    rh: spliceNotes(draft.hands.rh, at, removed, inserted),
    lh: spliceNotes(draft.hands.lh, at, removed, inserted),
  },
})
