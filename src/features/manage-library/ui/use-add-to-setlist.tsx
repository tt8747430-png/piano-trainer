import { ListPlus } from 'lucide-react'
import { useState, type ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import type { PieceId } from '@/entities/piece'
import type { MenuAction } from '@/shared/ui'
import { AddToSetlistSheet } from './AddToSetlistSheet'

/**
 * Add to setlist for a page's More (a song's page, the Player's): the menu's action, and the sheet it
 * opens, which the page puts beside its own.
 */
export function useAddToSetlist(piece: PieceId): { action: MenuAction; sheet: ReactElement } {
  const { t } = useTranslation('songs')
  const [open, setOpen] = useState(false)
  return {
    action: {
      key: 'setlist',
      label: t('library.addToSetlist'),
      icon: ListPlus,
      onSelect: () => setOpen(true),
    },
    sheet: <AddToSetlistSheet piece={piece} open={open} onOpenChange={setOpen} />,
  }
}
