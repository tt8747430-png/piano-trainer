import { Link } from '@tanstack/react-router'
import { PencilLine } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Listing } from '@/entities/piece'
import { ButtonLink } from '@/shared/ui'
import { PieceFacts } from './PieceFacts'
import { PieceHeader } from './PieceHeader'

/** A songbook entry with no chart yet: its facts, and its one action, writing the chart. */
export function ListingView({ listing }: { listing: Listing }) {
  const { t } = useTranslation('piece')
  return (
    <div className="flex flex-col pb-4">
      <PieceHeader entry={listing} />
      <div className="flex flex-col gap-6">
        <PieceFacts entry={listing} />
        <ButtonLink
          size="pill"
          className="self-start"
          render={<Link to="/edit/$pieceId" params={{ pieceId: listing.id }} />}
        >
          <PencilLine data-icon="inline-start" />
          {t('writeChart')}
        </ButtonLink>
      </div>
    </div>
  )
}
