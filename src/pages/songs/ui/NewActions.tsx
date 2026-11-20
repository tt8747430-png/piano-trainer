import { FileUp, ListPlus, Music, Mic } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { FolderId } from '@/entities/library'
import { NewDial, NewMenu as KitNewMenu, type MenuAction } from '@/shared/ui'
import type { LibraryPage } from '../model/use-library-page'

interface Where {
  page: LibraryPage
  folder: FolderId | null
  onImport: () => void
}

/**
 * What New adds, the same rows on every Songs page (the Songs board's one New, canvas v390): New song,
 * Record, Import (a MusicXML or MIDI file, ADR 0107) and New playlist, each made where the learner is (in
 * the playlist open, `folder`, or at Home) and each only where it may be done here: a built-in
 * playlist takes no new one. It adds, and only adds: Explore is a place, and a group is made on Groups.
 */
export function useNewActions({ page, folder, onImport }: Where): readonly MenuAction[] {
  const { t } = useTranslation('songs')
  return [
    ...(page.may('addSong')
      ? [
          {
            key: 'song',
            label: t('newSong'),
            icon: Music,
            onSelect: () => page.open({ kind: 'new-song' }),
          },
          {
            key: 'record',
            label: t('recordSong'),
            icon: Mic,
            onSelect: () => page.open({ kind: 'new-song', record: true }),
          },
        ]
      : []),
    ...(page.may('importSong')
      ? [{ key: 'import', label: t('import.action'), icon: FileUp, onSelect: onImport }]
      : []),
    ...(page.may('addFolder')
      ? [
          {
            key: 'folder',
            label: t('folder.new'),
            icon: ListPlus,
            onSelect: () => page.open({ kind: 'folder', target: { kind: 'new', parent: folder } }),
          },
        ]
      : []),
  ]
}

/** New on a phone: the kit's dial at the bottom right, its card of rows above it. With nothing to add here, no +. */
export function NewActions(where: Where) {
  const { t } = useTranslation('songs')
  const actions = useNewActions(where)
  if (actions.length === 0) return null
  return <NewDial label={t('new')} actions={actions} />
}

/** New on a laptop: the kit's New ▾ at the bar's end. */
export function NewMenu(where: Where) {
  const { t } = useTranslation('songs')
  const actions = useNewActions(where)
  if (actions.length === 0) return null
  return <KitNewMenu label={t('new')} actions={actions} />
}
