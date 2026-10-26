import { withEveryStaff, type Draft, type DraftNote } from './draft'

/**
 * The song's first line as a draft of its own (ADR 0110, the Transpose sheet's preview): the first
 * section's first line of bars under its heading, and the notes that start in it, each cut at its
 * end. The draft itself where that is all it has.
 */
export function firstLine(draft: Draft): Draft {
  const [section] = draft.sections
  const [line] = section?.lines ?? []
  if (!section || !line) return draft
  if (draft.sections.length === 1 && section.lines.length === 1) return draft
  const end = line.reduce((ticks, bar) => ticks + bar.ticks, 0)
  const within = (notes: readonly DraftNote[]): DraftNote[] =>
    notes
      .filter((n) => n.startTick < end)
      .map((n) =>
        n.startTick + n.durationTicks > end ? { ...n, durationTicks: end - n.startTick } : n,
      )
  return withEveryStaff({ ...draft, sections: [{ ...section, lines: [line] }] }, within)
}
