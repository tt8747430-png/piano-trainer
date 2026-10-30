import { Link } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { RoundLink } from '@/shared/ui'

/**
 * A place's bar's action on a phone and a tablet: Search (the Profile is a tab of its own, Settings
 * in it). A laptop's sidebar has Search at its foot, so the bar leaves it out there.
 */
export function PlaceActions() {
  const { t } = useTranslation('common')
  return (
    <div className="flex gap-1.5 lg:hidden">
      <RoundLink label={t('nav.search')} icon={Search} render={<Link to="/search" />} />
    </div>
  )
}
