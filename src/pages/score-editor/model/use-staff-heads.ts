import { useMemo } from 'react'
import type { DraftStaff } from '@/features/score-editor'
import { isOneOf, isRecord } from '@/shared/lib'
import { CLEFS } from '@/shared/lib/music'
import { useEditorState } from './editor-context'

/** A single staff without its notes: what its name prints and its switch in the View show. */
export type StaffHead = Pick<DraftStaff, 'name' | 'clef'>

const isClef = isOneOf(CLEFS)

/** The heads read back from their key: each its clef, and its name where it has one. */
function headsOf(key: string): StaffHead[] {
  const heads: unknown = JSON.parse(key)
  if (!Array.isArray(heads)) return []
  return heads.flatMap((head: unknown) => {
    if (!isRecord(head) || !isClef(head.clef)) return []
    const { name, clef } = head
    if (typeof name === 'string') return [{ name, clef }]
    if (isRecord(name) && typeof name.en === 'string' && typeof name.ru === 'string')
      return [{ name: { en: name.en, ru: name.ru }, clef }]
    return [{ clef }]
  })
}

/**
 * The draft's single staves top down, each its name and clef (ADR 0097): the same array while they
 * are, so what names the staves is not drawn again for every note written.
 */
export function useStaffHeads(): readonly StaffHead[] {
  const key = useEditorState((state) =>
    JSON.stringify(state.draft.staves.map(({ name, clef }) => ({ name, clef }))),
  )
  return useMemo(() => headsOf(key), [key])
}
