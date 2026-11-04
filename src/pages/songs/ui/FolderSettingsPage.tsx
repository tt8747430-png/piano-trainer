import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { Archive, FolderInput, Palette } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFolderName, useLibraryLayout, type ShelvedFolder } from '@/entities/library'
import {
  DeleteFolderAsk,
  FolderSheet,
  MoveSheet,
  useLibraryActs,
  type Moving,
} from '@/features/manage-library'
import {
  BackButton,
  ButtonLink,
  DangerGroup,
  DangerRow,
  NotFound,
  RowButton,
  ScreenHeader,
  SettingsGroup,
} from '@/shared/ui'

/**
 * A folder's Settings (R29, the owner's yes to ST17; a song's Settings page's shape): its name and
 * look (the Edit folder sheet), where it stands (Move to folder…), Archive folder, and Delete folder at
 * the page's foot. Reached from the gear in the folder's bar, where its ⋯ menu was.
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
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [moving, setMoving] = useState<Moving | null>(null)
  const [deleting, setDeleting] = useState(false)
  const name = nameOf(folder)
  const above = folder.parent ? folders.find((each) => each.id === folder.parent) : undefined
  // Out of the library (archived or deleted): to where it stood, its folder or Home.
  const leave = () =>
    above
      ? navigate({ to: '/songs/folders/$folderId', params: { folderId: above.id }, replace: true })
      : navigate({ to: '/songs', replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('folder.settings')} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        <p className="px-1 font-display text-2xl font-semibold text-balance">{name}</p>
        <SettingsGroup flush>
          <RowButton
            title={t('folder.nameAndLook')}
            icon={Palette}
            paint="sky"
            onClick={() => setEditing(true)}
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
          <RowButton
            title={t('folder.archive')}
            icon={Archive}
            paint="lilac"
            onClick={async () => {
              if (await acts.archiveFolder(folder)) void leave()
            }}
          />
        </SettingsGroup>
        <DangerGroup footnote={t('folder.deleteSays')}>
          <DangerRow title={t('folder.delete')} onClick={() => setDeleting(true)} />
        </DangerGroup>
      </div>
      <FolderSheet target={editing ? { kind: 'edit', folder } : null} onOpenChange={setEditing} />
      <MoveSheet moving={moving} what={name} onOpenChange={(open) => open || setMoving(null)} />
      <DeleteFolderAsk
        folder={deleting ? folder : null}
        onOpenChange={setDeleting}
        onDeleted={() => void leave()}
      />
    </div>
  )
}
