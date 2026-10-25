import { useMemo } from 'react'
import type { DraftStaff } from '@/features/score-editor'
import { useEditorState } from './editor-context'

/** A single staff without its notes: what its name prints and its switch in the View show. */
export type StaffHead = Pick<DraftStaff, 'name' | 'clef'>

/**
 * The draft's single staves top down, each its name and clef (ADR 0097): the same array while they
 * are, so what names the staves is not drawn again for every note written.
 */
export function useStaffHeads(): readonly StaffHead[] {
  const key = useEditorState((state) =>
    JSON.stringify(state.draft.staves.map(({ name, clef }) => ({ name, clef }))),
  )
  return useMemo(() => JSON.parse(key) as StaffHead[], [key])
}
