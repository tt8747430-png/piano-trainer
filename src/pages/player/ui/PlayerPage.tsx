import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { entryTitles, pieceById, usePieceHeadings, type Piece } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { isCompound } from '@/shared/lib/music'
import { useClose } from '../model/use-close'
import { usePlayer } from '../model/use-player'
import { PieceSetup } from './PieceSetup'
import { PlayerLayout } from './PlayerLayout'

function PiecePlayer({ piece }: { piece: Piece }) {
  const locale = useLocale()
  const search = useSearch({ from: '/full-screen/play/$pieceId' })
  const navigate = useNavigate({ from: '/play/$pieceId' })
  const [setupOpen, setSetupOpen] = useState(false)
  const close = useClose(piece)
  const headings = usePieceHeadings(piece)
  const { choice, performance, player, changeSetup } = usePlayer(
    piece,
    search,
    (patch) => void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true }),
  )
  return (
    <>
      <PlayerLayout
        title={entryTitles(piece, locale).primary}
        onClose={close}
        view={search}
        player={player}
        performance={performance}
        headings={headings}
        onSetup={() => setSetupOpen(true)}
      />
      <PieceSetup
        open={setupOpen}
        onOpenChange={setSetupOpen}
        piece={piece}
        choice={choice}
        swing={isCompound(piece.meter) ? null : search.swing}
        onChange={changeSetup}
        onSwing={player.setSwing}
      />
    </>
  )
}

/** A piece in the Player: the route's piece, its choices from the URL. */
export function PlayerPage() {
  const { pieceId } = useParams({ from: '/full-screen/play/$pieceId' })
  const piece = pieceById(pieceId)
  return piece ? <PiecePlayer key={piece.id} piece={piece} /> : null
}
