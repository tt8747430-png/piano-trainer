import { Link } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Piece } from '@/entities/piece'
import { RowLink } from '@/shared/ui'

/** The kind of piece's paint, as its row wears it in a list: a song yellow, a study grass. */
const PAINT = { song: 'yellow', study: 'grass' } as const

/**
 * Play it through (spec §3.1): one row at the song's page's foot, the Player on the whole song, played
 * the learner's way (no loop of the last lesson, as Practise opens it as it was left).
 */
export function PlayAlong({ piece }: { piece: Pick<Piece, 'id' | 'kind'> }) {
  const { t } = useTranslation('piece')
  return (
    <ul className="card p-2">
      <li>
        <RowLink
          title={t('learnSong.playAlong')}
          detail={t(`learnSong.playAlongDetail.${piece.kind}`)}
          icon={Play}
          paint={PAINT[piece.kind]}
          render={<Link to="/play/$pieceId" params={{ pieceId: piece.id }} />}
        />
      </li>
    </ul>
  )
}
