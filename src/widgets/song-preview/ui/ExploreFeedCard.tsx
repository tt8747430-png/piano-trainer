import { Link } from '@tanstack/react-router'
import { Heart, MoreHorizontal } from 'lucide-react'
import { useState, type ReactNode } from 'react'
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
 * The laptop table's columns (the ExploreLaptop board, All songs' grid): Title, Composer, Type,
 * Shared by, Saves, ···.
 */
export const EXPLORE_COLUMNS =
  'grid grid-cols-[minmax(12.5rem,2.2fr)_minmax(0,1.4fr)_8rem_minmax(0,1.2fr)_4.5rem_2.75rem] items-center gap-4 pr-2 pl-3'

/**
 * A published song or pattern in Explore, as a row (the Explore boards' FEEDROW; 2026-11-17 and
 * 2026-11-18: "a list, not a card each"): its opening chord on its paint, its title. On a phone a row
 * of one card, composer · type and who shared it with its saves under the title; on a laptop a row of
 * All songs' table (`table`), 60 tall on a hairline, the tile 40: Composer, Original or Arrangement
 * as a badge, who shared it with their face, its saves. ··· reports it.
 */
export function ExploreFeedCard({ entry, table = false }: { entry: PublicEntry; table?: boolean }) {
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
  const more = (
    <>
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
    </>
  )
  const link = (className: string, children: ReactNode) => (
    <Link
      to="/songs/public/$itemId"
      params={{ itemId: entry.id }}
      className={cn(
        'flex min-w-0 items-center text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
        className,
      )}
    >
      {children}
    </Link>
  )
  if (table)
    return (
      <div
        role="row"
        className={`${EXPLORE_COLUMNS} min-h-15 border-b border-border has-[a:hover]:bg-muted/60`}
      >
        <span role="cell" className="min-w-0">
          {link(
            'gap-3.5 rounded-control',
            <>
              <PublicCover entry={entry} tile cell className="w-10 shrink-0 rounded-[9px]" />
              <span className="truncate text-subhead font-semibold">{entry.title}</span>
            </>,
          )}
        </span>
        <span role="cell" className="truncate text-subhead text-muted-foreground">
          {entry.meta.composer}
        </span>
        <span role="cell">
          {type ? (
            <span
              className={cn(
                'inline-flex h-7 items-center rounded-tile px-2.5 text-footnote font-semibold',
                TYPE_BADGE[type],
              )}
            >
              {t(`public.types.${type}`)}
            </span>
          ) : null}
        </span>
        <span
          role="cell"
          className="flex min-w-0 items-center gap-2 text-subhead text-muted-foreground"
        >
          <Avatar name={entry.authorName || null} picture={entry.authorAvatar} size="feed" />
          <span className="min-w-0 truncate">{author}</span>
        </span>
        <span
          role="cell"
          className="flex items-center gap-1.5 text-subhead text-muted-foreground"
        >
          {saves}
        </span>
        <span role="cell" className="flex justify-end">
          {more}
        </span>
      </div>
    )
  return (
    <li className="flex min-w-0 items-center gap-1 pr-1">
      {link(
        'min-h-20 flex-1 gap-4 py-3 pl-3 transition-colors duration-150 ease-out hover:bg-muted/60',
        <>
          <PublicCover entry={entry} tile className="w-14 shrink-0 rounded-xl" />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="line-clamp-2 text-base leading-tight font-semibold text-pretty">
              {entry.title}
            </span>
            <span className="truncate text-sm text-muted-foreground">{what}</span>
            <span className="mt-0.5 flex min-w-0 items-center gap-1.5 text-footnote text-muted-foreground">
              <Avatar name={entry.authorName || null} picture={entry.authorAvatar} size="feed" />
              <span className="min-w-0 truncate">{author}</span>
              <span aria-hidden>·</span>
              {saves}
            </span>
          </span>
        </>,
      )}
      {more}
    </li>
  )
}
