import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { entryTitles } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { notate } from '@/shared/lib/notation'
import { usePlayback } from '@/shared/lib/services'
import { LazyScoreView, PlayLabel, type ShownKeys } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { PatternSample } from '../model/pattern-sample'

/** The sample on the grand staff, each hand on its own, and what it is played over. */
export function PatternStaff({ sample }: { sample: PatternSample }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const score = useMemo(() => notate(sample.music), [sample.music])
  return (
    <figure className="flex flex-col gap-2">
      <div className="max-w-full overflow-x-auto overscroll-x-contain scrollbar-none">
        <LazyScoreView score={score} />
      </div>
      <figcaption className="text-sm text-muted-foreground">
        {sample.piece
          ? t('patterns.over', { piece: entryTitles(sample.piece, locale).primary })
          : t('patterns.overC')}
      </figcaption>
    </figure>
  )
}

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
