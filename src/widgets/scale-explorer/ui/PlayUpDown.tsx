import { useTranslation } from 'react-i18next'
import type { Sound } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { PlayLabel, usePlayKey } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** Play up and down, its card's one action, turning into Stop while it sounds; Enter is its key. */
export function PlayUpDown({ sounds }: { sounds: readonly Sound[] }) {
  const { t } = useTranslation('learn')
  const playback = usePlayback<'up-down'>()
  const play = () => playback.toggle('up-down', () => sounds)
  usePlayKey(play)
  return (
    <Button size="pill" onClick={play}>
      <PlayLabel playing={playback.playing === 'up-down'}>{t('playUpDown')}</PlayLabel>
    </Button>
  )
}
