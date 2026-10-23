import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Practice } from '@/features/practice'
import { keyHint } from '@/shared/lib/shortcuts'
import { FloatingBar, FloatingBarButton, FloatingBarPlay } from '@/shared/ui'
import { PLAYER_KEYS } from '../model/player-keys'

/** A step button's size: a little smaller on a phone on its side, where height is short. */
const STEP = 'landscape-phone:size-10'

/**
 * The transport (ADR 0061): the tempo, ‹, Play or Stop (honey), › and the hands in one floating pill,
 * floating along the sheet's foot at every size, a phone on its side too, where the sheet is too short
 * for it upright (ADR 0081, 0085).
 */
export function PlayerDock({
  practice,
  tempo,
  hands,
}: {
  practice: Practice
  /** The tempo's button, at the bar's start. */
  tempo: ReactNode
  /** The hands' button, at its end. */
  hands: ReactNode
}) {
  const { t } = useTranslation('player')
  const { playing } = practice.state
  const action = playing ? t('stop') : t('play')
  return (
    <FloatingBar label={t('transport')} className="gap-1 landscape-phone:gap-0.5">
      {tempo}
      <FloatingBarButton
        label={t('back')}
        title={keyHint(t('back'), PLAYER_KEYS.back)}
        className={STEP}
        onClick={practice.prev}
      >
        <ChevronLeft aria-hidden />
      </FloatingBarButton>
      <FloatingBarPlay
        label={t('play')}
        title={keyHint(action, PLAYER_KEYS.play)}
        playing={playing}
        onClick={playing ? practice.stop : practice.play}
      />
      <FloatingBarButton
        label={t('next')}
        title={keyHint(t('next'), PLAYER_KEYS.next)}
        className={STEP}
        onClick={practice.next}
      >
        <ChevronRight aria-hidden />
      </FloatingBarButton>
      {hands}
    </FloatingBar>
  )
}
