import { Check, ChevronRight, FolderPlus, House } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  childFolders,
  FolderTile,
  placeIn,
  subtreeIds,
  useFolderName,
  useLibraryLayout,
  type FolderId,
  type LibraryLayout,
  type ShelvedFolder,
} from '@/entities/library'
import { cn } from '@/shared/lib'
import { Sheet, SheetContent } from '@/shared/ui'
import type { Moving } from '../move-to'
import { FolderSheet } from './FolderSheet'
import { useLibraryActs } from './use-library-acts'

/** A place things can go: a folder, or Home. */
type Place = FolderId | null

const ROW =
  'flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-2xl px-2 py-1.5 text-left text-lg leading-snug font-semibold transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3'

/**
 * Move to… (Mindscape's `DestinationSheet` and `DestinationTree`): what moves on its own line under
 * the title, whole; Home on its own tile, then every folder on its tile as the library nests them, a
 * folder with folders in it opening to them. A tap on a place moves there at once and closes, the
 * toast saying where with Undo. The place everything stands in now is marked Here; a folder that
 * moves cannot go into itself or a folder under it, greyed with why. New folder at its foot makes
 * one at Home and moves them into it.
 */
export function MoveSheet({
  moving,
  what,
  onOpenChange,
}: {
  /** What moves; none while the sheet is shut. */
  moving: Moving | null
  /** What moves, under the sheet's title: a song's or folder's name, or how many. */
  what: string
  onOpenChange: (open: boolean) => void
}) {
  const [making, setMaking] = useState<Moving | null>(null)
  const acts = useLibraryActs()
  return (
    <>
      <Sheet open={moving !== null} onOpenChange={onOpenChange}>
        {moving ? (
          <MovePicker
            moving={moving}
            what={what}
            onPick={(to) => {
              onOpenChange(false)
              acts.move(moving, to)
            }}
            onNewFolder={() => {
              onOpenChange(false)
              setMaking(moving)
            }}
          />
        ) : null}
      </Sheet>
      <FolderSheet
        target={making ? { kind: 'new', parent: null } : null}
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

/** Where everything moved stands now, if it all stands in one place: none to move it to. */
function hereOf(layout: LibraryLayout, { songs, folders }: Moving): Place | undefined {
  const places = new Set<Place | undefined>([
    ...songs.map((id) => {
      const place = placeIn(layout, id)
      return place && place !== 'archived' ? place.folder : undefined
    }),
    ...folders.map((id) => layout.folders.find((folder) => folder.id === id)?.parent),
  ])
  const [here] = places
  return places.size === 1 ? here : undefined
}

function MovePicker({
  moving,
  what,
  onPick,
  onNewFolder,
}: {
  moving: Moving
  what: string
  onPick: (to: Place) => void
  onNewFolder: () => void
}) {
  const { t } = useTranslation('songs')
  const layout = useLibraryLayout()
  const nameOf = useFolderName()
  const here = hereOf(layout, moving)
  // No folder goes into itself or a folder under it.
  const barred = new Set(moving.folders.flatMap((id) => subtreeIds(layout.folders, id)))
  // Every folder that holds folders starts open, as Mindscape's tree does.
  const [shut, setShut] = useState<ReadonlySet<FolderId>>(new Set())
  const toggle = (id: FolderId) =>
    setShut((was) => {
      const next = new Set(was)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const folderRows = (parent: Place, depth: number): ReactNode[] =>
    childFolders(layout.folders, parent).map((folder) => {
      const inside = barred.has(folder.id) ? [] : childFolders(layout.folders, folder.id)
      const open = !shut.has(folder.id)
      return (
        <li key={folder.id}>
          <PlaceRow
            depth={depth}
            tile={<FolderTile look={folder} />}
            name={nameOf(folder)}
            here={here === folder.id}
            barred={barred.has(folder.id) ? t('move.intoItself') : null}
            onPick={() => onPick(folder.id)}
            toggle={
              inside.length > 0 ? { open, onToggle: () => toggle(folder.id), folder } : undefined
            }
          />
          {inside.length > 0 && open ? <ul>{folderRows(folder.id, depth + 1)}</ul> : null}
        </li>
      )
    })

  return (
    <SheetContent title={t('move.title')} description={what}>
      <ul className="flex flex-col">
        <li>
          <PlaceRow
            depth={0}
            tile={
              <span
                aria-hidden
                className="grid size-12 shrink-0 place-items-center rounded-2xl bg-muted text-foreground [&_svg]:size-5"
              >
                <House />
              </span>
            }
            name={t('library.home')}
            here={here === null}
            barred={null}
            onPick={() => onPick(null)}
          />
        </li>
        {folderRows(null, 0)}
        <li>
          <div className="flex items-center">
            <span aria-hidden className="size-11 shrink-0" />
            <button type="button" onClick={onNewFolder} className={cn(ROW, 'text-link')}>
              <span
                aria-hidden
                className="grid size-12 shrink-0 place-items-center rounded-2xl border border-dashed border-border [&_svg]:size-5"
              >
                <FolderPlus />
              </span>
              <span className="min-w-0 flex-1 break-words">{t('move.newFolder')}</span>
            </button>
          </div>
        </li>
      </ul>
    </SheetContent>
  )
}

/**
 * One place in Move to…: the toggle that opens a folder to the folders in it (or its room), its
 * tile and name, Here where everything stands now; a tap moves there.
 */
function PlaceRow({
  depth,
  tile,
  name,
  here,
  barred,
  onPick,
  toggle,
}: {
  depth: number
  tile: ReactNode
  name: string
  here: boolean
  /** Why it cannot be chosen: a folder moving into itself. */
  barred: string | null
  onPick: () => void
  toggle?: { open: boolean; onToggle: () => void; folder: ShelvedFolder }
}) {
  const { t } = useTranslation('songs')
  const nameOf = useFolderName()
  return (
    // Each level stands in by a step, no further than four: a phone keeps room for the name.
    <div className="flex items-center" style={{ paddingLeft: `${Math.min(depth, 4) * 1.25}rem` }}>
      {toggle ? (
        <button
          type="button"
          aria-expanded={toggle.open}
          aria-label={t(toggle.open ? 'move.collapse' : 'move.expand', {
            name: nameOf(toggle.folder),
          })}
          onClick={toggle.onToggle}
          className="grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted hover:text-foreground [&_svg]:size-5"
        >
          <ChevronRight
            aria-hidden
            className={cn('transition-transform duration-200 ease-out', toggle.open && 'rotate-90')}
          />
        </button>
      ) : (
        <span aria-hidden className="size-11 shrink-0" />
      )}
      <button
        type="button"
        // Here is no move, and a folder into itself none: both stay in sight, neither acts.
        aria-disabled={here || barred !== null || undefined}
        title={barred ?? undefined}
        onClick={here || barred ? undefined : onPick}
        className={cn(
          ROW,
          here && 'cursor-default hover:bg-transparent',
          barred && 'cursor-not-allowed opacity-50 hover:bg-transparent',
        )}
      >
        {tile}
        <span className="min-w-0 flex-1 break-words">{name}</span>{' '}
        {here ? (
          <span className="flex shrink-0 items-center gap-1 text-base font-medium text-muted-foreground">
            <Check aria-hidden className="size-4" />
            {t('move.here')}
          </span>
        ) : null}
      </button>
    </div>
  )
}
