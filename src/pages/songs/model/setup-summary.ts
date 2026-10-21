import { useTranslation } from 'react-i18next'
import type { ScoreSetup } from '@/features/edit-piece'

/** A short line of what a setup holds: its rows over the piano. */
export function useSetupSummary(setup: ScoreSetup): string {
  const { t } = useTranslation(['songs', 'music'])
  return [
    ...(setup.chordNames ? [t('songs:setup.chordNames')] : []),
    ...(setup.melody ? [t('songs:setup.melody')] : []),
    ...setup.parts.map((part) => t(`music:instrument.${part}`)),
    t('songs:setup.piano'),
  ].join(' · ')
}
