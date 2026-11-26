import { useMemo } from 'react'
import { useSectionHeading } from '@/entities/piece'
import { type Draft } from '@/features/score-editor'

/**
 * Each section's name in the learner's language, by section: printed at its first bar (ADR 0097).
 * The same array while the names are, so a line's row is not drawn again for every edit.
 */
export function useHeadings(draft: Draft): readonly string[] {
  const named = useSectionHeading()
  const said = draft.sections.map((section) => named({ ...section.heading, lines: [] })).join('\n')
  return useMemo(() => said.split('\n'), [said])
}
