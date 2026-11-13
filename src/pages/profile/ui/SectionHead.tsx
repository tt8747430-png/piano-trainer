import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

/**
 * A Profile section's head (canvas 128): its name, large, and See all at the right, a link to the
 * section's own page.
 */
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
    <div className="flex items-baseline justify-between gap-3 px-1">
      <h2 id={id} className="font-sans text-xl font-bold">
        {title}
      </h2>
      <Link
        to={to}
        className="-my-2 inline-flex min-h-11 min-w-11 items-center justify-end px-1 text-[0.9375rem] font-semibold text-link hover:underline"
      >
        {t('profile.badges.seeAll')}
      </Link>
    </div>
  )
}
