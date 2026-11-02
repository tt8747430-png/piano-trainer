import {
  Archive,
  Download,
  FolderInput,
  FolderOutput,
  Heart,
  HeartOff,
  Trash2,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useFolderName, type ShelvedFolder } from '@/entities/library'
import { FloatingActions } from '@/shared/ui'
import { DropZone, useCarrying } from '@/widgets/song-library'
import { Button } from '@/shared/ui/primitives/button'
import type { LibraryPage } from '../model/use-library-page'

/** One of the bar's actions: its icon over its name, greyed while nothing chosen can take it. */
function BarAction({
  label,
  icon: Icon,
  onClick,
  disabled,
  destructive = false,
}: {
  label: string
  icon: LucideIcon
  onClick: () => void
  disabled: boolean
  destructive?: boolean
}) {
  return (
    <Button
      variant="ghost"
      disabled={disabled}
      onClick={onClick}
      className={
        destructive
          ? 'h-14 min-w-13 flex-col gap-0.5 rounded-2xl px-1 text-xs text-destructive sm:min-w-16'
          : 'h-14 min-w-13 flex-col gap-0.5 rounded-2xl px-1 text-xs sm:min-w-16'
      }
    >
      <Icon aria-hidden className="size-5" />
      {label}
    </Button>
  )
}

/**
 * Select's bar at the foot (Mindscape's `SelectToolbar`), floating where the screen's actions float:
 * Favourite and Export… for the songs chosen, Move and Archive for every row chosen (folders with all they
 * hold), and Delete where everything chosen can be deleted (the learner's own songs, and folders).
 * Its slots stay put as rows are chosen: one that cannot act on the choice is greyed, never taken
 * away. While a row's face is carried, the bar is where it drops: Archive, and in a folder, out to
 * the place the folder stands in (iOS Files').
 */
export function SelectionBar({
  page,
  folder,
}: {
  page: LibraryPage
  /** The folder open: what is carried may go out of it, to the place it stands in. */
  folder: ShelvedFolder | null
}) {
  const { t } = useTranslation('songs')
  const nameOf = useFolderName()
  const carrying = useCarrying()
  const { select } = page
  const noSongs = select.songs.length === 0
  if (carrying) {
    const parent = folder?.parent
      ? page.layout.folders.find((each) => each.id === folder.parent)
      : undefined
    return (
      <FloatingActions>
        <div
          role="group"
          aria-label={t('drag.zones')}
          data-takes-tab-bar=""
          className="flex w-[min(24rem,calc(100vw-2rem))] gap-1 rounded-3xl border border-border bg-raised p-1 elevation-3"
        >
          {folder ? (
            <DropZone
              zone="out"
              label={t('drag.moveOut', {
                place: parent ? nameOf(parent) : t('library.home'),
              })}
              icon={FolderOutput}
            />
          ) : null}
          <DropZone zone="archive" label={t('drag.archive')} icon={Archive} />
        </div>
      </FloatingActions>
    )
  }
  return (
    <FloatingActions>
      <div
        role="toolbar"
        aria-label={t('select.actions')}
        // Select's bar takes the phone's tab bar's place (memory-palaces'): one bar at the foot.
        data-takes-tab-bar=""
        className="flex gap-1 rounded-3xl border border-border bg-raised p-1 elevation-3"
      >
        <BarAction
          label={t(select.allFavourite ? 'select.unfavourite' : 'select.favourite')}
          icon={select.allFavourite ? HeartOff : Heart}
          onClick={select.favourite}
          disabled={noSongs}
        />
        <BarAction
          label={t('select.move')}
          icon={FolderInput}
          onClick={select.move}
          disabled={select.count === 0}
        />
        <BarAction
          label={t('select.export')}
          icon={Download}
          onClick={select.export}
          disabled={noSongs}
        />
        <BarAction
          label={t('select.archive')}
          icon={Archive}
          onClick={select.archive}
          disabled={select.count === 0}
        />
        <BarAction
          label={t('select.delete')}
          icon={Trash2}
          onClick={select.delete}
          disabled={!select.deletable}
          destructive
        />
      </div>
    </FloatingActions>
  )
}
