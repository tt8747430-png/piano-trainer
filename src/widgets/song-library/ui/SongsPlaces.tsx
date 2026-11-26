import { Link, useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FOLDER_PAINTS, useFolderName, useLibraryLayout, usePermissions } from '@/entities/library'
import { FolderSheet, type FolderSheetTarget } from '@/features/manage-library'
import { useGroupsData } from '@/features/share-folder'
import { cn, isOneOf } from '@/shared/lib'
import { playlistPaint } from '@/widgets/piece-cover'
import { useSongsPlace, type SongsPlace } from './use-songs-place'

const isFolderPaint = isOneOf(FOLDER_PAINTS)

/** A sub-item (the board's SONGS_SUB `item`): 40 tall, its words on the Songs label's edge (44). */
const ITEM =
  'choice flex h-10 items-center pointer-coarse:h-11 gap-2 rounded-thumb pr-3 text-subhead font-medium text-nav-foreground aria-[current=page]:font-semibold aria-[current=page]:text-nav-current-foreground focus-visible:-outline-offset-3'

/** What a sub-item's link carries: its shape (a playlist's further in, for its paint) and its mark. */
const item = (current: boolean, swatch = false) => ({
  className: cn(ITEM, swatch ? 'pl-18' : 'pl-11'),
  'aria-current': current ? ('page' as const) : undefined,
  activeOptions: { exact: true, includeSearch: true },
})

/** A sub-item's face: a playlist's paint, its name, how many it holds. */
function Face({ label, count, swatch }: { label: string; count?: number; swatch?: string }) {
  return (
    <>
      {swatch ? (
        <span
          aria-hidden
          className={cn('-ml-7 size-5 shrink-0 rounded-mark picture-edge', swatch)}
        />
      ) : null}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count === undefined ? null : (
        <span className="text-footnote font-medium text-muted-foreground tabular-nums">
          {count}
        </span>
      )}
    </>
  )
}

/**
 * Songs' places, sub-items of Songs in a laptop's sidebar while Songs is current (owner, 2026-11-17:
 * "what about subdivisions in the sidebar"; Apple Music's sidebar, HIG Sidebars; the board's
 * SONGS_SUB): All songs with its count, Explore, the Playlists under their heading with + (Favourites,
 * the learner's own, those shared with them, each its paint), then Archive and Trash with their
 * counts apart under a hairline. The place shown wears the current wash; Songs itself is then only
 * bold (`useSongsPlaceShown`). New playlist opens its sheet here and goes to the playlist made.
 */
export function SongsPlaces() {
  const { t } = useTranslation('songs')
  const here = useSongsPlace()
  const layout = useLibraryLayout()
  const nameOf = useFolderName()
  const permits = usePermissions()
  const navigate = useNavigate()
  const { data } = useGroupsData()
  const [making, setMaking] = useState<FolderSheetTarget | null>(null)
  const shared = data.kind === 'ready' ? data.shared.filter((folder) => !folder.mine) : []
  const playlists = layout.folders.filter((folder) => folder.parent === null)
  const songs = layout.folders.reduce(
    (sum, folder) => sum + folder.songs.length,
    layout.home.length,
  )
  const is = (kind: SongsPlace['kind'], id?: string) =>
    here.kind === kind && (id === undefined || ('id' in here && here.id === id))
  return (
    <div role="group" aria-label={t('library.label')} className="mt-2 mb-1 flex flex-col gap-0.5">
      <Link to="/songs" search={{ view: 'mine' }} {...item(is('all'))}>
        <Face label={t('all.title')} count={songs} />
      </Link>
      <Link to="/songs" search={{ view: 'explore' }} {...item(is('explore'))}>
        <Face label={t('explore.views.explore')} />
      </Link>
      <div className="mt-1 flex h-10 items-center pointer-coarse:h-11 pl-11">
        <span className="flex-1 text-footnote font-semibold text-muted-foreground">
          {t('folder.list')}
        </span>
        {permits('addFolder', { builtIn: false }) ? (
          <button
            type="button"
            aria-label={t('folder.new')}
            title={t('folder.new')}
            onClick={() => setMaking({ kind: 'new', parent: null })}
            className="choice grid size-10 place-items-center pointer-coarse:size-11 rounded-pill focus-visible:-outline-offset-3"
          >
            <Plus aria-hidden className="size-4.5" />
          </button>
        ) : null}
      </div>
      <Link to="/songs/all" search={{ favourites: true }} {...item(is('favourites'), true)}>
        <Face label={t('places.favourites')} swatch={playlistPaint('rose')} />
      </Link>
      {playlists.map((folder) => (
        <Link
          key={folder.id}
          to="/songs/folders/$folderId"
          params={{ folderId: folder.id }}
          {...item(is('folder', folder.id), true)}
        >
          <Face label={nameOf(folder)} swatch={playlistPaint(folder.paint)} />
        </Link>
      ))}
      {shared.map((folder) => (
        <Link
          key={folder.id}
          to="/songs/shared-folders/$sharedId"
          params={{ sharedId: folder.id }}
          {...item(is('shared', folder.id), true)}
        >
          <Face
            label={folder.name}
            swatch={playlistPaint(isFolderPaint(folder.paint) ? folder.paint : 'grass')}
          />
        </Link>
      ))}
      <div role="separator" className="my-1.5 mr-3 ml-11 h-px bg-border" />
      <Link to="/songs/archive" {...item(is('archive'))}>
        <Face label={t('archive.title')} count={layout.archive.length} />
      </Link>
      <Link to="/songs/trash" {...item(is('trash'))}>
        <Face label={t('trash.title')} count={layout.trash.length} />
      </Link>
      <FolderSheet
        target={making}
        onOpenChange={(open) => {
          if (!open) setMaking(null)
        }}
        onMade={(id) => void navigate({ to: '/songs/folders/$folderId', params: { folderId: id } })}
      />
    </div>
  )
}
