import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import { morph } from '@/shared/lib'

/**
 * Whether a page's keys are folded away, and the command that folds or unfolds them on every page:
 * the keys morph into their floating button and back, the way they go and where they dock named
 * for the motion (`theme.css`).
 */
export function useFoldKeys(): { folded: boolean; fold: (on: boolean) => void } {
  const store = useSettingsStoreApi()
  const { folded, dock } = useSettings(selectKeyboard)
  return {
    folded,
    fold: (on) =>
      morph(() => setKeyboard(store, { folded: on }), `keys-${on ? 'fold' : 'unfold'}-${dock}`),
  }
}
