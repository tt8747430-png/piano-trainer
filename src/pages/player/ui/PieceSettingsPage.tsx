import { useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { isDegreePiece, isLeadSheet, stavesOf, useRepertoire } from '@/entities/piece'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { PlayerSettings } from '@/widgets/player-settings'
import { useScoreTracks } from '@/widgets/practice-player'

/**
 * A song's Player settings (B7), from the gear in the Player's bar: Settings › Player's page in the
 * Player's place, its volumes this song's tracks by their names. What it sets is every song's; Back
 * returns to the song as it was played.
 */
export function PieceSettingsPage() {
  const { t } = useTranslation('settings')
  const { pieceId } = useParams({ from: '/full-screen/play/$pieceId/settings' })
  const piece = useRepertoire().piece(pieceId)
  const tracks = useScoreTracks({
    staves: piece
      ? stavesOf(piece).map(({ clef }, place) => ({
          clef,
          name: isDegreePiece(piece) ? undefined : piece.staves?.[place]?.name,
        }))
      : [],
    piano: piece ? !isLeadSheet(piece) : true,
    recording: piece?.recording !== undefined,
  })
  return (
    // In the full screen's column, at its own height: it scrolls, never squeezed to the screen's.
    <div className="flex shrink-0 flex-col gap-6 pb-8">
      <ScreenHeader title={t('pages.player')} back={<BackButton />} />
      <div className="mx-auto w-full max-w-2xl space-y-7">
        <PlayerSettings tracks={tracks} />
      </div>
    </div>
  )
}
