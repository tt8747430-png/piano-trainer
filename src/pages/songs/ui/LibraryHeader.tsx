import { Link } from '@tanstack/react-router'
import {
  Archive,
  ArrowLeft,
  Ellipsis,
  FolderInput,
  ListChecks,
  Music,
  PencilLine,
  Trash2,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useFolderName, useLibraryLayout, type ShelvedFolder } from '@/entities/library'
import { ActionMenu, RoundButton, RoundLink, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { LibraryPage } from '../model/use-library-page'
import { ArchiveButton } from './ArchiveButton'

/**
 * The library's bar (Mindscape's): its title says where the learner is, Songs at Home, the folder's
 * name in one, with Back, which goes up a level, to the folder it stands in or Home, named so; then
 * Select and the archive's button, and a folder's More (Edit folder, New song here, Move to…, Archive
 * folder, Delete folder). While Select is on, the count chosen is its title, with Select all and
 * Done.
 */
export function LibraryHeader({
  page,
  folder,
}: {
  page: LibraryPage
  folder: ShelvedFolder | null
}) {
  const { t } = useTranslation('songs')
  const nameOf = useFolderName()
  const { folders } = useLibraryLayout()
  const { select } = page
  if (select.on)
    return (
      <ScreenHeader
        title={t('select.count', { count: select.count })}
        actions={
          <>
            <Button variant="ghost" onClick={select.toggleAll}>
              {t(select.all ? 'select.none' : 'select.all')}
            </Button>
            <Button variant="soft" onClick={select.exit}>
              {t('select.done')}
            </Button>
          </>
        }
      />
    )
  const name = folder ? nameOf(folder) : t('title')
  const above = folder?.parent ? folders.find((each) => each.id === folder.parent) : undefined
  return (
    <ScreenHeader
      title={name}
      back={
        folder ? (
          <RoundLink
            label={t('folder.up', { name: above ? nameOf(above) : t('title') })}
            icon={ArrowLeft}
            render={
              above ? (
                <Link to="/songs/folders/$folderId" params={{ folderId: above.id }} />
              ) : (
                <Link to="/songs" />
              )
            }
          />
        ) : undefined
      }
      crowded={folder !== null}
      actions={
        <>
          <RoundButton
            label={t('select.start')}
            icon={ListChecks}
            onClick={() => page.select.start()}
          />
          <ArchiveButton />
          {folder ? (
            <ActionMenu
              label={t('folder.more', { name })}
              align="end"
              trigger={<Ellipsis aria-hidden />}
              render={
                <Button
                  variant="surface"
                  size="icon"
                  className="rounded-full"
                  aria-label={t('folder.more', { name })}
                  title={t('folder.more', { name })}
                />
              }
              actions={[
                {
                  key: 'edit',
                  label: t('folder.edit'),
                  icon: PencilLine,
                  onSelect: () => page.open({ kind: 'folder', target: { kind: 'edit', folder } }),
                },
                {
                  key: 'new-song',
                  label: t('folder.newSong'),
                  icon: Music,
                  onSelect: () => page.open({ kind: 'new-song' }),
                },
                {
                  key: 'move',
                  label: t('library.moveTo'),
                  icon: FolderInput,
                  onSelect: () => page.moveOne({ songs: [], folders: [folder.id] }, name),
                },
                {
                  key: 'archive',
                  label: t('folder.archive'),
                  icon: Archive,
                  onSelect: () => {
                    page.leave()
                    page.acts.archiveFolder(folder)
                  },
                },
                {
                  key: 'delete',
                  label: t('folder.delete'),
                  icon: Trash2,
                  destructive: true,
                  onSelect: () => page.open({ kind: 'delete-folder', folder }),
                },
              ]}
            />
          ) : null}
        </>
      }
    />
  )
}
