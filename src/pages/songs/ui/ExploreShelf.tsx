import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useSetSearch } from '@/shared/lib'
import { SectionHead, SeeAll } from '@/shared/ui'
import { PublicCover, useAuthorName } from '@/widgets/song-preview'
import type { PublicEntry } from '@/shared/api/public-library'
import type { SongsHome } from '../model/explore-view'
import { useExploreBrowse } from '../model/use-explore-browse'
import { FRESH } from './songs-fresh'

/** How many of the newest Explore shows on Songs: a shelf's worth, the rest behind See all. */
const SHOWN = 6

function ShelfCard({ entry }: { entry: PublicEntry }) {
  const author = useAuthorName(entry)
  return (
    <Link
      to="/songs/public/$itemId"
      params={{ itemId: entry.id }}
      className="flex flex-col gap-1.5 rounded-[10px] text-foreground focus-visible:outline-offset-2"
    >
      <PublicCover
        entry={entry}
        className="rounded-[10px] shadow-[0_0_0_1px_var(--color-hairline)]"
      />
      <span className="line-clamp-2 text-[0.9375rem] leading-tight font-semibold">
        {entry.title}
      </span>
      <span className="truncate text-[0.8125rem] text-muted-foreground">{author}</span>
    </Link>
  )
}

/**
 * Explore on Songs (the Songs board's EXSHELF): what learners shared, the newest first, as Explore
 * draws them, a shelf that scrolls sideways on a phone and six across on a laptop; See all opens
 * Explore. While it is asked, offline or empty, the shelf stays out and See all still leads there.
 */
export function ExploreShelf() {
  const { t } = useTranslation('songs')
  const show = useSetSearch<SongsHome>()
  const { browse } = useExploreBrowse({ cat: 'all', sort: 'new', q: '' })
  const shown = browse.kind === 'found' ? browse.entries.slice(0, SHOWN) : []
  return (
    <section aria-labelledby="songs-explore" className="flex flex-col gap-3 lg:gap-4">
      <SectionHead id="songs-explore" title={t('explore.views.explore')}>
        <SeeAll label={t('explore.seeAll')} onClick={() => show({ ...FRESH, view: 'explore' })} />
      </SectionHead>
      {shown.length > 0 ? (
        <ul className="-mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-3 overflow-x-auto px-gutter pb-1 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-5 lg:overflow-visible lg:px-0">
          {shown.map((entry) => (
            <li key={entry.id} className="w-33 flex-none snap-start lg:w-auto lg:min-w-0">
              <ShelfCard entry={entry} />
            </li>
          ))}
        </ul>
      ) : (
        <button
          type="button"
          onClick={() => show({ ...FRESH, view: 'explore' })}
          className="card flex min-h-14 items-center px-4 text-left text-base font-semibold transition-colors hover:bg-muted lg:w-[calc((100%-1.5rem)/3)]"
        >
          {t('explore.openLine')}
        </button>
      )}
    </section>
  )
}
