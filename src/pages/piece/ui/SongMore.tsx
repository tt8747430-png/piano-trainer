import { useNavigate } from '@tanstack/react-router'
import { Ellipsis } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Piece } from '@/entities/piece'
import { ActionMenu, RoundButton } from '@/shared/ui'

/**
 * A song's More (the board's SONG_MORE at the bar's end): Edit score and Settings, the window over
 * the page. Duplicate, Archive, Share link and Export live in the song's Settings alone, one way to
 * each act.
 */
export function SongMore({ piece, onSettings }: { piece: Piece; onSettings: () => void }) {
  const { t } = useTranslation('piece')
  const navigate = useNavigate()
  return (
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
          onSelect: onSettings,
        },
      ]}
    />
  )
}
