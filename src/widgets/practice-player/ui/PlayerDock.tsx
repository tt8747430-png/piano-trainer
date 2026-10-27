import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Practice } from '@/features/practice'
import { keyHint } from '@/shared/lib/shortcuts'
import { PLAYER_KEYS } from '../model/player-keys'
import { Transport } from './Transport'

/**
 * The Player's transport (ADR 0061, 0108, 0105): the tempo, ‹, Play or Stop (honey), ›, the loop, the
 * Sound and the hands in the pill the score editor's shares (`Transport`, ADR 0115), floating along
 * the sheet's foot at every size, a phone on its side too, where the sheet is too short for it
 * upright (ADR 0115).
 */
export function PlayerDock({
  practice,
  tempo,
  loop,
  sound,
  hands,
}: {
  practice: Practice
  /** The tempo's button, at the bar's start. */
  tempo: ReactNode
  /** The loop's button, after ›, as Chordify's transport carries it beside its tempo. */
  loop: ReactNode
  /** The Sound's button, after the loop (ADR 0105). */
  sound: ReactNode
  /** The hands' button, at its end. */
  hands: ReactNode
}) {
  const { t } = useTranslation('player')
  const { playing } = practice.state
  const action = playing ? t('stop') : t('play')
  return (
    <Transport
      label={t('transport')}
      tempo={tempo}
      playing={playing}
      play={{ label: t('play'), title: keyHint(action, PLAYER_KEYS.play) }}
      back={{ label: t('back'), title: keyHint(t('back'), PLAYER_KEYS.back) }}
      next={{ label: t('next'), title: keyHint(t('next'), PLAYER_KEYS.next) }}
      onPlay={playing ? practice.stop : practice.play}
      onBack={practice.prev}
      onNext={practice.next}
      end={
        <>
          {loop}
          {sound}
          {hands}
        </>
      }
    />
  )
}
