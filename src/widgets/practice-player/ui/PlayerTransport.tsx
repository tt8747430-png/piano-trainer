import { ChevronLeft, ChevronRight, Play, Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Practice } from '@/features/practice'
import { keyHint } from '@/shared/lib/shortcuts'
import { RoundButton } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { PLAYER_KEYS } from '../model/player-keys'

/** ‹ Play or Stop ›: the Player's one honey action between the steps (spec §2.7). */
export function PlayerTransport({ practice }: { practice: Practice }) {
  const { t } = useTranslation('player')
  const { playing } = practice.state
  const action = playing ? t('stop') : t('play')
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 landscape-phone:gap-2">
      <RoundButton
        label={t('back')}
        title={keyHint(t('back'), PLAYER_KEYS.back)}
        icon={ChevronLeft}
        onClick={practice.prev}
      />
      <Button
        size="play"
        className="landscape-phone:size-14"
        aria-label={action}
        title={keyHint(action, PLAYER_KEYS.play)}
        onClick={playing ? practice.stop : practice.play}
      >
        {playing ? <Square aria-hidden /> : <Play aria-hidden />}
      </Button>
      <RoundButton
        label={t('next')}
        title={keyHint(t('next'), PLAYER_KEYS.next)}
        icon={ChevronRight}
        onClick={practice.next}
      />
    </div>
  )
}
