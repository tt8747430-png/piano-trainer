import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { SeeAll, SectionHead as Head } from '@/shared/ui'

/** A Profile section's head (canvas 128): its name and See all, to the section's own page. */
export function SectionHead({
  id,
  title,
  to,
}: {
  id: string
  title: string
  to: '/profile/badges' | '/profile/achievements' | '/profile/history'
}) {
  const { t } = useTranslation('account')
  return (
    <Head id={id} title={title}>
      <SeeAll label={t('profile.badges.seeAll')} render={<Link to={to} />} />
    </Head>
  )
}
