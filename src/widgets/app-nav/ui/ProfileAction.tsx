import { Link } from '@tanstack/react-router'
import { UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { RoundLink } from '@/shared/ui'

/**
 * The Profile in a place's bar on a phone and a tablet, where the place has its own search (Songs);
 * a laptop's sidebar has it at its foot, so the bar leaves it out there.
 */
export function ProfileAction() {
  const { t } = useTranslation('common')
  return (
    <span className="inline-flex lg:hidden">
      <RoundLink label={t('nav.profile')} icon={UserRound} render={<Link to="/profile" />} />
    </span>
  )
}
