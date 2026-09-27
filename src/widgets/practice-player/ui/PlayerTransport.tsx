import { ChevronLeft, ChevronRight, Play, Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Practice } from '@/features/practice'
import { RoundButton } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** ‹ Play or Stop ›: the Player's one honey action between the steps (spec §2.7). */
export function PlayerTransport({ practice }: { practice: Practice }) {
  const { t } = useTranslation('player')
  const { playing } = practice.state
  return (
    <div className="flex items-center justify-center gap-4 landscape-phone:gap-2">
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
    </div>
  )
}
