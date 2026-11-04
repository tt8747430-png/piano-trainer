import { useSearch } from '@tanstack/react-router'
import { useSetSearch } from '@/shared/lib'
import type { EditSearch, EditorPanelTab } from './edit-search'

/**
 * The editor's panel's tab (A40): in the URL (`?panel=`), Notation where it says none; a tab chosen
 * replaces the entry, never pushes one (R26).
 */
export function useEditorPanel(): readonly [EditorPanelTab, (tab: EditorPanelTab) => void] {
  const { panel }: Partial<EditSearch> = useSearch({ strict: false })
  const setSearch = useSetSearch<EditSearch>()
  return [
    panel ?? 'notation',
    (tab) => setSearch({ panel: tab === 'notation' ? undefined : tab }),
  ] as const
}
