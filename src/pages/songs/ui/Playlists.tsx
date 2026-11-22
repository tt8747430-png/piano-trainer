import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { FOLDER_PAINTS, useFolderName, useLibrary, type ShelvedFolder } from '@/entities/library'
import { useRepertoire, type Entry, type PieceId } from '@/entities/piece'
import { readSharedEntries, useGroupsData, useKeepSharesCurrent } from '@/features/share-folder'
import { cn, isOneOf } from '@/shared/lib'
import { OpensMark } from '@/shared/ui'
import { PlaylistCover } from '@/widgets/piece-cover'
import { useHoldsLine, type FolderHolds } from '@/widgets/song-library'
import type { LibraryPage } from '../model/use-library-page'

const isFolderPaint = isOneOf(FOLDER_PAINTS)

/**
 * A row (the Songs board's PLAYLISTROWS): on a phone a row of one inset list, a hairline from the
 * name's edge to the right between rows as an inset grouped list draws it, one common region for the
 * whole list and never a card a row (NN/g, common region; `edge-lines`). A laptop's are the sidebar's.
 */
const ROW =
  "relative min-h-18 gap-4 py-2 pr-3 hover:bg-muted/60 [li+li>&]:before:absolute [li+li>&]:before:top-0 [li+li>&]:before:right-0 [li+li>&]:before:left-18 [li+li>&]:before:h-px [li+li>&]:before:bg-border [li+li>&]:before:content-['']"

function Face({ cover, name, line }: { cover: ReactNode; name: string; line: string }) {
  return (
    <>
      {cover}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-base/[normal] font-semibold">{name}</span>
        <span className="truncate text-sm/[normal] text-muted-foreground">{line}</span>
      </span>
      <OpensMark />
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
  className,
}: {
  folder: ShelvedFolder
  holds: FolderHolds
  className: string
}) {
  const nameOf = useFolderName()
  return (
    <li className="flex min-w-0">
      <Link to="/songs/folders/$folderId" params={{ folderId: folder.id }} className={className}>
        <Face
          cover={
            <PlaylistCover
              paint={folder.paint}
              songs={useFirstSongs(folder.songs)}
              className="size-14"
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
 * sharer's face, says who, and opens itself (never Groups): one inset list of rows on a phone (a
 * laptop's are the sidebar's `SongsPlaces`). A new playlist is made from New.
 */
export function Playlists({ page }: { page: LibraryPage }) {
  const { t } = useTranslation('songs')
  const repertoire = useRepertoire()
  const favourites = useLibrary((state) => state.favourites)
  const favouritesLine = useHoldsLine({ folders: 0, songs: favourites.length })
  const { data, reload } = useGroupsData()
  // While the library is open the learner's shared folders follow their folders (R30 S6).
  useKeepSharesCurrent(data, reload)
  const shared = data.kind === 'ready' ? data.shared.filter((folder) => !folder.mine) : []
  const row = cn(
    'flex min-w-0 flex-1 items-center text-foreground transition-colors duration-150 ease-out',
    ROW,
  )
  const cover = 'size-14'
  return (
    <ul className="card flex flex-col overflow-hidden pl-3">
      <li className="flex min-w-0">
        <Link to="/songs/all" search={{ favourites: true }} className={row}>
          <Face
            cover={<PlaylistCover paint="rose" heart className={cover} />}
            name={t('places.favourites')}
            line={favouritesLine}
          />
        </Link>
      </li>
      {page.view.folders.map(({ folder, ...holds }) => (
        <OwnPlaylist key={folder.id} folder={folder} holds={holds} className={row} />
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
                cover={
                  <PlaylistCover
                    paint={isFolderPaint(folder.paint) ? folder.paint : 'grass'}
                    songs={songs}
                    face={folder.ownerName}
                    className={cover}
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
    </ul>
  )
}
