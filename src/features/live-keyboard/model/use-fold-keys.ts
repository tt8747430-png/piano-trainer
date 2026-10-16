import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import { morph } from '@/shared/lib'

/**
 * Whether a page's keys are folded away, and the command that folds or unfolds them on every page:
 * the keys morph into their floating button and back.
 */
export function useFoldKeys(): { folded: boolean; fold: (on: boolean) => void } {
  const store = useSettingsStoreApi()
  const folded = useSettings((state) => selectKeyboard(state).folded)
  return { folded, fold: (on) => morph(() => setKeyboard(store, { folded: on })) }
}
