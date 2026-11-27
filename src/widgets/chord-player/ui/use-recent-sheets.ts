import { useTranslation } from 'react-i18next'
import {
  IN_HAND,
  selectMine,
  selectRecent,
  selectScratchName,
  useChordSheets,
} from '@/entities/chord-sheet'
import type { MenuAction } from '@/shared/ui'

/**
 * The recent sheets as the name's menu lists them (R76): those opened last, the latest first, the one
 * open checked, the sheet in hand by the name it came with, else as Unsaved sheet. The Chord player
 * opens on the sheet last open, so the first is where it was left.
 */
export function useRecentSheets(
  sheetId: string | undefined,
  onOpen: (id: string | undefined) => void,
): MenuAction[] {
  const { t } = useTranslation('practice')
  const recent = useChordSheets(selectRecent)
  const mine = useChordSheets(selectMine)
  const scratchName = useChordSheets(selectScratchName)
  const open = sheetId ?? IN_HAND
  // The open sheet leads until it is marked opened; a recent sheet since deleted is left out.
  return [open, ...recent.filter((each) => each !== open)].flatMap((each): MenuAction[] => {
    // The sheet in hand is named for what it is, so it never reads as New sheet beside it.
    const named =
      each === IN_HAND
        ? (scratchName ?? t('chordPlayer.sheets.inHand'))
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
}
