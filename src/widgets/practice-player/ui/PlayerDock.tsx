import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Practice } from '@/features/practice'
import { keyHint } from '@/shared/lib/shortcuts'
import { PLAYER_KEYS } from '../model/player-keys'
import { Transport } from './Transport'

/**
 * The Player's transport (its canvas): three groups in its own row at the foot (R31-P, never over
 * the music): how you practise (Pace: Wait, Interpret or a speed, with the metronome) and the Loop;
 * ‹, the big Play or Stop (honey), › tinted in the middle; the Hands and the Keyboard.
 */
export function PlayerDock({
  practice,
  pace,
  loop,
  hands,
  keyboard,
}: {
  practice: Practice
  pace: ReactNode
  loop: ReactNode
  /** The Hands, where the music has both. */
  hands: ReactNode
  keyboard: ReactNode
}) {
  const { t } = useTranslation('player')
  const { playing } = practice.state
  const action = playing ? t('stop') : t('play')
  return (
    <Transport
      label={t('transport')}
      docked
      start={pace}
      tempo={loop}
      playing={playing}
      play={{ label: t('play'), title: keyHint(action, PLAYER_KEYS.play) }}
      back={{ label: t('previousNote'), title: keyHint(t('previousNote'), PLAYER_KEYS.back) }}
      next={{ label: t('nextNote'), title: keyHint(t('nextNote'), PLAYER_KEYS.next) }}
      onPlay={playing ? practice.stop : practice.play}
      onBack={practice.prev}
      onNext={practice.next}
      end={
        <>
          {hands}
          {keyboard}
        </>
      }
    />
  )
}
