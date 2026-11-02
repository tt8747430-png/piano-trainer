import { Link } from '@tanstack/react-router'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { publicFace } from '@/features/publish'
import type { PublicEntry } from '@/shared/api/public-library'
import { useLocale } from '@/shared/i18n'
import { TileMark } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Saves } from './PublicResults'

/** The most a shelf holds: its See all shows the rest. */
const SHELF = 10

/**
 * One shelf of the Public library (Noji's Popular), its name and See all over a row of cards across,
 * swiped sideways: each card its tile, title, who published it, what it is and how often it is
 * saved, a link to its page.
 */
export function PublicShelf({
  title,
  entries,
  onSeeAll,
}: {
  title: string
  entries: readonly PublicEntry[]
  onSeeAll: () => void
}) {
  const { t } = useTranslation('songs')
  const id = useId()
  return (
    <section aria-labelledby={id} className="flex min-w-0 flex-col gap-2">
      <div className="flex min-h-9 items-center justify-between gap-2 pl-3">
        <h2 id={id} className="text-xl">
          {title}
        </h2>
        <Button variant="ghost" onClick={onSeeAll}>
          {t('public.seeAll')}
        </Button>
      </div>
      <ul
        aria-labelledby={id}
        className="fade-scroll-x relative -mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto overscroll-x-contain px-4 pb-1 scrollbar-none"
      >
        {entries.slice(0, SHELF).map((entry) => (
          <ShelfCard key={entry.id} entry={entry} />
        ))}
      </ul>
    </section>
  )
}

/** A published item as a shelf's card. */
function ShelfCard({ entry }: { entry: PublicEntry }) {
  const locale = useLocale()
  const face = publicFace(entry, locale)
  return (
    <li className="w-40 shrink-0 snap-start">
      <Link
        to="/songs/public/$itemId"
        params={{ itemId: entry.id }}
        className="card flex h-full flex-col gap-2 p-3 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3"
      >
        <TileMark icon={face.icon} paint={face.paint} />
        <span className="line-clamp-2 font-display text-lg leading-tight font-semibold text-pretty break-words">
          {face.title}
        </span>
        <span className="mt-auto flex flex-col gap-0.5 text-sm text-muted-foreground">
          <span className="truncate">{face.detail}</span>
          {face.count ? <span className="truncate">{face.count}</span> : null}
        </span>
        {entry.saves > 0 ? <Saves count={entry.saves} /> : null}
      </Link>
    </li>
  )
}
