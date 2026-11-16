import { Link } from '@tanstack/react-router'
import { ChevronRight, Heart, Search, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLibrary, useLibraryLayout } from '@/entities/library'
import { useSongImport } from '@/features/song-files'
import { cn, useMediaQuery } from '@/shared/lib'
import { LIBRARY_PANES, RoundLink, RowFace, ScreenHeader, TileMark, TitleTabs } from '@/shared/ui'
import { FolderFace } from '@/widgets/song-library'
import { useLibraryPage } from '../model/use-library-page'
import type { SongsFilter } from '../model/songs-filter'
import { ContinueShelf } from './ContinueShelf'
import { LibraryDialogs } from './LibraryDialogs'
import { LibraryEmpty } from './LibraryEmpty'
import { NewActions, NewMenu } from './NewActions'
import { useSongsViews } from './SongsSwitch'

/** A folder's card (the R72 board's FOLDERCARDS): a white card of its own, its 56px tile, name, line and chevron. */
const CARD =
  'flex min-h-20 min-w-0 items-center gap-4 rounded-[14px] bg-card p-3 text-foreground ring-1 ring-border transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none [&_[data-slot=row-tile]]:size-14 [&_[data-slot=row-tile]]:rounded-xl'

/**
 * My songs (R72, Flat's library overview; the Songs board): Recently played, a shelf of the songs
 * played with See all, then the Folders as cards (Favourites first, the learner's folders, Shared
 * with me), then the Archive and the Trash, each a row with its count. Search is the bar's, opening
 * All songs, where every song is listed, searched, sorted and selected. New floats at the foot on a
 * phone and is the bar's on a laptop.
 */
export function SongsOverview({ filter }: { filter: SongsFilter }) {
  const { t } = useTranslation('songs')
  const views = useSongsViews('mine')
  const laptop = useMediaQuery(LIBRARY_PANES)
  const page = useLibraryPage(null, filter)
  const layout = useLibraryLayout()
  const favourites = useLibrary((state) => state.favourites).length
  const songImport = useSongImport(null)
  const total = page.view.scope.length
  const empty = page.view.folders.length === 0 && total === 0
  return (
    <div className="flex flex-col gap-4 pb-4">
      <ScreenHeader
        title={t('title')}
        large
        views={<TitleTabs {...views} />}
        tools={
          <>
            <RoundLink
              label={t('all.search')}
              icon={Search}
              variant="glass"
              render={<Link to="/songs/all" />}
            />
            {laptop ? <NewMenu page={page} folder={null} onImport={songImport.choose} /> : null}
          </>
        }
      />
      {empty ? (
        <LibraryEmpty page={page} inFolder={false} filter={filter} onClear={() => undefined} />
      ) : (
        <div className="flex flex-col gap-7 lg:gap-9">
          <ContinueShelf more={total} />
          <section aria-labelledby="songs-folders" className="flex flex-col gap-3 lg:gap-4">
            <h2 id="songs-folders" className="mx-1 font-sans text-xl font-bold">
              {t('folder.list')}
            </h2>
            <ul className="grid gap-3 lg:grid-cols-3">
              <li className="flex min-w-0">
                <Link to="/songs/all" search={{ favourites: true }} className={cn(CARD, 'flex-1')}>
                  <span
                    data-slot="row-tile"
                    aria-hidden
                    className="grid size-14 shrink-0 place-items-center rounded-xl bg-destructive/12"
                  >
                    <Heart className="size-6 fill-destructive text-destructive" />
                  </span>
                  <RowFace
                    title={t('places.favourites')}
                    detail={t('folder.songCount', { count: favourites })}
                  />
                  <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
                </Link>
              </li>
              {page.view.folders.map(({ folder, ...holds }) => (
                <li key={folder.id} className="flex min-w-0">
                  <Link
                    to="/songs/folders/$folderId"
                    params={{ folderId: folder.id }}
                    className={cn(CARD, 'flex-1')}
                  >
                    <FolderFace folder={folder} holds={holds} />
                    <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
              <li className="flex min-w-0">
                <Link to="/songs/groups" className={cn(CARD, 'flex-1')}>
                  <TileMark large icon={Users} paint="grass" />
                  <RowFace title={t('groups.sharedWithMe')} detail={t('groups.title')} />
                  <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            </ul>
          </section>
          <ul className="card flex flex-col overflow-hidden lg:w-[calc((100%-1.5rem)/3)]">
            {(
              [
                ['/songs/archive', t('archive.title'), layout.archive.length],
                ['/songs/trash', t('trash.title'), layout.trash.length],
              ] as const
            ).map(([to, label, count]) => (
              <li key={to} className="border-hairline not-first:border-t">
                <Link
                  to={to}
                  className="flex min-h-12 items-center gap-3 px-4 text-base transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <span className="flex-1">{label}</span>
                  <span className="text-muted-foreground tabular-nums">{count}</span>
                  <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {laptop ? null : <NewActions page={page} folder={null} onImport={songImport.choose} />}
      <LibraryDialogs page={page} folder={null} />
      {songImport.view}
    </div>
  )
}
