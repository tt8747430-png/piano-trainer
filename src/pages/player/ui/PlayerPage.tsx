import { useTranslation } from 'react-i18next'
import { useParams, useSearch } from '@tanstack/react-router'
import { entryTitles, pieceById, type Piece } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { useViewChange } from '@/shared/lib'
import { isCompound } from '@/shared/lib/music'
import { useClose } from '../model/use-close'
import type { PlayerSearch } from '../model/player-search'
import { usePlayer } from '../model/use-player'
import { PieceSetup } from './PieceSetup'
import { PlayerLayout } from './PlayerLayout'

function PiecePlayer({ piece }: { piece: Piece }) {
  const locale = useLocale()
  const search = useSearch({ from: '/full-screen/play/$pieceId' })
  const close = useClose(piece)
  const setSearch = useViewChange<PlayerSearch>()
  const { t } = useTranslation('player')
  const { choice, performance, player, fit, headings, changeSetup } = usePlayer(
    piece,
    search,
    setSearch,
  )
  const title = entryTitles(piece, locale).primary
  return (
    <PlayerLayout
      title={choice.walk ? t('pieceWalking', { title, walk: t(`walking.${choice.walk}`) }) : title}
      onClose={close}
      view={search}
      player={player}
      performance={performance}
      headings={headings}
      setup={
        <PieceSetup
          piece={piece}
          choice={choice}
          fit={fit}
          swing={isCompound(piece.meter) ? null : search.swing}
          onChange={changeSetup}
          onSwing={player.setSwing}
        />
      }
    />
  )
}

/** A piece in the Player: the route's piece, its choices from the URL. */
export function PlayerPage() {
  const { pieceId } = useParams({ from: '/full-screen/play/$pieceId' })
  const piece = pieceById(pieceId)
  return piece ? <PiecePlayer key={piece.id} piece={piece} /> : null
}
