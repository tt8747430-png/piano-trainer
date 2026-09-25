import { useParams } from '@tanstack/react-router'
import { entryById } from '@/entities/piece'
import { ListingView } from './ListingView'
import { PieceView } from './PieceView'

export function PiecePage() {
  const { pieceId } = useParams({ from: '/shell/songs/$pieceId' })
  const entry = entryById(pieceId)
  if (!entry) return null
  return entry.kind === 'listing' ? (
    <ListingView listing={entry} />
  ) : (
    <PieceView key={entry.id} piece={entry} />
  )
}
