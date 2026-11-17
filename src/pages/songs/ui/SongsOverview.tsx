import { Link, useSearch } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LIBRARY_SORTS, SORT_DIRECTIONS, useLibraryLayout } from '@/entities/library'
import { useSongImport } from '@/features/song-files'
import { cn, useMediaQuery, useSetSearch, WIDE } from '@/shared/lib'
import { RowLink, ScreenHeader, SearchField, SectionHead, SortMenu } from '@/shared/ui'
import { SongTable } from '@/widgets/song-library'
import type { SongsHome } from '../model/explore-view'
import { useLibraryPage } from '../model/use-library-page'
import { AllSongsShelf } from './AllSongsShelf'
import { ExploreShelf } from './ExploreShelf'
import { LibraryDialogs } from './LibraryDialogs'
import { LibraryEmpty } from './LibraryEmpty'
import { NewActions, NewMenu } from './NewActions'
import { Playlists } from './Playlists'
import { songActions } from './row-actions'
import { SongsFound } from './SongsFound'
import { FRESH } from './songs-fresh'

/** The newest played first: My songs' shelf of every song (the Songs board's RECENT). */
const LATEST = { sort: 'played', direction: 'descending' } as const

/** A place in the laptop's pane (the SongsLaptop board's _PNAV): its name, and how many it holds. */
const PANE_ROW =
  'flex min-h-10 items-center gap-2.5 rounded-[10px] px-2.5 text-[0.9375rem] text-foreground transition-colors duration-150 ease-out hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none'

/**
 * Songs (the Songs and SongsLaptop boards, canvas v390; owner 2026-11-17: "copiing the flat layout and
 * its playlists … i dont want misleading links"). On a phone, Flat's My scores: the title; the search
 * in place; All songs, every song the latest played first, with See all; the Playlists as one inset
 * list; Archive and Trash as one group under them; Explore's newest; New the floating + at the bottom
 * right. On a laptop, Flat's library: a pane at the left (All songs, Explore; the Playlists with + by
 * their heading; Archive and Trash at its foot) beside every song as a table under one head (All songs
 * and its count, the search, New ▾), every edge shared. While the search holds words the page shows
 * what it found. New is the same four rows as All songs' and a playlist's. Every link is named for
 * where it goes.
 */
export function SongsOverview() {
  const { t } = useTranslation(['songs', 'common'])
  const { q } = useSearch({ from: '/shell/songs' })
  const show = useSetSearch<SongsHome>()
  const laptop = useMediaQuery(WIDE)
  const query = q.trim()
  const page = useLibraryPage(null, { q })
  // Every song, one list: the laptop's table in the learner's sort, the phone's shelf the latest first.
  const every = useLibraryPage(null, { q: '' }, { tree: true })
  const recent = useLibraryPage(null, { q: '' }, { tree: true, order: LATEST })
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
  const newPlaylist = () => page.open({ kind: 'folder', target: { kind: 'new', parent: null } })

  if (laptop) {
    const songs = every.view.groups.flatMap((group) => group.entries)
    return (
      <div className="grid grid-cols-[17.5rem_minmax(0,1fr)] items-start gap-8 pt-6 pb-12">
        <aside
          aria-label={t('library.label')}
          className="card sticky top-6 flex flex-col gap-0.5 px-3 pt-1 pb-3"
        >
          <Link to="/songs/all" className={cn(PANE_ROW, 'mt-2 bg-muted font-bold')}>
            <span className="flex-1">{t('all.title')}</span>
            <span className="font-normal text-muted-foreground tabular-nums">{songs.length}</span>
          </Link>
          <Link to="/songs" search={{ ...FRESH, view: 'explore' }} className={PANE_ROW}>
            {t('explore.views.explore')}
          </Link>
          <div className="mt-3 mb-1 ml-2.5 flex items-center justify-between">
            <h2
              id="songs-playlists"
              className="font-sans text-[0.8125rem] font-semibold text-muted-foreground"
            >
              {t('folder.list')}
            </h2>
            {page.may('addFolder') ? (
              <button
                type="button"
                aria-label={t('folder.new')}
                title={t('folder.new')}
                onClick={newPlaylist}
                className="grid size-10 place-items-center rounded-full text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <Plus aria-hidden className="size-4.5" />
              </button>
            ) : null}
          </div>
          <Playlists page={page} pane />
          <div aria-hidden className="mx-2.5 mt-3 mb-2 h-px bg-border" />
          <Link to="/songs/archive" className={PANE_ROW}>
            <span className="flex-1">{t('archive.title')}</span>
            <span className="text-muted-foreground tabular-nums">{layout.archive.length}</span>
          </Link>
          <Link to="/songs/trash" className={PANE_ROW}>
            <span className="flex-1">{t('trash.title')}</span>
            <span className="text-muted-foreground tabular-nums">{layout.trash.length}</span>
          </Link>
        </aside>
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex min-h-12 items-center gap-4">
            <h1 className="font-sans text-[1.75rem] leading-tight font-bold tracking-[-0.01em] whitespace-nowrap">
              {t('all.title')}
            </h1>
            <span className="text-[1.0625rem] whitespace-nowrap text-muted-foreground tabular-nums">
              {t('folder.songCount', { count: songs.length })}
            </span>
            <span className="flex-1" />
            {search ? <div className="w-80 min-w-0 shrink">{search}</div> : null}
            <NewMenu page={page} folder={null} onImport={songImport.choose} />
          </div>
          {query ? (
            <SongsFound page={page} query={query} onClear={() => show({ q: '' })} />
          ) : empty ? (
            <LibraryEmpty page={page} place="home" filter={{ q: '' }} onClear={() => undefined} />
          ) : (
            <SongTable
              label={t('all.title')}
              entries={songs}
              actionsOf={(entry) => songActions(entry, every, t)}
              sort={
                <SortMenu
                  head
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
              }
            />
          )}
        </div>
        <LibraryDialogs page={every} folder={null} />
        <LibraryDialogs page={page} folder={null} />
        {songImport.view}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-24">
      <ScreenHeader title={t('title')} large />
      {search}
      {query ? (
        <SongsFound page={page} query={query} onClear={() => show({ q: '' })} />
      ) : empty ? (
        <div className="flex flex-col gap-7">
          <LibraryEmpty page={page} place="home" filter={{ q: '' }} onClear={() => undefined} />
          <ExploreShelf />
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-7">
          <AllSongsShelf songs={recent.view.groups.flatMap((group) => group.entries)} />
          <section aria-labelledby="songs-playlists" className="flex flex-col gap-3">
            <SectionHead id="songs-playlists" title={t('folder.list')} />
            <Playlists page={page} />
          </section>
          <div className="card overflow-hidden">
            <RowLink
              render={<Link to="/songs/archive" />}
              title={t('archive.title')}
              value={String(layout.archive.length)}
            />
            <RowLink
              render={<Link to="/songs/trash" />}
              title={t('trash.title')}
              value={String(layout.trash.length)}
            />
          </div>
          <ExploreShelf />
        </div>
      )}
      <NewActions page={page} folder={null} onImport={songImport.choose} />
      <LibraryDialogs page={page} folder={null} />
      {songImport.view}
    </div>
  )
}
