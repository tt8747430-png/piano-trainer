import { Link } from '@tanstack/react-router'
import { Ellipsis, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  libraryCatalog,
  useLibraryLayout,
  useLibraryStoreApi,
  type ShelvedEntry,
  type ShelvedFolder,
} from '@/entities/library'
import { isOwnSongId, useRepertoire } from '@/entities/piece'
import { DeleteFolderAsk, restoreAll, useLibraryActs } from '@/features/manage-library'
import {
  ActionMenu,
  BackButton,
  GROUPED_LIST,
  RowLink,
  say,
  ScreenHeader,
  SettingsGroup,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ArchiveEmpty } from './ArchiveEmpty'
import { ArchivedRow } from './ArchivedRow'

/** An entry's key: a song's or a folder's, by its id. */
const keyOf = (entry: ShelvedEntry) =>
  entry.kind === 'song' ? `song:${entry.id}` : `folder:${entry.folder.id}`

/**
 * The archive (ADR 0106, Mindscape's `ArchivedDecksPage` and its ADR 0038, the archive is a place;
 * canvas 133): Restore all under its bar; what was archived, the newest first, in one card, folders
 * with their songs counted and songs, each with Restore, and its More with Delete for the learner's
 * own song (to the Trash, with Undo, R34) or folder (asked first); empty, it says what it is for. The
 * Trash lives inside it, a row under Deleted songs.
 */
export function ArchivePage() {
  const { t } = useTranslation('songs')
  const layout = useLibraryLayout()
  const store = useLibraryStoreApi()
  const repertoire = useRepertoire()
  const acts = useLibraryActs()
  const [deletingFolder, setDeletingFolder] = useState<ShelvedFolder | null>(null)
  const { archive, trash } = layout
  return (
    <div className="flex flex-col gap-6 pb-4">
      <ScreenHeader title={t('archive.title')} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        {archive.length === 0 ? (
          <ArchiveEmpty />
        ) : (
          <div className="flex flex-col gap-3">
            <Button
              variant="bar"
              className="self-start"
              onClick={() => {
                restoreAll(store, libraryCatalog(repertoire))
                say(t('archive.restoredAll'))
              }}
            >
              {t('archive.restoreAll')}
            </Button>
            <ul aria-label={t('archive.title')} className={GROUPED_LIST}>
              {archive.map((entry) => {
                const own = entry.kind === 'song' ? isOwnSongId(entry.id) : !entry.folder.builtIn
                return (
                  <ArchivedRow
                    key={keyOf(entry)}
                    entry={entry}
                    onRestore={() =>
                      entry.kind === 'song'
                        ? acts.restore([entry.id])
                        : acts.restoreFolder(entry.folder)
                    }
                    more={
                      own ? (
                        <ActionMenu
                          label={t('library.more')}
                          align="end"
                          trigger={<Ellipsis aria-hidden />}
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-pill"
                              aria-label={t('library.more')}
                              title={t('library.more')}
                            />
                          }
                          actions={[
                            {
                              key: 'delete',
                              label: t('library.delete'),
                              icon: Trash2,
                              destructive: true,
                              onSelect: () =>
                                entry.kind === 'song'
                                  ? acts.trash([entry.id])
                                  : setDeletingFolder(entry.folder),
                            },
                          ]}
                        />
                      ) : null
                    }
                  />
                )
              })}
            </ul>
          </div>
        )}
        <SettingsGroup flush title={t('archive.deleted')}>
          <RowLink
            title={t('trash.title')}
            value={trash.length > 0 ? t('folder.songCount', { count: trash.length }) : undefined}
            render={<Link to="/songs/trash" />}
          />
        </SettingsGroup>
      </div>
      <DeleteFolderAsk
        folder={deletingFolder}
        onOpenChange={(open) => (open ? undefined : setDeletingFolder(null))}
      />
    </div>
  )
}
