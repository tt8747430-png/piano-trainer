import { useTranslation } from 'react-i18next'
import { usePlayback } from '@/shared/lib/services'
import { PlayLabel, type ShownKeys } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { PatternSample } from '../model/pattern-sample'

/** Play for the sample, turning into Stop while it sounds; it shows its keys on the page's keyboard. */
export function PatternPlay({
  sample,
  onShow,
  variant,
}: {
  sample: PatternSample
  onShow: (shown: ShownKeys) => void
  /** The page's one action (the pattern's page), or soft beside another (the editor). */
  variant: 'default' | 'soft'
}) {
  const { t } = useTranslation('learn')
  const playback = usePlayback<'sample'>()
  return (
    <Button
      variant={variant}
      className="self-start"
      onClick={() =>
        playback.toggle('sample', () => {
          onShow(sample.shown)
          return sample.sounds
        })
      }
    >
      <PlayLabel playing={playback.playing === 'sample'}>{t('patterns.play')}</PlayLabel>
    </Button>
  )
}
