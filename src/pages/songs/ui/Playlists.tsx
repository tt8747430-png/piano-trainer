import { Link } from '@tanstack/react-router'
import { ChevronRight, Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { FOLDER_PAINTS, useFolderName, useLibrary, type ShelvedFolder } from '@/entities/library'
import { useRepertoire, type Entry, type PieceId } from '@/entities/piece'
import { readSharedEntries, useGroupsData } from '@/features/share-folder'
import { cn, isOneOf } from '@/shared/lib'
import { PlaylistCover } from '@/widgets/piece-cover'
import { useHoldsLine, type FolderHolds } from '@/widgets/song-library'
import type { LibraryPage } from '../model/use-library-page'

const isFolderPaint = isOneOf(FOLDER_PAINTS)

/** A row of the list: a card on a phone (the Songs board's PLAYLISTROWS), a quiet row in a laptop's pane. */
const ROW = {
  card: 'card min-h-20 gap-4 px-3 py-2 hover:bg-muted/60',
  pane: 'min-h-16 gap-3 rounded-[12px] px-2 py-2 hover:bg-muted',
} as const

function Face({
  cover,
  name,
  line,
  pane,
}: {
  cover: ReactNode
  name: string
  line: string
  pane: boolean
}) {
  return (
    <>
      {cover}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={cn('truncate font-semibold', pane ? 'text-[0.9375rem]' : 'text-[1.0625rem]')}
        >
          {name}
        </span>
        <span
          className={cn('truncate text-muted-foreground', pane ? 'text-[0.8125rem]' : 'text-sm')}
        >
          {line}
        </span>
      </span>
      {pane ? null : <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />}
    </>
  )
}

/** The first four songs a playlist holds that the repertoire knows, for its cover. */
function useFirstSongs(ids: readonly PieceId[]): Entry[] {
  const repertoire = useRepertoire()
  return ids
    .flatMap((id) => {
      const entry = repertoire.entry(id)
      return entry && entry.kind !== 'listing' ? [entry] : []
    })
    .slice(0, 4)
}

function OwnPlaylist({
  folder,
  holds,
  pane,
  className,
}: {
  folder: ShelvedFolder
  holds: FolderHolds
  pane: boolean
  className: string
}) {
  const nameOf = useFolderName()
  return (
    <li className="flex min-w-0">
      <Link to="/songs/folders/$folderId" params={{ folderId: folder.id }} className={className}>
        <Face
          pane={pane}
          cover={
            <PlaylistCover
              paint={folder.paint}
              songs={useFirstSongs(folder.songs)}
              className={pane ? 'size-12' : 'size-16'}
            />
          }
          name={nameOf(folder)}
          line={useHoldsLine(holds)}
        />
      </Link>
    </li>
  )
}

/**
 * The learner's playlists (owner, 2026-11-17: "what about copiing the flat layout and its playlists";
 * Flat's Playlists, the Songs board's PLAYLISTROWS): Favourites first, then their own, then those a
 * group shared with them, each its mosaic cover, its name and what it holds; a shared one wears the
 * sharer's face, says who, and opens itself (never Groups). New playlist is the list's last row. A
 * phone's rows are cards; a laptop's pane holds quieter rows (`pane`).
 */
export function Playlists({ page, pane = false }: { page: LibraryPage; pane?: boolean }) {
  const { t } = useTranslation('songs')
  const repertoire = useRepertoire()
  const favourites = useLibrary((state) => state.favourites)
  const favouritesLine = useHoldsLine({ folders: 0, songs: favourites.length })
  const { data } = useGroupsData()
  const shared = data.kind === 'ready' ? data.shared.filter((folder) => !folder.mine) : []
  const row = cn(
    'flex min-w-0 flex-1 items-center text-foreground transition-colors duration-150 ease-out focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
    pane ? ROW.pane : ROW.card,
  )
  return (
    <ul className={cn('flex flex-col', pane ? 'gap-0' : 'gap-2')}>
      <li className="flex min-w-0">
        <Link to="/songs/all" search={{ favourites: true }} className={row}>
          <Face
            pane={pane}
            cover={<PlaylistCover paint="rose" heart className={pane ? 'size-12' : 'size-16'} />}
            name={t('places.favourites')}
            line={favouritesLine}
          />
        </Link>
      </li>
      {page.view.folders.map(({ folder, ...holds }) => (
        <OwnPlaylist key={folder.id} folder={folder} holds={holds} pane={pane} className={row} />
      ))}
      {shared.map((folder) => {
        const songs = readSharedEntries(folder.songs).flatMap((entry) => {
          const found = entry.kind === 'built-in' ? repertoire.entry(entry.id) : undefined
          return found && found.kind !== 'listing' ? [found] : []
        })
        return (
          <li key={folder.id} className="flex min-w-0">
            <Link
              to="/songs/shared-folders/$sharedId"
              params={{ sharedId: folder.id }}
              className={row}
            >
              <Face
                pane={pane}
                cover={
                  <PlaylistCover
                    paint={isFolderPaint(folder.paint) ? folder.paint : 'grass'}
                    songs={songs}
                    face={folder.ownerName}
                    className={pane ? 'size-12' : 'size-16'}
                  />
                }
                name={folder.name}
                line={t('shared.byLine', {
                  name: folder.ownerName,
                  songs: t('folder.songCount', { count: folder.songs.length }),
                })}
              />
            </Link>
          </li>
        )
      })}
      {page.may('addFolder') ? (
        <li className="flex min-w-0">
          <button
            type="button"
            onClick={() => page.open({ kind: 'folder', target: { kind: 'new', parent: null } })}
            className={cn(row.replace('card ', ''), 'text-left')}
          >
            <span
              aria-hidden
              className={cn(
                'grid shrink-0 place-items-center rounded-[10px] border-2 border-dashed border-border text-muted-foreground',
                pane ? 'size-12' : 'size-16',
              )}
            >
              <Plus className="size-6" />
            </span>
            <span className={cn('font-semibold', pane ? 'text-[0.9375rem]' : 'text-[1.0625rem]')}>
              {t('folder.new')}
            </span>
          </button>
        </li>
      ) : null}
    </ul>
  )
}
