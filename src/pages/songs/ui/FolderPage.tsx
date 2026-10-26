import { Link, useParams, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useLibraryLayout } from '@/entities/library'
import { ButtonLink, NotFound } from '@/shared/ui'
import { LibraryScreen } from './LibraryScreen'

/** A folder of the library (ADR 0106): its songs; gone (archived or deleted in another tab), not found. */
export function FolderPage() {
  const { t } = useTranslation('common')
  const { folderId } = useParams({ from: '/shell/songs/folders/$folderId' })
  const search = useSearch({ from: '/shell/songs/folders/$folderId' })
  const folder = useLibraryLayout().folders.find((each) => each.id === folderId)
  if (!folder)
    return (
      <NotFound>
        <ButtonLink render={<Link to="/songs" />}>{t('notFound.toSongs')}</ButtonLink>
      </NotFound>
    )
  return <LibraryScreen key={folder.id} folder={folder} filter={search} />
}
