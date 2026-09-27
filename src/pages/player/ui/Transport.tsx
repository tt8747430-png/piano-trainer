import { ChevronLeft, ChevronRight, Play, Square, Volume2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Practice } from '@/features/practice'
import { RoundButton } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** Back, Play or Stop, Next; in Wait mode, Hear these notes (or Stop). */
export function Transport({
  practice,
  hearing,
  onHear,
}: {
  practice: Practice
  /** Hear these notes' sound is playing: the button stops it. */
  hearing: boolean
  onHear: () => void
}) {
  const { t } = useTranslation('player')
  const { mode, playing } = practice.state
  return (
    <div className="flex items-center justify-center gap-4 pb-2 landscape-phone:pb-0">
      <RoundButton label={t('back')} icon={ChevronLeft} onClick={practice.prev} />
      <Button
        size="play"
        className="landscape-phone:size-14"
        aria-label={playing ? t('stop') : t('play')}
        onClick={playing ? practice.stop : practice.play}
      >
        {playing ? <Square aria-hidden /> : <Play aria-hidden />}
      </Button>
      <RoundButton label={t('next')} icon={ChevronRight} onClick={practice.next} />
      {mode === 'wait' ? (
        <Button variant="soft" onClick={onHear}>
          {hearing ? <Square data-icon="inline-start" /> : <Volume2 data-icon="inline-start" />}
          {hearing ? t('stop') : t('hear')}
        </Button>
      ) : null}
    </div>
  )
}
