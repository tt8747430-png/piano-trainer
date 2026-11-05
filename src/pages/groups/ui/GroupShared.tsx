import { Link } from '@tanstack/react-router'
import { FolderPlus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FOLDER_PICTURE_ICONS,
  useFolderName,
  useLibraryLayout,
  type ShelvedFolder,
} from '@/entities/library'
import { groupTile, ShareFolderSheet, useFolderShare } from '@/features/share-folder'
import type { LearnerGroup, SharedFolder } from '@/shared/api/groups'
import { RowButton, RowLink, SettingsGroup, Sheet, SheetContent } from '@/shared/ui'

/**
 * What is shared with a group (R32-C): each folder a row to its page (its picture on its paint, its
 * name, View only or Can edit, its songs, and who shared it); then Share a folder…, which lists the
 * learner's folders and opens Share with a group for the one chosen.
 */
export function GroupShared({
  group,
  shared,
  onChanged,
}: {
  group: LearnerGroup
  shared: readonly SharedFolder[]
  onChanged: () => void
}) {
  const { t } = useTranslation('songs')
  const [choosing, setChoosing] = useState(false)
  const [sharing, setSharing] = useState<ShelvedFolder | null>(null)
  const shareOf = useFolderShare()
  return (
    <SettingsGroup flush title={t('groups.sharedHere')}>
      {shared.length === 0 ? (
        <p className="px-4 py-3 text-pretty text-muted-foreground">{t('groups.nothingShared')}</p>
      ) : (
        shared.map((folder) => (
          <RowLink
            key={folder.id}
            {...groupTile(folder)}
            title={folder.name}
            detail={[
              t(folder.canEdit ? 'groups.mayEdit' : 'groups.viewOnly'),
              t('folder.songCount', { count: folder.songs.length }),
              folder.mine
                ? t('groups.yours', { group: group.name })
                : t('groups.sharedBy', { name: folder.ownerName, group: group.name }),
            ].join(' · ')}
            render={<Link to="/songs/shared-folders/$sharedId" params={{ sharedId: folder.id }} />}
          />
        ))
      )}
      <RowButton
        icon={FolderPlus}
        paint="grass"
        title={t('groups.shareFolder')}
        onClick={() => setChoosing(true)}
      />
      <ChooseFolderSheet
        open={choosing}
        onOpenChange={setChoosing}
        onChoose={(folder) => {
          setChoosing(false)
          setSharing(folder)
        }}
      />
      {sharing ? (
        <ShareFolderSheet
          open
          onOpenChange={(open) => {
            if (open) return
            setSharing(null)
            onChanged()
          }}
          folder={shareOf(sharing)}
        />
      ) : null}
    </SettingsGroup>
  )
}

/** The learner's folders, one to share: each its picture on its paint and its name. */
function ChooseFolderSheet({
  open,
  onOpenChange,
  onChoose,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onChoose: (folder: ShelvedFolder) => void
}) {
  const { t } = useTranslation('songs')
  const { folders } = useLibraryLayout()
  const nameOf = useFolderName()
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t('groups.chooseFolder')}>
        {folders.length === 0 ? (
          <p className="text-pretty text-muted-foreground">{t('groups.noFolders')}</p>
        ) : (
          <SettingsGroup flush>
            {folders.map((folder) => (
              <RowButton
                key={folder.id}
                icon={FOLDER_PICTURE_ICONS[folder.picture]}
                paint={folder.paint}
                title={nameOf(folder)}
                detail={t('folder.songCount', { count: folder.songs.length })}
                onClick={() => onChoose(folder)}
              />
            ))}
          </SettingsGroup>
        )}
      </SheetContent>
    </Sheet>
  )
}
