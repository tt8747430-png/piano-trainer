import { Archive, ArchiveRestore, FolderInput } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { placeIn, useLibraryLayout } from '@/entities/library'
import { entryTitles, type Entry } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import type { MenuAction } from '@/shared/ui'
import { MoveSheet } from './MoveSheet'
import { useLibraryActs } from './use-library-acts'

/**
 * A song's place in the library as a menu's actions (the song's page's More, the Player's, ADR
 * 0106): Move to… and Archive, each saying so in a toast with Undo; while it is archived, Restore
 * alone. The Move sheet comes with them, for the page to place.
 */
export function useSongActions(entry: Entry): {
  readonly actions: readonly MenuAction[]
  readonly sheet: ReactNode
} {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  const layout = useLibraryLayout()
  const acts = useLibraryActs()
  const [moving, setMoving] = useState(false)
  const archived = placeIn(layout, entry.id) === 'archived'
  const actions: MenuAction[] = archived
    ? [
        {
          key: 'restore',
          label: t('library.restore'),
          icon: ArchiveRestore,
          onSelect: () => acts.restore([entry.id]),
        },
      ]
    : [
        {
          key: 'move',
          label: t('library.moveTo'),
          icon: FolderInput,
          onSelect: () => setMoving(true),
        },
        {
          key: 'archive',
          label: t('library.archive'),
          icon: Archive,
          onSelect: () => acts.archive([entry.id]),
        },
      ]
  return {
    actions,
    sheet: (
      <MoveSheet
        moving={moving ? { songs: [entry.id], folders: [] } : null}
        what={entryTitles(entry, locale).primary}
        onOpenChange={setMoving}
      />
    ),
  }
}
