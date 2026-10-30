import { useNavigate } from '@tanstack/react-router'
import { FileUp, FolderPlus, Globe, Music, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { FolderId } from '@/entities/library'
import { FloatingActions, SpeedDial, SpeedDialAction } from '@/shared/ui'
import type { LibraryPage } from '../model/use-library-page'

/**
 * New, floating (Mindscape's `LibrarySpeedDial`): a dial of New song, New folder and Import (a
 * MusicXML or MIDI file, ADR 0107), each made where the learner is, in the folder open (`folder`) or
 * at Home; and the Public library, where a song another learner shared is saved.
 */
export function NewActions({
  page,
  folder,
  onImport,
}: {
  page: LibraryPage
  folder: FolderId | null
  onImport: () => void
}) {
  const { t } = useTranslation('songs')
  const navigate = useNavigate()
  return (
    <FloatingActions>
      <SpeedDial label={t('new')} icon={Plus}>
        <SpeedDialAction
          label={t('folder.new')}
          icon={FolderPlus}
          onClick={() => page.open({ kind: 'folder', target: { kind: 'new', parent: folder } })}
        />
        <SpeedDialAction
          label={t('newSong')}
          icon={Music}
          onClick={() => page.open({ kind: 'new-song' })}
        />
        <SpeedDialAction label={t('import.action')} icon={FileUp} onClick={onImport} />
        <SpeedDialAction
          label={t('public.title')}
          icon={Globe}
          onClick={() => void navigate({ to: '/songs/public' })}
        />
      </SpeedDial>
    </FloatingActions>
  )
}
