import { Link } from '@tanstack/react-router'
import { AudioWaveform, Bookmark, Star } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { itemPaint } from '@/features/publish'
import { RATED_MIN, type PublicEntry } from '@/shared/api/public-library'
import { cn } from '@/shared/lib'
import { ChordText, PAINT } from '@/shared/ui'
import { openingBars } from '../model/opening-bars'
import { useAuthorName } from '../model/use-author-name'

/** An item's stars, its average to one decimal, said in words; none under `RATED_MIN` ratings. */
export function StarsAverage({ rating }: { rating: PublicEntry['rating'] }) {
  const { t, i18n } = useTranslation('songs')
  if (!rating || rating.count < RATED_MIN) return null
  const average = rating.average.toLocaleString(i18n.language, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
  return (
    <span className="flex shrink-0 items-center gap-1 tabular-nums">
      <Star aria-hidden className="size-4 fill-current text-attention" />
      <span aria-hidden>{average}</span>
      <span className="sr-only">{t('explore.rating', { average })}</span>
    </span>
  )
}

/** How often an item is saved: a bookmark and its number, said in words. */
export function SavesCount({ count }: { count: number }) {
  const { t } = useTranslation('songs')
  return (
    <span className="flex shrink-0 items-center gap-1 tabular-nums">
      <Bookmark aria-hidden className="size-4" />
      <span aria-hidden>{count}</span>
      <span className="sr-only">{t('explore.saves', { count })}</span>
    </span>
  )
}

/**
 * A song's first bars drawn small, as its chart is (a box a bar, its chords' symbols), on its own
 * paint; a pattern, or a song whose line does not read, its tile's picture there instead.
 */
function Opening({ entry }: { entry: PublicEntry }) {
  const bars = useMemo(() => openingBars(entry), [entry])
  const paint = PAINT[itemPaint(entry.id)]
  return (
    <span
      aria-hidden
      className={cn('flex h-16 items-center rounded-control px-2', paint.fill, paint.ink)}
    >
      {bars ? (
        <span className="grid w-full grid-cols-4 divide-x divide-current/25 border-x border-current/25">
          {bars.map((chords, i) => (
            <span
              key={i}
              className="flex min-w-0 justify-center gap-1 overflow-hidden px-1 text-sm"
            >
              {chords.map((symbol, j) => (
                <ChordText key={j} symbol={symbol} className="[&_*]:text-current" />
              ))}
            </span>
          ))}
        </span>
      ) : (
        <AudioWaveform className="mx-auto size-6" />
      )}
    </span>
  )
}

/**
 * A published song or pattern as Explore's card (Noji's library card): its first bars drawn small,
 * its title, who published it (D12), its stars where enough rated it, and how often it is saved; a
 * link to its page.
 */
export function ExploreCard({ entry, className }: { entry: PublicEntry; className?: string }) {
  const author = useAuthorName(entry)
  return (
    <Link
      to="/songs/public/$itemId"
      params={{ itemId: entry.id }}
      className={cn(
        'card relative flex h-full flex-col gap-2 p-2.5 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3',
        className,
      )}
    >
      <Opening entry={entry} />
      <span className="line-clamp-2 px-0.5 font-display text-lg leading-tight font-semibold text-pretty break-words">
        {entry.title}
      </span>
      <span className="mt-auto flex flex-col gap-1 px-0.5 text-sm text-muted-foreground">
        <span className="truncate">{author}</span>
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-semibold">
          <StarsAverage rating={entry.rating} />
          <SavesCount count={entry.saves} />
        </span>
      </span>
    </Link>
  )
}
