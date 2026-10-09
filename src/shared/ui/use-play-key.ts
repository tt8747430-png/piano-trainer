import { useTranslation } from 'react-i18next'
import { useShortcuts, type Combo } from '@/shared/lib/shortcuts'

/** The key of a screen's one Play. */
export const PLAY_KEY: Combo = { key: 'Enter' }

/**
 * Enter plays a screen's one Play, its honey button, or stops it: `play` is the button's own tap.
 * Space is the piano's pedal on these screens, so Play takes Enter.
 */
export function usePlayKey(play: () => void, enabled = true): void {
  const { t } = useTranslation('common')
  useShortcuts(
    t('shortcuts.screen'),
    [{ label: t('shortcuts.play'), combo: PLAY_KEY, run: play }],
    { enabled },
  )
}
