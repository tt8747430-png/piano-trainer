import { Fragment, type ReactNode } from 'react'
import { BAR_CATALOG, barOf, useSettings, type BarAct } from '@/entities/settings'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import {
  Archive,
  Download,
  Ellipsis,
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
          ? 'h-14 min-w-13 flex-col gap-0.5 rounded-control px-1 text-xs text-destructive sm:min-w-16'
          : 'h-14 min-w-13 flex-col gap-0.5 rounded-control px-1 text-xs sm:min-w-16'
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
 * away; one the place never allows (a learner's built-in folder: Move and Delete, R29 B4) is not
 * there. While a row's face is carried, the bar is where it drops: Archive, and in a folder, out to
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
  // The learner's bar (R29 B10, Settings › Select toolbar), the rest under More.
  const chosen = useSettings((state) => barOf(state.bars, 'select.songs'))
  const acts: Partial<Record<BarAct, ReactNode>> = {
    favourite: (
      <BarAction
        label={t(select.allFavourite ? 'select.unfavourite' : 'select.favourite')}
        icon={select.allFavourite ? HeartOff : Heart}
        onClick={select.favourite}
        disabled={noSongs}
      />
    ),
    move: page.may('moveOut') ? (
      <BarAction
        label={t('select.move')}
        icon={FolderInput}
        onClick={select.move}
        disabled={!select.movable}
      />
    ) : null,
    export: (
      <BarAction
        label={t('select.export')}
        icon={Download}
        onClick={select.export}
        disabled={noSongs}
      />
    ),
    archive: (
      <BarAction
        label={t('select.archive')}
        icon={Archive}
        onClick={select.archive}
        disabled={!select.archivable}
      />
    ),
    delete: page.may('deleteSong') ? (
      <BarAction
        label={t('select.delete')}
        icon={Trash2}
        onClick={select.delete}
        disabled={!select.deletable}
        destructive
      />
    ) : null,
  }
  // What the place never allows is not there at all (R29 B4), in the bar or under More.
  const allowed = (act: BarAct) => acts[act] != null
  const shown = chosen.filter(allowed)
  const rest = BAR_CATALOG['select.songs'].filter((act) => !chosen.includes(act) && allowed(act))
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
          className="flex w-[min(24rem,calc(100vw-2rem))] gap-1 rounded-card border border-border bg-raised p-1 elevation-3"
        >
          {folder && page.may('moveOut') ? (
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
        className="flex gap-1 rounded-card border border-border bg-raised p-1 elevation-3"
      >
        {shown.map((act) => (
          <Fragment key={act}>{acts[act]}</Fragment>
        ))}
        {rest.length > 0 ? (
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="ghost"
                  className="h-14 min-w-13 flex-col gap-0.5 rounded-control px-1 text-xs sm:min-w-16"
                />
              }
            >
              <Ellipsis aria-hidden className="size-5" />
              {t('select.more')}
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="end"
              aria-label={t('select.more')}
              className="flex w-auto gap-1 p-1"
            >
              {rest.map((act) => (
                <Fragment key={act}>{acts[act]}</Fragment>
              ))}
            </PopoverContent>
          </Popover>
        ) : null}
      </div>
    </FloatingActions>
  )
}
