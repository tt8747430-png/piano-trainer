import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Take } from '@/entities/take'
import { clockTime } from '../model/clock-time'
import { useTakeTitle } from '../model/use-take-title'

/** A take's name (or `title` in its place: a link to its page), and under it its length and tempo. */
export function TakeName({ take, title }: { take: Take; title?: ReactNode }) {
  const { t } = useTranslation('editor')
  const name = useTakeTitle(take)
  return (
    <p className="flex flex-col">
      <span className="font-semibold">{title ?? name}</span>
      <span className="text-sm text-muted-foreground tabular-nums">
        {t('recorder.detail', { length: clockTime(take.length), tempo: take.tempo })}
      </span>
    </p>
  )
}
