import { Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Sound } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { Button } from '@/shared/ui/primitives/button'

/** Play up and down, its card's one action, turning into Stop while it sounds. */
export function PlayUpDown({ sounds }: { sounds: readonly Sound[] }) {
  const { t } = useTranslation(['learn', 'common'])
  const playback = usePlayback<'up-down'>()
  return (
    <Button size="pill" onClick={() => playback.toggle('up-down', sounds)}>
      {playback.playing === 'up-down' ? (
        <>
          <Square data-icon="inline-start" />
          {t('common:stop')}
        </>
      ) : (
        t('learn:playUpDown')
      )}
    </Button>
  )
}
