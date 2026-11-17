import { useTranslation } from 'react-i18next'
import { cn, useSetSearch } from '@/shared/lib'
import {
  EXPLORE_CATEGORIES,
  EXPLORE_KINDS,
  EXPLORE_TAGS,
  type ExploreCategory,
  type SongsHome,
} from '../model/explore-view'
import { useExploreBrowse, type Browse } from '../model/use-explore-browse'

/** How many of the songs found each kind holds: all of them, the songs tagged so, the patterns. */
function countsOf(songs: Browse, patterns: Browse): Partial<Record<ExploreCategory, number>> {
  if (songs.kind !== 'found') return {}
  const tagged = (tag: string) =>
    songs.entries.filter((entry) =>
      entry.meta.tags?.some((each) => each.toLowerCase() === tag.toLowerCase()),
    ).length
  return {
    all: songs.entries.length,
    classical: tagged(EXPLORE_TAGS.classical),
    folk: tagged(EXPLORE_TAGS.folk),
    pop: tagged(EXPLORE_TAGS.pop),
    hymn: tagged(EXPLORE_TAGS.hymn),
    study: tagged(EXPLORE_TAGS.study),
    patterns: patterns.kind === 'found' ? patterns.entries.length : undefined,
  }
}

/**
 * Explore's pane on a laptop (the ExploreLaptop board's EXPANE; flat.io's search Filters): Songs and
 * People stacked, the one shown filled in ink; under Songs, the Kinds, each with how many it holds for
 * what is searched, the chosen on its sand wash. One person's songs hide the Kinds: the chip over the
 * list takes them off.
 */
export function ExplorePane({ home }: { home: SongsHome }) {
  const { t } = useTranslation('songs')
  const show = useSetSearch<SongsHome>()
  const songs = home.kind !== 'people'
  const kinds = songs && !home.by
  const all = useExploreBrowse(kinds ? { cat: 'all', sort: 'new', q: home.q } : null)
  const patterns = useExploreBrowse(kinds ? { cat: 'patterns', sort: 'new', q: home.q } : null)
  const counts = countsOf(all.browse, patterns.browse)
  return (
    <aside
      aria-label={t('explore.kinds.label')}
      className="card sticky top-4 flex flex-col gap-2 self-start px-3 py-4"
    >
      {EXPLORE_KINDS.map((kind) => {
        const on = home.kind === kind
        return (
          <button
            key={kind}
            type="button"
            aria-pressed={on}
            onClick={() => show({ kind, by: '' })}
            className={cn(
              'h-11 rounded-pill text-[0.9375rem] font-semibold transition-colors duration-150 ease-out',
              on ? 'bg-foreground text-background' : 'ring-1 ring-border ring-inset hover:bg-muted',
            )}
          >
            {t(`explore.kinds.${kind}`)}
          </button>
        )
      })}
      {kinds ? (
        <>
          <div aria-hidden className="mx-1 my-2 h-px bg-border" />
          <h2 className="mx-2 mb-1 text-[0.8125rem] font-semibold text-muted-foreground">
            {t('explore.categories.label')}
          </h2>
          {EXPLORE_CATEGORIES.map((cat) => {
            const on = home.cat === cat
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={on}
                onClick={() => show({ cat })}
                className={cn(
                  'flex h-10 items-center justify-between rounded-[10px] px-2.5 text-[0.9375rem] transition-colors duration-150 ease-out',
                  on ? 'bg-muted font-bold' : 'font-medium hover:bg-muted',
                )}
              >
                {t(`explore.categories.${cat}`)}
                <span className="font-normal text-muted-foreground tabular-nums">
                  {counts[cat]}
                </span>
              </button>
            )
          })}
        </>
      ) : null}
    </aside>
  )
}
