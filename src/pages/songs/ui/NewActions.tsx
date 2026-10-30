import { FileUp, FolderPlus, Music, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { FolderId } from '@/entities/library'
import { FloatingActions, SpeedDial, SpeedDialAction } from '@/shared/ui'
import type { LibraryPage } from '../model/use-library-page'

/**
 * New, floating (Mindscape's `LibrarySpeedDial`): a dial of New song, New folder and Import (a
 * MusicXML or MIDI file, ADR 0107), each made where the learner is, in the folder open (`folder`) or
 * at Home. It adds, and only adds (Noji's +): the Public library is a place, reached by its own row
 * at the top of Home.
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
  return (
    <FloatingActions>
      <SpeedDial label={t('new')} icon={Plus} main>
        {/* The nearest last: a song is what is added most. */}
        <SpeedDialAction
          label={t('import.action')}
          detail={t('adds.import')}
          icon={FileUp}
          onClick={onImport}
        />
        <SpeedDialAction
          label={t('folder.new')}
          detail={t('adds.folder')}
          icon={FolderPlus}
          onClick={() => page.open({ kind: 'folder', target: { kind: 'new', parent: folder } })}
        />
        <SpeedDialAction
          label={t('newSong')}
          detail={t('adds.song')}
          icon={Music}
          onClick={() => page.open({ kind: 'new-song' })}
        />
      </SpeedDial>
    </FloatingActions>
  )
}
