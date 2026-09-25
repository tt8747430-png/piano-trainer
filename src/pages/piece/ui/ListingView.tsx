import { useTranslation } from 'react-i18next'
import type { Listing } from '@/entities/piece'
import { PieceFacts } from './PieceFacts'

/** A songbook entry with no chart yet: its facts and one line saying so. */
export function ListingView({ listing }: { listing: Listing }) {
  const { t } = useTranslation('piece')
  return (
    <div className="flex flex-col gap-6 pb-4">
      <PieceFacts entry={listing} />
      <p className="text-lg font-semibold">{t('noChart')}</p>
    </div>
  )
}
