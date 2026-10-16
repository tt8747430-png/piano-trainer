import { useTranslation } from 'react-i18next'
import type { Sound } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { FloatingActions, PlayFab, usePlayKey } from '@/shared/ui'

/**
 * Play up and down, its view's one action, floating in the thumb's reach and turning into Stop while it
 * sounds; Enter is its key.
 */
export function PlayUpDown({ sounds }: { sounds: readonly Sound[] }) {
  const { t } = useTranslation('practice')
  const playback = usePlayback<'up-down'>()
  const play = () => playback.toggle('up-down', () => sounds)
  usePlayKey(play)
  return (
    <FloatingActions>
      <PlayFab
        label={t('scales.playUpDown')}
        playing={playback.playing === 'up-down'}
        onClick={play}
      />
    </FloatingActions>
  )
}
