import { selectSectionFolded, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setSectionFolded } from '@/features/set-preference'
import type { Fold } from '@/shared/ui'

/**
 * A page's section that folds under its heading (`FoldSection`), folded or open as the learner left
 * it, on every visit and every device's tab: `id` names it (`chords.tensions`).
 */
export function useFold(id: string): Fold {
  const store = useSettingsStoreApi()
  const folded = useSettings(selectSectionFolded(id))
  return { open: !folded, toggle: () => setSectionFolded(store, id, !folded) }
}
