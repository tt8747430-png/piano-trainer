import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { IN_HAND, selectMine, selectRecent, useChordSheets } from '@/entities/chord-sheet'
import { ActionMenu, type MenuAction } from '@/shared/ui'

/**
 * The sheet's name over the chart, a menu of the recent sheets (canvas R76's SHEETS76): those opened
 * last, the latest first, the one open checked, the sheet in hand as Unsaved sheet; then New sheet and All
 * chord sheets. The Chord player opens on the sheet last open, so the first is where it was left.
 */
export function SheetsMenu({
  name,
  sheetId,
  onOpen,
  onNew,
  onAll,
}: {
  /** The open sheet's name. */
  name: string
  /** One of My chord sheets open, or the sheet in hand (none). */
  sheetId: string | undefined
  onOpen(id: string | undefined): void
  onNew(): void
  onAll(): void
}) {
  const { t } = useTranslation('practice')
  const recent = useChordSheets(selectRecent)
  const mine = useChordSheets(selectMine)
  const open = sheetId ?? IN_HAND
  // The open sheet leads until it is marked opened; a recent sheet since deleted is left out.
  const listed = [open, ...recent.filter((each) => each !== open)].flatMap((each): MenuAction[] => {
    // The sheet in hand is named for what it is, so it never reads as New sheet beside it.
    const named =
      each === IN_HAND
        ? t('chordPlayer.sheets.inHand')
        : mine.find((sheet) => sheet.id === each)?.name
    if (named === undefined) return []
    return [
      {
        key: each,
        label: named,
        checked: each === open,
        onSelect: () => onOpen(each === IN_HAND ? undefined : each),
      },
    ]
  })
  return (
    <ActionMenu
      label={t('chordPlayer.sheets.menu')}
      render={
        <button
          type="button"
          aria-label={t('chordPlayer.sheets.open', { name })}
          className="-my-1.5 flex h-11 min-w-0 items-center gap-1 rounded-control text-foreground transition-opacity duration-150 ease-out hover:opacity-80"
        />
      }
      trigger={
        <>
          <span className="min-w-0 truncate font-sans text-[22px] font-semibold">{name}</span>
          <ChevronDown aria-hidden className="size-5 shrink-0 text-muted-foreground" />
        </>
      }
      actions={[
        ...listed,
        { key: 'new', label: t('chordPlayer.sheets.new'), onSelect: onNew },
        { key: 'all', label: t('chordPlayer.sheets.all'), onSelect: onAll },
      ]}
    />
  )
}
