import { Link } from '@tanstack/react-router'
import { AudioWaveform, Bookmark, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { itemPaint } from '@/features/publish'
import { RATED_MIN, type PublicEntry } from '@/shared/api/public-library'
import { cn } from '@/shared/lib'
import { Avatar, ChordText, PAINT } from '@/shared/ui'
import { openingBars } from '../model/opening-bars'
import { useAuthorName } from '../model/use-author-name'

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

/**
 * A published song or pattern in Explore's feed (the R72 board's FEEDCARD, Flat's community): who
 * shared it at its head; its picture (its first chord on its paint), its title and what it is, a link
 * to its page; at its foot how often it is saved, its stars where enough rated it, and its category.
 */
export function ExploreFeedCard({ entry }: { entry: PublicEntry }) {
  const { t, i18n } = useTranslation('songs')
  const author = useAuthorName(entry)
  const paint = PAINT[itemPaint(entry.id)]
  const first = openingBars(entry)?.[0]?.[0]
  const rated = entry.rating && entry.rating.count >= RATED_MIN ? entry.rating : null
  const average = rated?.average.toLocaleString(i18n.language, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
  const what = [entry.meta.key, entry.meta.meter].filter(Boolean).join(' · ')
  return (
    <article className="card flex flex-col">
      <div className="flex h-14 items-center gap-3 px-3.5 shadow-[inset_0_-1px_0_var(--color-hairline)]">
        <Avatar name={entry.authorName || null} picture={entry.authorAvatar} size="feed" />
        <span className="min-w-0 flex-1 truncate text-[0.9375rem] font-semibold">{author}</span>
      </div>
      <Link
        to="/songs/public/$itemId"
        params={{ itemId: entry.id }}
        className="flex items-center gap-4 p-4 shadow-[inset_0_-1px_0_var(--color-hairline)] transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3"
      >
        <span
          aria-hidden
          className={cn(
            'grid size-16 shrink-0 place-items-center rounded-xl text-xl font-semibold shadow-[inset_0_0_0_1px_--alpha(var(--color-foreground)/10%)]',
            paint.fill,
            paint.ink,
          )}
        >
          {first ? (
            <ChordText symbol={first} className="[&_*]:text-current" />
          ) : (
            <AudioWaveform className="size-6" />
          )}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="line-clamp-2 text-[1.0625rem] leading-tight font-semibold text-pretty">
            {entry.title}
          </span>
          {what ? <span className="truncate text-sm text-muted-foreground">{what}</span> : null}
        </span>
      </Link>
      <div className="flex items-center gap-2 px-4 py-3">
        <Stat
          icon={Bookmark}
          value={String(entry.saves)}
          said={t('explore.saves', { count: entry.saves })}
        />
        {rated && average ? (
          <Stat icon={Star} value={average} said={t('explore.rating', { average })} />
        ) : null}
        <span className="flex-1" />
        {entry.category ? (
          <span className="flex h-7.5 items-center rounded-pill bg-muted px-3 text-[0.8125rem] font-semibold">
            {t(`explore.categories.${entry.category}`)}
          </span>
        ) : null}
      </div>
    </article>
  )
}
