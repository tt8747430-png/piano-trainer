import { Link } from '@tanstack/react-router'
import { Search, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { RoundLink } from '@/shared/ui'

/**
 * A place's bar's two actions on a phone and a tablet: Search, and the Profile (Settings is in it). A
 * laptop's sidebar has both at its foot, so the bar leaves them out there.
 */
export function PlaceActions() {
  const { t } = useTranslation('common')
  return (
    <div className="flex gap-1.5 lg:hidden">
      <RoundLink label={t('nav.search')} icon={Search} render={<Link to="/search" />} />
      <RoundLink label={t('nav.profile')} icon={UserRound} render={<Link to="/profile" />} />
    </div>
  )
}
