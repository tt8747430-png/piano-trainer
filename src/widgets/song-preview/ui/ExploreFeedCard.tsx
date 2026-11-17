import { Link } from '@tanstack/react-router'
import { Heart, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PublicEntry } from '@/shared/api/public-library'
import { cn } from '@/shared/lib'
import { Avatar } from '@/shared/ui'
import { useAuthorName } from '../model/use-author-name'
import { PublicCover } from './PublicCover'
import { ReportDialog } from './ReportDialog'

/** Original and Arrangement each wear their paint as a badge (flat.io's lists). */
const TYPE_BADGE = {
  original: 'bg-paint-sky text-on-paint-sky',
  arrangement: 'bg-paint-lilac text-on-paint-lilac',
} as const

/**
 * A published song or pattern in Explore, as a row (the Explore board's FEEDROW; owner, 2026-11-17,
 * flat.io's search and community lists): its opening chord on its paint, its title and who wrote it;
 * on a laptop, across the row, Original or Arrangement as a badge, who shared it with their face, its
 * saves; on a phone composer · type and who shared it under the title. ··· reports it.
 */
export function ExploreFeedCard({ entry }: { entry: PublicEntry }) {
  const { t } = useTranslation('songs')
  const author = useAuthorName(entry)
  const [reporting, setReporting] = useState(false)
  const type = entry.meta.type === 'other' ? undefined : entry.meta.type
  const what = [entry.meta.composer, type ? t(`public.types.${type}`) : entry.meta.key]
    .filter(Boolean)
    .join(' · ')
  const saves = (
    <>
      <Heart aria-hidden className="size-3.5 shrink-0 lg:size-4" />
      <span aria-hidden className="tabular-nums">
        {entry.saves}
      </span>
      <span className="sr-only">{t('explore.saves', { count: entry.saves })}</span>
    </>
  )
  return (
    <article className="card flex min-w-0 items-center gap-1 pr-1">
      <Link
        to="/songs/public/$itemId"
        params={{ itemId: entry.id }}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-card py-2 pl-2 transition-colors duration-150 ease-out hover:bg-muted/60 focus-visible:-outline-offset-3 lg:gap-4 lg:pl-3"
      >
        <PublicCover entry={entry} tile className="w-16 shrink-0 rounded-xl" />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="line-clamp-2 text-base leading-tight font-semibold text-pretty">
            {entry.title}
          </span>
          <span className="truncate text-sm text-muted-foreground lg:hidden">{what}</span>
          {entry.meta.composer ? (
            <span className="truncate text-sm text-muted-foreground max-lg:hidden">
              {entry.meta.composer}
            </span>
          ) : null}
          <span className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[0.8125rem] text-muted-foreground lg:hidden">
            <Avatar name={entry.authorName || null} picture={entry.authorAvatar} size="feed" />
            <span className="min-w-0 truncate">{author}</span>
            <span aria-hidden>·</span>
            {saves}
          </span>
        </span>
        <span className="w-32 shrink-0 max-lg:hidden">
          {type ? (
            <span
              className={cn(
                'inline-flex h-7 items-center rounded-[8px] px-2.5 text-[0.8125rem] font-semibold',
                TYPE_BADGE[type],
              )}
            >
              {t(`public.types.${type}`)}
            </span>
          ) : null}
        </span>
        <span className="flex w-50 shrink-0 items-center gap-2 text-sm text-muted-foreground max-lg:hidden">
          <Avatar name={entry.authorName || null} picture={entry.authorAvatar} size="feed" />
          <span className="min-w-0 truncate">{author}</span>
        </span>
        <span className="flex w-18 shrink-0 items-center gap-1.5 text-sm text-muted-foreground max-lg:hidden">
          {saves}
        </span>
      </Link>
      <button
        type="button"
        aria-label={t('explore.report', { title: entry.title })}
        title={t('public.report')}
        onClick={() => setReporting(true)}
        className="grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted"
      >
        <MoreHorizontal aria-hidden className="size-5" />
      </button>
      <ReportDialog itemId={entry.id} open={reporting} onOpenChange={setReporting} />
    </article>
  )
}
