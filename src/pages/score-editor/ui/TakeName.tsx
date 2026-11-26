import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Take } from '@/entities/take'
import { clockTime } from '../model/clock-time'
import { useTakeMade, useTakeTitle } from '../model/use-take-title'

/**
 * A take's name (or `title` in its place: a link to its page) at 16/600, and under it, in soft ink, its
 * length and tempo, after when it was made where the learner named it (the Takes board's two lines:
 * "Take 3" over "9 November, 18:41 · 0:41 · 92 BPM"; a take still named by its time says it once).
 */
export function TakeName({ take, title }: { take: Take; title?: ReactNode }) {
  const { t } = useTranslation(['editor', 'music'])
  const name = useTakeTitle(take)
  const made = useTakeMade(take)
  const detail = t('recorder.detail', {
    length: clockTime(take.length),
    bpm: t('music:bpm', { tempo: take.tempo }),
  })
  return (
    <p className="flex min-w-0 flex-col">
      <span className="truncate font-semibold">{title ?? name}</span>
      <span className="line-clamp-2 text-sm text-pretty text-muted-foreground tabular-nums">
        {take.name === undefined ? detail : `${made} · ${detail}`}
      </span>
    </p>
  )
}
