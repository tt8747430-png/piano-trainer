import { useTranslation } from 'react-i18next'
import { PracticeSettingsScreen } from './PracticeSettingsScreen'

/**
 * Chords', Scales and keys' and Intervals' Settings (A24). Their own preferences join these pages as
 * each explorer's choices move off the page (A20–A22); until then each holds the rows to the
 * on-screen piano and a connected piano.
 */
export function ChordsSettingsPage() {
  const { t } = useTranslation('practice')
  return <PracticeSettingsScreen title={t('pages.chords')} />
}

export function ScalesSettingsPage() {
  const { t } = useTranslation('practice')
  return <PracticeSettingsScreen title={t('pages.scales')} />
}

export function IntervalsSettingsPage() {
  const { t } = useTranslation('practice')
  return <PracticeSettingsScreen title={t('pages.intervals')} />
}
