import { useParams } from '@tanstack/react-router'
import { useRepertoire } from '@/entities/piece'
import { ListingView } from './ListingView'
import { PieceView } from './PieceView'

export function PiecePage() {
  // A song's, a study's or a progression's page: each shelf's route checked the kind.
  const { pieceId } = useParams({ strict: false })
  const pieces = useRepertoire()
  const entry = pieceId === undefined ? undefined : pieces.entry(pieceId)
  if (!entry) return null
  return entry.kind === 'listing' ? (
    <ListingView listing={entry} />
  ) : (
    <PieceView key={entry.id} piece={entry} />
  )
}
