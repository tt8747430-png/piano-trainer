import { FolderPlus, Music, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { FolderId } from '@/entities/library'
import { FloatingActions, SpeedDial, SpeedDialAction } from '@/shared/ui'
import type { LibraryPage } from '../model/use-library-page'

/**
 * New, floating (Mindscape's `LibrarySpeedDial`): a dial of New song and New folder, each made where
 * the learner is, in the folder open (`folder`) or at Home.
 */
export function NewActions({ page, folder }: { page: LibraryPage; folder: FolderId | null }) {
  const { t } = useTranslation('songs')
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
      </SpeedDial>
    </FloatingActions>
  )
}
