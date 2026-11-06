import { FileUp, FolderPlus, Music, Plus, Mic, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { FolderId } from '@/entities/library'
import { FloatingActions, SpeedDial, SpeedDialAction } from '@/shared/ui'
import type { LibraryPage } from '../model/use-library-page'

/**
 * New, floating (Mindscape's `LibrarySpeedDial`): a dial of New song, Record, New folder, Import (a
 * MusicXML or MIDI file, ADR 0107) and New group (R30 S6), each made where the learner is, in the folder open (`folder`) or
 * at Home. It adds, and only adds (Noji's +): the Public library is a place, reached by its own row
 * at the top of Home. Each where it may be done here (R29 B4): a learner's built-in folder has none,
 * and so no +.
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
  const importing = page.may('importSong')
  const folders = page.may('addFolder')
  const songs = page.may('addSong')
  if (!importing && !folders && !songs) return null
  return (
    <FloatingActions>
      <SpeedDial label={t('new')} icon={Plus} main>
        {/* The nearest last: a song is what is added most; a group, to share folders with (R30 S6). */}
        <SpeedDialAction
          label={t('groups.new')}
          icon={Users}
          onClick={() => page.open({ kind: 'new-group' })}
        />
        {importing ? (
          <SpeedDialAction label={t('import.action')} icon={FileUp} onClick={onImport} />
        ) : null}
        {folders ? (
          <SpeedDialAction
            label={t('folder.new')}
            icon={FolderPlus}
            onClick={() => page.open({ kind: 'folder', target: { kind: 'new', parent: folder } })}
          />
        ) : null}
        {songs ? (
          <SpeedDialAction
            label={t('recordSong')}
            icon={Mic}
            onClick={() => page.open({ kind: 'new-song', record: true })}
          />
        ) : null}
        {songs ? (
          <SpeedDialAction
            label={t('newSong')}
            icon={Music}
            onClick={() => page.open({ kind: 'new-song' })}
          />
        ) : null}
      </SpeedDial>
    </FloatingActions>
  )
}
