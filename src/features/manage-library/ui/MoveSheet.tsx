import { Check, FolderPlus, House } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FolderTile,
  placeIn,
  useFolderName,
  useLibraryLayout,
  type FolderId,
} from '@/entities/library'
import type { PieceId } from '@/entities/piece'
import { cn } from '@/shared/lib'
import { PAINT, Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { FolderSheet } from './FolderSheet'
import { useLibraryActs } from './use-library-acts'

/** A place a song can go: a folder, or Home. */
type Place = FolderId | null

const ROW =
  'flex min-h-14 w-full items-center gap-3 rounded-2xl px-2 py-1.5 text-left text-lg font-semibold transition-colors duration-200 ease-out hover:bg-muted disabled:opacity-50 disabled:hover:bg-transparent aria-pressed:bg-muted focus-visible:-outline-offset-3'

/**
 * Move to… (Mindscape's `DestinationSheet`): Home, then every folder on its tile in Home's order,
 * the one the songs all stand in greyed; one chosen, its button says where they go. New folder at
 * its foot makes a folder and moves them into it. Each move says so in a toast, with Undo.
 */
export function MoveSheet({
  songs,
  what,
  onOpenChange,
}: {
  /** The songs to move; none while the sheet is shut. */
  songs: readonly PieceId[] | null
  /** What moves, under the sheet's title: a song's title, or how many. */
  what: string
  onOpenChange: (open: boolean) => void
}) {
  const [making, setMaking] = useState<readonly PieceId[] | null>(null)
  const acts = useLibraryActs()
  return (
    <>
      <Sheet open={songs !== null} onOpenChange={onOpenChange}>
        {songs ? (
          <MovePicker
            songs={songs}
            what={what}
            onPick={(to) => {
              onOpenChange(false)
              acts.move(songs, to)
            }}
            onNewFolder={() => {
              onOpenChange(false)
              setMaking(songs)
            }}
          />
        ) : null}
      </Sheet>
      <FolderSheet
        target={making ? { kind: 'new' } : null}
        onOpenChange={(open) => {
          if (!open) setMaking(null)
        }}
        onMade={(id) => {
          if (making) acts.move(making, id)
        }}
      />
    </>
  )
}

function MovePicker({
  songs,
  what,
  onPick,
  onNewFolder,
}: {
  songs: readonly PieceId[]
  what: string
  onPick: (to: Place) => void
  onNewFolder: () => void
}) {
  const { t } = useTranslation('songs')
  const layout = useLibraryLayout()
  const nameOf = useFolderName()
  const [picked, setPicked] = useState<Place | undefined>(undefined)
  // Where every song moved stands now, if they all stand in one place: no place to move them to.
  const standing = new Set(
    songs.map((id) => {
      const place = placeIn(layout, id)
      return place && place !== 'archived' ? place.folder : undefined
    }),
  )
  const [here] = standing.size === 1 ? standing : [undefined]
  const places: { place: Place; name: string; tile: ReactNode }[] = [
    {
      place: null,
      name: t('library.home'),
      tile: (
        <span
          aria-hidden
          className={cn(
            'grid size-12 shrink-0 place-items-center rounded-2xl [&_svg]:size-5',
            PAINT.sky.fill,
            PAINT.sky.ink,
          )}
        >
          <House />
        </span>
      ),
    },
    ...layout.folders.map((folder) => ({
      place: folder.id,
      name: nameOf(folder),
      tile: <FolderTile look={folder} />,
    })),
  ]
  const chosen = places.find((each) => each.place === picked)
  return (
    <SheetContent
      title={t('move.title')}
      footer={
        <Button
          size="lg"
          className="w-full"
          disabled={chosen === undefined}
          onClick={() => chosen && onPick(chosen.place)}
        >
          {chosen ? t('move.to', { place: chosen.name }) : t('move.choose')}
        </Button>
      }
    >
      <p className="truncate pb-2 text-muted-foreground">{what}</p>
      <ul className="flex flex-col gap-1">
        {places.map(({ place, name, tile }) => (
          <li key={place ?? 'home'}>
            <button
              type="button"
              aria-pressed={picked === place}
              disabled={place === here}
              title={place === here ? t('move.here') : undefined}
              onClick={() => setPicked(place)}
              className={ROW}
            >
              {tile}
              <span className="min-w-0 flex-1 truncate">{name}</span>
              {picked === place ? <Check aria-hidden className="size-5 shrink-0" /> : null}
            </button>
          </li>
        ))}
        <li>
          <button type="button" onClick={onNewFolder} className={cn(ROW, 'text-link')}>
            <span
              aria-hidden
              className="grid size-12 shrink-0 place-items-center rounded-2xl bg-muted [&_svg]:size-5"
            >
              <FolderPlus />
            </span>
            <span className="min-w-0 flex-1 truncate">{t('move.newFolder')}</span>
          </button>
        </li>
      </ul>
    </SheetContent>
  )
}
