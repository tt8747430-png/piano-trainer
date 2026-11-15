import { useNavigate, useRouter } from '@tanstack/react-router'
import { Ellipsis } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { placeIn, useLibraryLayout } from '@/entities/library'
import { entryTitles, isDegreePiece, isOwnSongId, type Piece } from '@/entities/piece'
import { selectView } from '@/entities/views'
import { useSongActions } from '@/features/manage-library'
import { ShareSaid, songToShare, useShareSong } from '@/features/share-song'
import { SongExportSheet } from '@/features/song-files'
import { useLocale } from '@/shared/i18n'
import { ActionMenu, RoundButton } from '@/shared/ui'

/**
 * A song's More (loop round 24, the board's SONG_MORE at the bar's end, where the gear was): Edit
 * score, Settings, Share link, Export… and, apart, Archive or Restore; each the same command the
 * song's Settings page runs.
 */
export function SongMore({ piece }: { piece: Piece }) {
  const { t } = useTranslation(['piece', 'songs'])
  const navigate = useNavigate()
  const router = useRouter()
  const locale = useLocale()
  const shared = useShareSong()
  const library = useSongActions(piece)
  const layout = useLibraryLayout()
  const [exporting, setExporting] = useState(false)
  const title = entryTitles(piece, locale).primary
  const archived = placeIn(layout, piece.id) === 'archived'
  const act = (key: string) => library.actions.find((each) => each.key === key)
  const keep = act(archived ? 'restore' : 'archive')
  // An own song in degrees has no music to send; one of the app's is a link to itself (ADR 0107).
  const shareable = !(isOwnSongId(piece.id) && isDegreePiece(piece))
  const share = () => {
    const what = songToShare(
      piece,
      title,
      selectView(router.options.context.views.getState(), `/play/${piece.id}`),
    )
    if (what) shared.share(what)
  }
  return (
    <>
      <ActionMenu
        label={t('more')}
        align="end"
        trigger={null}
        render={<RoundButton label={t('more')} icon={Ellipsis} />}
        actions={[
          {
            key: 'edit',
            label: t('editScore'),
            onSelect: () => void navigate({ to: '/edit/$pieceId', params: { pieceId: piece.id } }),
          },
          {
            key: 'settings',
            label: t('settings.open'),
            onSelect: () =>
              void navigate({ to: '/songs/$pieceId/settings', params: { pieceId: piece.id } }),
          },
          { key: 'share', label: t('settings.shareLink'), hidden: !shareable, onSelect: share },
          { key: 'export', label: t('songs:export.action'), onSelect: () => setExporting(true) },
          {
            key: 'keep',
            label: t(archived ? 'songs:library.restore' : 'songs:library.archive'),
            hidden: piece.kind === 'study' || keep === undefined,
            unnamed: true,
            group: 'keep',
            onSelect: () => keep?.onSelect(),
          },
        ]}
      />
      <ShareSaid said={shared.said} />
      <SongExportSheet piece={exporting ? piece : null} onOpenChange={setExporting} />
    </>
  )
}
