import { Link, useParams, useSearch } from '@tanstack/react-router'
import { PencilLine } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  entryTitles,
  isDegreePiece,
  isLeadSheet,
  useRepertoire,
  type Piece,
} from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { useViewChange } from '@/shared/lib'
import { isCompound } from '@/shared/lib/music'
import { ButtonLink, NotFound, RoundLink } from '@/shared/ui'
import { useClose } from '../model/use-close'
import type { PlayerSearch } from '../model/player-search'
import { usePlayer } from '../model/use-player'
import { PieceSetup } from './PieceSetup'
import { PlayerLayout } from './PlayerLayout'

function PiecePlayer({ piece }: { piece: Piece }) {
  const { t } = useTranslation('player')
  const locale = useLocale()
  const search = useSearch({ from: '/full-screen/play/$pieceId' })
  const close = useClose(piece)
  const setSearch = useViewChange<PlayerSearch>()
  const { choice, performance, player, fit, headings, changeSetup } = usePlayer(
    piece,
    search,
    setSearch,
  )
  const title = entryTitles(piece, locale).primary
  return (
    <PlayerLayout
      title={title}
      onClose={close}
      view={search}
      player={player}
      performance={performance}
      headings={headings}
      // A song that hides its piano is a lead sheet (ADR 0083).
      piano={!isLeadSheet(piece)}
      edit={
        isDegreePiece(piece) ? null : (
          <RoundLink
            label={t('editScore')}
            icon={PencilLine}
            render={<Link to="/edit/$pieceId" params={{ pieceId: piece.id }} />}
          />
        )
      }
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
  const { t } = useTranslation('common')
  const piece = useRepertoire().piece(pieceId)
  if (!piece) {
    // An own song deleted in another tab.
    return (
      <NotFound>
        <ButtonLink render={<Link to="/songs" />}>{t('notFound.toSongs')}</ButtonLink>
      </NotFound>
    )
  }
  return <PiecePlayer key={piece.id} piece={piece} />
}
