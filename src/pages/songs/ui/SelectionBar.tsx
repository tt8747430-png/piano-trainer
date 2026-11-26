import { Fragment, type ReactNode } from 'react'
import { BAR_CATALOG, barOf, useSettings, type BarAct } from '@/entities/settings'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { Archive, Ellipsis, Folder, FolderOutput, Heart, Trash2, Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useFolderName, type ShelvedFolder } from '@/entities/library'
import { FloatingActions, SelectAct, SelectDock } from '@/shared/ui'
import { DropZone, useCarrying } from '@/widgets/song-library'
import { Button } from '@/shared/ui/primitives/button'
import type { LibraryPage } from '../model/use-library-page'

/**
 * Select's bar at the foot (R72's SELBAR, a glass dock in New's place): by default Add to folder,
 * Favourite and Archive (the learner's own choice in Settings › Select toolbar, the rest under More);
 * Favourite and Export… act on the songs chosen, Add to folder and Archive on every row chosen (folders
 * with all they hold), Delete where everything chosen can be deleted.
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
      <SelectAct
        label={t(select.allFavourite ? 'select.unfavourite' : 'select.favourite')}
        icon={Heart}
        onClick={select.favourite}
        disabled={noSongs}
      />
    ),
    move: page.may('moveOut') ? (
      <SelectAct
        label={t('select.move')}
        icon={Folder}
        onClick={select.move}
        disabled={!select.movable}
      />
    ) : null,
    export: (
      <SelectAct
        label={t('select.export')}
        icon={Upload}
        onClick={select.export}
        disabled={noSongs}
      />
    ),
    archive: (
      <SelectAct
        label={t('select.archive')}
        icon={Archive}
        onClick={select.archive}
        disabled={!select.archivable}
        destructive
      />
    ),
    delete: page.may('deleteSong') ? (
      <SelectAct
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
          className="flex w-[min(24rem,calc(100vw-2rem))] gap-1 rounded-card border border-border bg-raised p-1 elevation-float"
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
    <SelectDock label={t('select.actions')}>
      {shown.map((act) => (
        <Fragment key={act}>{acts[act]}</Fragment>
      ))}
      {rest.length > 0 ? (
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="ghost"
                className="h-13 min-w-0 flex-1 flex-col gap-0.5 px-1 text-xs font-semibold"
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
            className="glass flex w-auto gap-2 rounded-pill px-2 py-2"
          >
            {rest.map((act) => (
              <Fragment key={act}>{acts[act]}</Fragment>
            ))}
          </PopoverContent>
        </Popover>
      ) : null}
    </SelectDock>
  )
}
