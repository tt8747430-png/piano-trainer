import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import { LANDSCAPE_PHONE, morph, useMediaQuery } from '@/shared/lib'

/**
 * What a screen's keys are for: read beside (a lesson, an explorer, a song's page), or played on (the
 * Chord finder), whose keys a phone on its side keeps out as anywhere else.
 */
export type KeysScreen = 'reading' | 'playing'

/**
 * Whether a page's keys are folded away, and the command that folds or unfolds them on every page:
 * the keys morph into their floating button and back, the way they go and where they dock named
 * for the motion (`theme.css`). On a phone on its side a reading page's keys keep a fold of their own
 * (`foldedLandscape`, folded until unfolded), so the little height there stays the page's and the
 * fold held upright is left as it was (ADR 0062).
 */
export function useFoldKeys(screen: KeysScreen = 'reading'): {
  folded: boolean
  fold: (on: boolean) => void
} {
  const store = useSettingsStoreApi()
  const { folded, foldedLandscape, dock } = useSettings(selectKeyboard)
  const onSide = useMediaQuery(LANDSCAPE_PHONE) && screen === 'reading'
  return {
    folded: onSide ? foldedLandscape : folded,
    fold: (on) =>
      morph(
        () => setKeyboard(store, onSide ? { foldedLandscape: on } : { folded: on }),
        `keys-${on ? 'fold' : 'unfold'}-${dock}`,
      ),
  }
}
