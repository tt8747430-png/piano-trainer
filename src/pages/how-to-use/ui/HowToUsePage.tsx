import { useTranslation } from 'react-i18next'
import { SettingsScreen } from '@/widgets/settings-screen'
import { GUIDE } from '../model/guide'
import { GuideSection } from './GuideSection'

/**
 * How to use (ADR 0052), reached from Settings' Help: a short guide in plain steps, a part for each
 * thing a learner does (songs, the Player, lessons, the editor, MIDI, the Metronome), each folding,
 * one column in Settings' page (R20).
 */
export function HowToUsePage() {
  const { t } = useTranslation('settings')
  return (
    <SettingsScreen title={t('howToUse.title')}>
      {GUIDE.map((part) => (
        <GuideSection key={part.id} part={part} />
      ))}
    </SettingsScreen>
  )
}
