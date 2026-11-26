import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SettingsScreen } from '@/widgets/settings-screen'
import { GUIDE } from '../model/guide'
import { GuideSection } from './GuideSection'

/**
 * The User guide (ADR 0052; the board's P_GUIDE), reached from Settings' Support: a part for each
 * thing a learner does (songs, the Player, lessons, the editor, MIDI, the Metronome), one open at a
 * time, the first to begin with; opening another closes it.
 */
export function HowToUsePage() {
  const { t } = useTranslation('settings')
  const [open, setOpen] = useState<string | null>(GUIDE[0].id)
  return (
    <SettingsScreen title={t('howToUse.title')}>
      {GUIDE.map((part) => (
        <GuideSection
          key={part.id}
          part={part}
          open={open === part.id}
          onToggle={() => setOpen(open === part.id ? null : part.id)}
        />
      ))}
    </SettingsScreen>
  )
}
