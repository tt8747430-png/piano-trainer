import { Link, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useLibraryLayout } from '@/entities/library'
import { useSongImport } from '@/features/song-files'
import { LAPTOP, useMediaQuery, useSetSearch } from '@/shared/lib'
import { RowLink, ScreenHeader, SearchField, SectionHead } from '@/shared/ui'
import type { SongsHome } from '../model/explore-view'
import { useLibraryPage } from '../model/use-library-page'
import { AllSongsShelf } from './AllSongsShelf'
import { ExploreShelf } from './ExploreShelf'
import { LibraryDialogs } from './LibraryDialogs'
import { LibraryEmpty } from './LibraryEmpty'
import { LibraryScreen } from './LibraryScreen'
import { NewActions } from './NewActions'
import { Playlists } from './Playlists'
import { SongsFound } from './SongsFound'

/** The newest played first: My songs' shelf of every song (the Songs board's RECENT). */
const LATEST = { sort: 'played', direction: 'descending' } as const

/**
 * Songs (the Songs and SongsLaptop boards, canvas v390; owner 2026-11-17: "copiing the flat layout and
 * its playlists … i dont want misleading links"). On a phone, Flat's My scores: the title; the search
 * in place; All songs, every song the latest played first, with See all; the Playlists as one inset
 * list; Archive and Trash as one group under them; Explore's newest; New the floating + at the bottom
 * right. On a laptop, All songs (`LibraryScreen`): its places are the sidebar's (`SongsPlaces`). While the search holds words the page shows
 * what it found. New is the same four rows as All songs' and a playlist's. Every link is named for
 * where it goes.
 */
export function SongsOverview() {
  const { q } = useSearch({ from: '/shell/songs' })
  const laptop = useMediaQuery(LAPTOP)
  // A laptop's Songs is All songs, in the frame every Songs place shares (the sidebar holds the places).
  return laptop ? <LibraryScreen folder={null} filter={{ q }} all="all" /> : <SongsPhone q={q} />
}

function SongsPhone({ q }: { q: string }) {
  const { t } = useTranslation(['songs', 'common'])
  const show = useSetSearch<SongsHome>()
  const query = q.trim()
  const page = useLibraryPage(null, { q })
  // Every song the latest played first: the phone's shelf.
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
