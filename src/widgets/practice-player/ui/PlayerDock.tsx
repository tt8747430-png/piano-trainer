import { RotateCcw } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Practice } from '@/features/practice'
import { keyHint } from '@/shared/lib/shortcuts'
import { FloatingBarButton } from '@/shared/ui'
import { PLAYER_KEYS } from '../model/player-keys'
import { DOCK_BUTTON } from './dock-sizes'
import { Transport } from './Transport'

/**
 * The Player's transport (ADR 0061, 0108, R31-P): Loop, Restart (to bar 1, or the loop's start), ‹,
 * the big Play or Stop (honey), ›, the tempo and the metronome's click, the score editor's pill
 * (`Transport`, ADR 0115) docked in its own row at the foot, never floating over the music.
 */
export function PlayerDock({
  practice,
  loop,
  tempo,
  sound,
}: {
  practice: Practice
  loop: ReactNode
  tempo: ReactNode
  sound: ReactNode
}) {
  const { t } = useTranslation('player')
  const { playing } = practice.state
  const action = playing ? t('stop') : t('play')
  return (
    <Transport
      label={t('transport')}
      docked
      start={loop}
      tempo={
        <FloatingBarButton
          label={t('restart')}
          title={keyHint(t('restart'), PLAYER_KEYS.start)}
          className={DOCK_BUTTON}
          onClick={practice.restart}
        >
          <RotateCcw aria-hidden />
        </FloatingBarButton>
      }
      playing={playing}
      play={{ label: t('play'), title: keyHint(action, PLAYER_KEYS.play) }}
      back={{ label: t('back'), title: keyHint(t('back'), PLAYER_KEYS.back) }}
      next={{ label: t('next'), title: keyHint(t('next'), PLAYER_KEYS.next) }}
      onPlay={playing ? practice.stop : practice.play}
      onBack={practice.prev}
      onNext={practice.next}
      end={
        <>
          {tempo}
          {sound}
        </>
      }
    />
  )
}
