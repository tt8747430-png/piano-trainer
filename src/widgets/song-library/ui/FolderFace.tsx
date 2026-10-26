import { useTranslation } from 'react-i18next'
import { FolderTile, useFolderName, type ShelvedFolder } from '@/entities/library'
import { RowFace } from '@/shared/ui'

/** What a folder's row shows: its tile (its picture on its paint), its name and its songs counted. */
export function FolderFace({ folder }: { folder: ShelvedFolder }) {
  const { t } = useTranslation('songs')
  const nameOf = useFolderName()
  const count = folder.songs.length
  return (
    <>
      <FolderTile look={folder} />
      <RowFace
        title={nameOf(folder)}
        detail={count > 0 ? t('folder.songCount', { count }) : t('folder.empty')}
      />
    </>
  )
}
