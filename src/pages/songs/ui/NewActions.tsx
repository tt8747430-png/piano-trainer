import { FileUp, FolderPlus, Music, Plus, Mic, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { FolderId } from '@/entities/library'
import {
  ActionMenu,
  FloatingActions,
  SpeedDial,
  SpeedDialAction,
  type MenuAction,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
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

/**
 * New on a phone (Mindscape's `LibrarySpeedDial`): the floating +, its dial with the song nearest the
 * thumb. With nothing to add here, no +.
 */
export function NewActions(where: Where) {
  const { t } = useTranslation('songs')
  const actions = useNewActions(where)
  if (actions.length === 1) return null
  return (
    <FloatingActions>
      <SpeedDial label={t('new')} icon={Plus} main>
        {actions.toReversed().map((action) => (
          <SpeedDialAction
            key={action.key}
            label={action.label}
            icon={action.icon ?? Plus}
            onClick={action.onSelect}
          />
        ))}
      </SpeedDial>
    </FloatingActions>
  )
}

/**
 * New on a laptop (canvas R39-1): the same actions as a menu at the bar's end, since a floating +
 * would cover the table's last rows.
 */
export function NewMenu(where: Where) {
  const { t } = useTranslation('songs')
  const actions = useNewActions(where)
  if (actions.length === 1) return null
  return (
    <ActionMenu
      label={t('new')}
      align="end"
      trigger={
        <>
          <Plus aria-hidden />
          {t('new')}
        </>
      }
      render={<Button />}
      actions={actions}
    />
  )
}
