import { Link } from '@tanstack/react-router'
import { AudioWaveform, Heart, MoreHorizontal, Play, Star } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { itemPaint } from '@/features/publish'
import { RATED_MIN, type PublicEntry } from '@/shared/api/public-library'
import { cn } from '@/shared/lib'
import { Avatar, ChordText, PAINT } from '@/shared/ui'
import { openingBars } from '../model/opening-bars'
import { useAuthorName } from '../model/use-author-name'
import { ReportDialog } from './ReportDialog'

/** A figure of the card's foot (R72's _STAT): its icon and number on a soft chip, said in words. */
function Stat({ icon: Icon, value, said }: { icon: typeof Star; value: string; said: string }) {
  return (
    <span className="flex h-9 items-center gap-2 rounded-xl bg-muted px-3 text-sm font-semibold tabular-nums">
      <Icon aria-hidden className="size-4.5 text-muted-foreground" />
      <span aria-hidden>{value}</span>
      <span className="sr-only">{said}</span>
    </span>
  )
}

/** Original or Arrangement at the card's foot (R72), on the board's sky and lilac. */
const TYPE_PAINT = { original: PAINT.sky, arrangement: PAINT.lilac } as const

/**
 * A published song or pattern in Explore's feed (the R72 board's FEEDCARD, Flat's community): who
 * shared it at its head, with ··· to report it; its picture (its first chord on its paint, Play at its
 * corner), its title and who wrote it with its key, a link to its page; at its foot how often it is
 * saved, its stars where enough rated it, and whether it is an Original or an Arrangement.
 */
export function ExploreFeedCard({ entry }: { entry: PublicEntry }) {
  const { t, i18n } = useTranslation('songs')
  const author = useAuthorName(entry)
  const [reporting, setReporting] = useState(false)
  const paint = PAINT[itemPaint(entry.id)]
  const first = openingBars(entry)?.[0]?.[0]
  const rated = entry.rating && entry.rating.count >= RATED_MIN ? entry.rating : null
  const average = rated?.average.toLocaleString(i18n.language, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
  const what = [entry.meta.composer, entry.meta.key].filter(Boolean).join(' · ')
  const type = entry.meta.type === 'other' ? undefined : entry.meta.type
  return (
    <article className="card flex flex-col">
      <div className="flex h-14 items-center gap-3 pr-1 pl-3.5 shadow-[inset_0_-1px_0_var(--color-hairline)]">
        <Avatar name={entry.authorName || null} picture={entry.authorAvatar} size="feed" />
        <span className="min-w-0 flex-1 truncate text-[0.9375rem] font-semibold">{author}</span>
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
      <Link
        to="/songs/public/$itemId"
        params={{ itemId: entry.id }}
        className="flex items-center gap-4 p-4 shadow-[inset_0_-1px_0_var(--color-hairline)] transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3"
      >
        <span
          aria-hidden
          className={cn(
            'relative grid size-16 shrink-0 place-items-center rounded-xl text-xl font-semibold shadow-[inset_0_0_0_1px_--alpha(var(--color-foreground)/10%)]',
            paint.fill,
            paint.ink,
          )}
        >
          {first ? (
            <ChordText symbol={first} className="[&_*]:text-current" />
          ) : (
            <AudioWaveform className="size-6" />
          )}
          <span className="absolute -right-1.5 -bottom-1.5 grid size-7.5 place-items-center rounded-full bg-primary text-primary-foreground ring-2 ring-card">
            <Play className="size-3.5 translate-x-px fill-current" />
          </span>
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.75">
          <span className="line-clamp-2 text-[1.0625rem] leading-tight font-semibold text-pretty">
            {entry.title}
          </span>
          {what ? <span className="truncate text-sm text-muted-foreground">{what}</span> : null}
        </span>
      </Link>
      <div className="flex items-center gap-2 px-4 py-3">
        <Stat
          icon={Heart}
          value={String(entry.saves)}
          said={t('explore.saves', { count: entry.saves })}
        />
        {rated && average ? (
          <Stat icon={Star} value={average} said={t('explore.rating', { average })} />
        ) : null}
        <span className="flex-1" />
        {type ? (
          <span
            className={cn(
              'flex h-7.5 items-center rounded-pill px-3 text-[0.8125rem] font-semibold',
              TYPE_PAINT[type].fill,
              TYPE_PAINT[type].ink,
            )}
          >
            {t(`public.types.${type}`)}
          </span>
        ) : null}
      </div>
      <ReportDialog itemId={entry.id} open={reporting} onOpenChange={setReporting} />
    </article>
  )
}
