import { useTranslation } from 'react-i18next'
import type { ScoreSetup } from '@/features/edit-piece'

/**
 * A short line of what a setup holds, as its sheet lists it: its staves (the piano's where it is
 * shown), then the chord symbols.
 */
export function useSetupSummary(setup: ScoreSetup): string {
  const { t } = useTranslation('songs')
  return [
    ...(setup.melody ? [t('setup.melody')] : []),
    // A lead sheet's piano is left out (ADR 0083), never the only staff.
    ...(setup.piano || !setup.melody ? [t('setup.piano')] : []),
    ...(setup.chordNames ? [t('setup.chordNames')] : []),
  ].join(' · ')
}
