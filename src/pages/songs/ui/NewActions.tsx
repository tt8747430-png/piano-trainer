import { FolderPlus, Music, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Fab, FloatingActions, SpeedDial, SpeedDialAction } from '@/shared/ui'
import type { LibraryPage } from '../model/use-library-page'

/**
 * New, floating (Mindscape's `LibrarySpeedDial`): at Home a dial of New song and New folder; in a
 * folder New song alone, made in it.
 */
export function NewActions({ page, inFolder }: { page: LibraryPage; inFolder: boolean }) {
  const { t } = useTranslation('songs')
  return (
    <FloatingActions>
      {inFolder ? (
        <Fab
          label={t('newSong')}
          icon={Plus}
          extended
          onClick={() => page.open({ kind: 'new-song' })}
        />
      ) : (
        <SpeedDial label={t('new')} icon={Plus}>
          <SpeedDialAction
            label={t('folder.new')}
            icon={FolderPlus}
            onClick={() => page.open({ kind: 'folder', target: { kind: 'new' } })}
          />
          <SpeedDialAction
            label={t('newSong')}
            icon={Music}
            onClick={() => page.open({ kind: 'new-song' })}
          />
        </SpeedDial>
      )}
    </FloatingActions>
  )
}
