import { Link } from '@tanstack/react-router'
import { Heart, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PublicEntry } from '@/shared/api/public-library'
import { Avatar } from '@/shared/ui'
import { useAuthorName } from '../model/use-author-name'
import { PublicCover } from './PublicCover'
import { ReportDialog } from './ReportDialog'

/**
 * A published song or pattern in Explore (the Explore board's FEEDCARD; Flat's community, MuseScore's
 * grid): on a laptop its opening chords large on its paint over its title, who wrote it and whether
 * it is an Original or an Arrangement; on a phone one row, its first chord as the tile. Its foot says
 * who shared it and how often it is saved, with ··· to report it, never laid over the picture.
 */
export function ExploreFeedCard({ entry }: { entry: PublicEntry }) {
  const { t } = useTranslation('songs')
  const author = useAuthorName(entry)
  const [reporting, setReporting] = useState(false)
  const type = entry.meta.type === 'other' ? undefined : entry.meta.type
  const what = [entry.meta.composer, type ? t(`public.types.${type}`) : entry.meta.key]
    .filter(Boolean)
    .join(' · ')
  const foot = (
    <span className="flex min-w-0 items-center gap-2 text-[0.8125rem] text-muted-foreground">
      <Avatar name={entry.authorName || null} picture={entry.authorAvatar} size="feed" />
      <span className="min-w-0 truncate">{author}</span>
      <span aria-hidden>·</span>
      <Heart aria-hidden className="size-3.5 shrink-0" />
      <span aria-hidden className="tabular-nums">
        {entry.saves}
      </span>
      <span className="sr-only">{t('explore.saves', { count: entry.saves })}</span>
    </span>
  )
  return (
    <article className="card flex min-w-0 items-center overflow-hidden lg:flex-col lg:items-stretch">
      <Link
        to="/songs/public/$itemId"
        params={{ itemId: entry.id }}
        className="flex min-w-0 flex-1 items-center gap-3.5 p-3 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3 lg:flex-col lg:items-stretch lg:gap-0 lg:p-0"
      >
        <PublicCover entry={entry} tile className="w-16 shrink-0 rounded-xl lg:hidden" />
        <PublicCover entry={entry} className="max-lg:hidden" />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5 lg:px-4 lg:pt-3">
          <span className="line-clamp-2 text-base leading-tight font-semibold text-pretty">
            {entry.title}
          </span>
          {what ? <span className="truncate text-sm text-muted-foreground">{what}</span> : null}
          <span className="mt-1 lg:hidden">{foot}</span>
        </span>
      </Link>
      <div className="flex items-center lg:gap-2 lg:py-2 lg:pr-1 lg:pl-4">
        <span className="min-w-0 flex-1 max-lg:hidden">{foot}</span>
        <button
          type="button"
          aria-label={t('explore.report', { title: entry.title })}
          title={t('public.report')}
          onClick={() => setReporting(true)}
          className="grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted"
        >
          <MoreHorizontal aria-hidden className="size-5" />
        </button>
      </div>
      <ReportDialog itemId={entry.id} open={reporting} onOpenChange={setReporting} />
    </article>
  )
}
