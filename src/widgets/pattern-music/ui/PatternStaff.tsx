import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { entryTitles } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { notate } from '@/shared/lib/notation'
import { LazyScoreView } from '@/shared/ui'
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
