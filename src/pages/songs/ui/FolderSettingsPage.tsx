import { useForgetScreens } from '@/shared/lib'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { Archive, FolderInput, LayoutGrid, Users } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useFolderName,
  useLibraryLayout,
  usePermissions,
  type ShelvedFolder,
} from '@/entities/library'
import { DeleteFolderAsk, MoveSheet, useLibraryActs, type Moving } from '@/features/manage-library'
import { ShareFolderSheet, useFolderShare, useGroupsData } from '@/features/share-folder'
import {
  BackButton,
  ButtonLink,
  DangerGroup,
  DangerRow,
  NotFound,
  RowButton,
  RowLink,
  ScreenHeader,
  SettingsGroup,
} from '@/shared/ui'

/**
 * A folder's Settings (R29, the owner's yes to ST17; a song's Settings page's shape): how its rows
 * look (its name and look are edited in place, its ✎ beside its name), where it stands (Move to folder…), Archive folder, and Delete folder at
 * the page's foot. Reached from the gear in the folder's bar, where its ⋯ menu was. Each row where it
 * may be done (R29 B4): a built-in folder is the catalog's, so Move to folder… alone.
 */
export function FolderSettingsPage() {
  const { t } = useTranslation('songs')
  const { folderId } = useParams({ from: '/shell/songs/folders/$folderId/settings' })
  const { folders } = useLibraryLayout()
  const folder = folders.find((each) => each.id === folderId)
  if (!folder)
    return (
      <NotFound>
        <ButtonLink render={<Link to="/songs" />}>{t('title')}</ButtonLink>
      </NotFound>
    )
  return <FolderSettings folder={folder} />
}

function FolderSettings({ folder }: { folder: ShelvedFolder }) {
  const { t } = useTranslation('songs')
  const nameOf = useFolderName()
  const { folders } = useLibraryLayout()
  const acts = useLibraryActs()
  const permits = usePermissions()
  const may = (act: 'archiveFolder' | 'deleteFolder') => permits(act, { builtIn: folder.builtIn })
  const navigate = useNavigate()
  const [moving, setMoving] = useState<Moving | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [sharing, setSharing] = useState(false)
  const shareOf = useFolderShare()
  const { data: groups } = useGroupsData()
  const shares =
    groups.kind === 'ready'
      ? groups.shared.filter((each) => each.mine && each.folderKey === folder.id).length
      : 0
  const forget = useForgetScreens()
  const name = nameOf(folder)
  const above = folder.parent ? folders.find((each) => each.id === folder.parent) : undefined
  // Out of the library (archived or deleted): to where it stood, its folder or Home.
  const leave = () => {
    // Its screens are gone for Back too: the folder's page and its Settings.
    forget(`/songs/folders/${folder.id}`)
    return above
      ? navigate({ to: '/songs/folders/$folderId', params: { folderId: above.id }, replace: true })
      : navigate({ to: '/songs', replace: true })
  }
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('folder.settings')} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        <p className="px-1 font-display text-2xl font-semibold text-balance">{name}</p>
        {/* Its name and look, then how its rows look (R29 B9): the card style the learner's own, in a
            built-in folder too. */}
        {/* Shared with a group (R30 S6): the groups that have it, a sheet to tick them. */}
        <SettingsGroup flush title={t('groups.title')}>
          <RowButton
            title={t('groups.share')}
            value={shares > 0 ? t('groups.shareCount', { count: shares }) : undefined}
            icon={Users}
            paint="sky"
            onClick={() => setSharing(true)}
          />
        </SettingsGroup>
        <SettingsGroup flush title={t('folder.appearance')}>
          <RowLink
            render={
              <Link to="/songs/folders/$folderId/card-style" params={{ folderId: folder.id }} />
            }
            icon={LayoutGrid}
            paint="yellow"
            title={t('cardStyle.title')}
          />
        </SettingsGroup>
        <SettingsGroup flush title={t('folder.inLibrary')}>
          <RowButton
            title={t('folder.moveTo')}
            value={above ? nameOf(above) : t('title')}
            icon={FolderInput}
            paint="grass"
            onClick={() => setMoving({ songs: [], folders: [folder.id] })}
          />
          {may('archiveFolder') ? (
            <RowButton
              title={t('folder.archive')}
              icon={Archive}
              paint="lilac"
              onClick={async () => {
                if (await acts.archiveFolder(folder)) void leave()
              }}
            />
          ) : null}
        </SettingsGroup>
        {may('deleteFolder') ? (
          <DangerGroup footnote={t('folder.deleteSays')}>
            <DangerRow title={t('folder.delete')} onClick={() => setDeleting(true)} />
          </DangerGroup>
        ) : null}
      </div>
      <MoveSheet moving={moving} what={name} onOpenChange={(open) => open || setMoving(null)} />
      <DeleteFolderAsk
        folder={deleting ? folder : null}
        onOpenChange={setDeleting}
        onDeleted={() => void leave()}
      />
      <ShareFolderSheet open={sharing} onOpenChange={setSharing} folder={shareOf(folder)} />
    </div>
  )
}
