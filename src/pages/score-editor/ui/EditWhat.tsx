import { useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { entryById, isDegreePiece, isOwnSongId, isPiece } from '@/entities/piece'
import { editsContent, useAccount } from '@/shared/lib/account'
import { NavTab, NavTabs } from '@/shared/ui'

/**
 * What an editor edits of a built-in song (ADR 0116): their own version, as every learner does, or
 * the original everyone gets. The one Edit opens either; this switches between them. Anyone else, or
 * a song with no original to change (an own song, one written in degrees), sees none.
 */
export function EditWhat({ original }: { original: boolean }) {
  const { t } = useTranslation('editor')
  const { pieceId } = useParams({ from: '/full-screen/edit/$pieceId' })
  const { account } = useAccount()
  const entry = entryById(pieceId)
  const hasOriginal =
    !isOwnSongId(pieceId) && entry !== undefined && isPiece(entry) && !isDegreePiece(entry)
  if (!hasOriginal || !editsContent(account)) return null
  return (
    <NavTabs label={t('original.what')}>
      {([false, true] as const).map((each) => (
        <NavTab
          key={String(each)}
          to="/edit/$pieceId"
          params={{ pieceId }}
          search={(prev) => ({ ...prev, original: each || undefined })}
          replace
          current={each === original}
        >
          {t(each ? 'original.theOriginal' : 'original.mine')}
        </NavTab>
      ))}
    </NavTabs>
  )
}
