import { Link } from '@tanstack/react-router'
import { PencilLine } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Listing } from '@/entities/piece'
import { FabLink, FloatingActions } from '@/shared/ui'
import { PieceAbout, PieceCredits } from './PieceAbout'
import { PieceFacts } from './PieceFacts'
import { PieceHeader } from './PieceHeader'

/** A songbook entry with no chart yet: its facts, and its one action floating, writing the chart. */
export function ListingView({ listing }: { listing: Listing }) {
  const { t } = useTranslation('piece')
  return (
    <div className="flex flex-col gap-6 pb-4">
      <PieceHeader entry={listing} />
      <PieceFacts entry={listing} />
      <PieceCredits entry={listing} />
      <PieceAbout entry={listing} />
      <FloatingActions>
        <FabLink
          label={t('writeChart')}
          icon={PencilLine}
          render={<Link to="/edit/$pieceId" params={{ pieceId: listing.id }} />}
        />
      </FloatingActions>
    </div>
  )
}
