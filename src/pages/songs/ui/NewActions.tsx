import { FileUp, FolderPlus, Music, Mic, Users } from 'lucide-react'
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
 * What New adds, each made where the learner is, in the folder open (`folder`) or at Home: New song,
 * Record, New folder, Import (a MusicXML or MIDI file, ADR 0107) and New group (R30 S6), each where
 * it may be done here (R29 B4): a learner's built-in folder has none. It adds, and only adds (Noji's
 * +): the Public library is a place, reached by its own row.
 */
function useNewActions({ page, folder, onImport }: Where): readonly MenuAction[] {
  const { t } = useTranslation('songs')
  const songs = page.may('addSong')
  return [
    ...(songs
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
    ...(page.may('addFolder')
      ? [
          {
            key: 'folder',
            label: t('folder.new'),
            icon: FolderPlus,
            onSelect: () => page.open({ kind: 'folder', target: { kind: 'new', parent: folder } }),
          },
        ]
      : []),
    ...(page.may('importSong')
      ? [{ key: 'import', label: t('import.action'), icon: FileUp, onSelect: onImport }]
      : []),
    {
      key: 'group',
      label: t('groups.new'),
      icon: Users,
      onSelect: () => page.open({ kind: 'new-group' }),
    },
  ]
}

/** New on a phone: the kit's dial. With nothing to add here, no +. */
export function NewActions(where: Where) {
  const { t } = useTranslation('songs')
  const actions = useNewActions(where)
  if (actions.length === 1) return null
  return <NewDial label={t('new')} actions={actions} />
}

/** New on a laptop: the kit's New ▾ at the bar's end. */
export function NewMenu(where: Where) {
  const { t } = useTranslation('songs')
  const actions = useNewActions(where)
  if (actions.length === 1) return null
  return <KitNewMenu label={t('new')} actions={actions} />
}
