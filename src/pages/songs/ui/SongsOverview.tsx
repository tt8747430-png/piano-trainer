import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { LIBRARY_SORTS, SORT_DIRECTIONS, useLibraryLayout } from '@/entities/library'
import { useSongImport } from '@/features/song-files'
import { useMediaQuery, useSetSearch } from '@/shared/lib'
import {
  CountSort,
  LIBRARY_PANES,
  MoreMenu,
  ScreenHeader,
  SearchField,
  SectionHead,
} from '@/shared/ui'
import type { SongsHome } from '../model/explore-view'
import { useLibraryPage } from '../model/use-library-page'
import { ContinueShelf } from './ContinueShelf'
import { CreateButtons } from './CreateButtons'
import { ExploreShelf } from './ExploreShelf'
import { LibraryBrowse } from './LibraryBrowse'
import { LibraryDialogs } from './LibraryDialogs'
import { LibraryEmpty } from './LibraryEmpty'
import { Playlists } from './Playlists'
import { SongsFound } from './SongsFound'

/** A row of the laptop's pane under its playlists: Archive or Trash, with how many it holds. */
const PANE_ROW =
  'flex min-h-11 items-center justify-between rounded-[10px] px-2 text-[0.9375rem] font-semibold text-foreground transition-colors duration-150 ease-out hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none'

/**
 * Songs (the Songs board, owner 2026-11-17: "copiing the flat layout and its playlists … i dont want
 * misleading links"): the title, the search in place and the ways to make a song. On a phone, Flat's
 * My scores: Recently played with All n songs, the Playlists as rows, Explore's newest; its ··· holds
 * Archive and Trash. On a laptop, Flat's library: a pane of the Playlists with Archive and Trash at its
 * foot, every song beside it under its count and sort, Explore's newest under them. While the search
 * holds words the page shows what it found. Every link is named for where it goes.
 */
export function SongsOverview() {
  const { t } = useTranslation('songs')
  const navigate = useNavigate()
  const { q } = useSearch({ from: '/shell/songs' })
  const show = useSetSearch<SongsHome>()
  const laptop = useMediaQuery(LIBRARY_PANES)
  const query = q.trim()
  const page = useLibraryPage(null, { q })
  // Every song, one list (a laptop's right side): All songs' own view.
  const every = useLibraryPage(null, { q: '' }, { tree: true })
  const layout = useLibraryLayout()
  const songImport = useSongImport(null)
  const empty = !query && page.view.folders.length === 0 && page.view.scope.length === 0
  const search = empty ? null : (
    <SearchField
      value={q}
      onChange={(next) => show({ q: next })}
      label={t('all.search')}
      screen={t('title')}
    />
  )
  const more = laptop ? null : (
    <MoreMenu
      label={t('more')}
      actions={[
        {
          key: 'archive',
          label: t('menu.archive', { count: layout.archive.length }),
          onSelect: () => void navigate({ to: '/songs/archive' }),
        },
        {
          key: 'trash',
          label: t('menu.trash', { count: layout.trash.length }),
          onSelect: () => void navigate({ to: '/songs/trash' }),
        },
      ]}
    />
  )
  return (
    <div className="flex flex-col gap-4 pb-4">
      <ScreenHeader
        title={t('title')}
        large
        tools={
          laptop ? (
            <>
              {search ? <div className="w-80">{search}</div> : null}
              <CreateButtons page={page} onImport={songImport.choose} bar />
            </>
          ) : null
        }
        more={more}
      />
      {laptop ? null : (
        <>
          {search}
          {query ? null : <CreateButtons page={page} onImport={songImport.choose} />}
        </>
      )}
      {query ? (
        <SongsFound page={page} query={query} onClear={() => show({ q: '' })} />
      ) : empty ? (
        <div className="flex flex-col gap-7">
          <LibraryEmpty page={page} place="home" filter={{ q: '' }} onClear={() => undefined} />
          <ExploreShelf />
        </div>
      ) : laptop ? (
        <div className="grid grid-cols-[20rem_minmax(0,1fr)] items-start gap-8">
          <aside
            aria-labelledby="songs-playlists"
            className="card sticky top-4 flex flex-col gap-2 px-3 py-4"
          >
            <h2 id="songs-playlists" className="mx-2 mb-1 font-sans text-lg font-bold">
              {t('folder.list')}
            </h2>
            <Playlists page={page} pane />
            <div aria-hidden className="mx-2 my-1 h-px bg-border" />
            <Link to="/songs/archive" className={PANE_ROW}>
              {t('archive.title')}
              <span className="font-normal text-muted-foreground tabular-nums">
                {layout.archive.length}
              </span>
            </Link>
            <Link to="/songs/trash" className={PANE_ROW}>
              {t('trash.title')}
              <span className="font-normal text-muted-foreground tabular-nums">
                {layout.trash.length}
              </span>
            </Link>
          </aside>
          <div className="flex min-w-0 flex-col gap-9">
            <section aria-label={t('all.title')} className="flex flex-col gap-3">
              <CountSort
                count={t('folder.songCount', { count: every.view.shown })}
                label={t('sort.label')}
                sort={every.sort}
                sorts={LIBRARY_SORTS.map((value) => ({ value, label: t(`sort.${value}`) }))}
                onSort={every.setSort}
                ways={{
                  way: every.direction,
                  options: SORT_DIRECTIONS.map((value) => ({ value, label: t(`sort.${value}`) })),
                  onWay: every.setDirection,
                }}
              />
              <LibraryBrowse page={every} place="home" noFolders onClear={() => undefined} />
            </section>
            <ExploreShelf />
          </div>
          <LibraryDialogs page={every} folder={null} />
        </div>
      ) : (
        <div className="flex flex-col gap-7">
          <ContinueShelf more={page.view.scope.length} />
          <section aria-labelledby="songs-playlists" className="flex flex-col gap-3">
            <SectionHead id="songs-playlists" title={t('folder.list')} />
            <Playlists page={page} />
          </section>
          <ExploreShelf />
        </div>
      )}
      <LibraryDialogs page={page} folder={null} />
      {songImport.view}
    </div>
  )
}
