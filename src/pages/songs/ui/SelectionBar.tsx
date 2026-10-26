import { Archive, FolderInput, Heart, HeartOff, Trash2, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FloatingActions } from '@/shared/ui'
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
          ? 'h-14 min-w-16 flex-col gap-0.5 rounded-2xl px-2 text-xs text-destructive'
          : 'h-14 min-w-16 flex-col gap-0.5 rounded-2xl px-2 text-xs'
      }
    >
      <Icon aria-hidden className="size-5" />
      {label}
    </Button>
  )
}

/**
 * Select's bar at the foot (Mindscape's `SelectToolbar`), floating where the screen's actions float:
 * Favourite for the songs chosen, Move and Archive for every row chosen (folders with all they
 * hold), and Delete where everything chosen can be deleted
 * (the learner's own songs, and folders). Its slots stay put as rows are chosen: one that cannot act
 * on the choice is greyed, never taken away.
 */
export function SelectionBar({ page }: { page: LibraryPage }) {
  const { t } = useTranslation('songs')
  const { select } = page
  const noSongs = select.songs.length === 0
  return (
    <FloatingActions>
      <div
        role="toolbar"
        aria-label={t('select.actions')}
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
          label={t('select.archive')}
          icon={Archive}
          onClick={select.archive}
          disabled={select.count === 0}
        />
        {select.deletable ? (
          <BarAction
            label={t('select.delete')}
            icon={Trash2}
            onClick={select.delete}
            disabled={false}
            destructive
          />
        ) : null}
      </div>
    </FloatingActions>
  )
}
