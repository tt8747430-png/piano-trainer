import { useTranslation } from 'react-i18next'
import type { ScoreSetup } from '@/features/edit-piece'

/** A short line of what a setup holds: its rows, top down, the piano's where it is shown. */
export function useSetupSummary(setup: ScoreSetup): string {
  const { t } = useTranslation('songs')
  return [
    ...(setup.chordNames ? [t('setup.chordNames')] : []),
    ...(setup.melody ? [t('setup.melody')] : []),
    // A lead sheet's piano is left out (ADR 0083), never the only staff.
    ...(setup.piano || !setup.melody ? [t('setup.piano')] : []),
  ].join(' · ')
}
