import { Link, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useRepertoire } from '@/entities/piece'
import { ButtonLink, NotFound } from '@/shared/ui'
import { ListingView } from './ListingView'
import { PieceView } from './PieceView'

export function PiecePage() {
  // A song's, a study's or a progression's page: each shelf's route checked the kind.
  const { t } = useTranslation('common')
  const { pieceId } = useParams({ strict: false })
  const pieces = useRepertoire()
  const entry = pieceId === undefined ? undefined : pieces.entry(pieceId)
  if (!entry) {
    // An own song deleted in another tab.
    return (
      <NotFound>
        <ButtonLink render={<Link to="/songs" />}>{t('notFound.toSongs')}</ButtonLink>
      </NotFound>
    )
  }
  return entry.kind === 'listing' ? (
    <ListingView listing={entry} />
  ) : (
    <PieceView key={entry.id} piece={entry} />
  )
}
