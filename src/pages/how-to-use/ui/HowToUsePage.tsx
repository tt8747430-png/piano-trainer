import { useTranslation } from 'react-i18next'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { GUIDE } from '../model/guide'
import { GuideSection } from './GuideSection'

/**
 * How to use (ADR 0052), reached from Settings' Help: a short guide in plain steps, a part for each
 * thing a learner does (songs, the Player, lessons, the editor, MIDI, the Metronome), each folding,
 * two columns from a laptop's width as Settings has.
 */
export function HowToUsePage() {
  const { t } = useTranslation('settings')
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('howToUse.title')}
        back={<BackButton fallback={{ to: '/settings/help' }} />}
      />
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
        {GUIDE.map((part) => (
          <GuideSection key={part.id} part={part} />
        ))}
      </div>
    </div>
  )
}
