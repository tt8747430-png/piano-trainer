import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import type { Sound } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import {
  FloatingActions,
  FloatingBar,
  FloatingBarButton,
  FloatingBarPlay,
  usePlayKey,
} from '@/shared/ui'

/**
 * The scale's floating bar (its board): Practise this scale, a grey pill into the Player where the
 * view has it, and Play up and down, the honey circle at the bar's end, Stop while it sounds; Enter is
 * its key.
 */
export function PlayUpDown({
  sounds,
  practise,
}: {
  sounds: readonly Sound[]
  /** A link into the Player with this scale, where the view has one. */
  practise?: ReactElement | undefined
}) {
  const { t } = useTranslation('practice')
  const playback = usePlayback<'up-down'>()
  const play = () => playback.toggle('up-down', () => sounds)
  usePlayKey(play)
  return (
    <FloatingActions>
      <FloatingBar label={t('transport')}>
        {practise ? (
          <FloatingBarButton named label={t('scales.practise')} render={practise}>
            {null}
          </FloatingBarButton>
        ) : null}
        <FloatingBarPlay
          label={t('scales.playUpDown')}
          playing={playback.playing === 'up-down'}
          onClick={play}
        />
      </FloatingBar>
    </FloatingActions>
  )
}
