import { useSearch } from '@tanstack/react-router'
import { useMemo } from 'react'
import { readStaves, stavesParam, type PlayerStaves } from '@/features/practice'
import { useSetSearch } from '@/shared/lib'
import type { EditSearch } from './edit-search'

/**
 * Which staves the editor plays and shows (A40): the Player's `staves` (A35) in its URL, every one
 * where it says none; a change replaces the entry, never pushes one (R26).
 */
export function useEditorStaves(): readonly [PlayerStaves, (next: PlayerStaves) => void] {
  const { staves }: Partial<EditSearch> = useSearch({ strict: false })
  const setSearch = useSetSearch<EditSearch>()
  const read = useMemo(() => readStaves(staves), [staves])
  return [read, (next) => setSearch({ staves: stavesParam(next) })] as const
}
