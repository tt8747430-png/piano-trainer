import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useFold } from '@/features/fold-section'
import { FoldSection, SeeAll } from '@/shared/ui'

/**
 * A Profile section (canvas 128): its name, folding its body away as the boards' folds.py and
 * remembered, and See all to the section's own page at the heading's end.
 */
export function ProfileSection({
  title,
  to,
  children,
}: {
  title: string
  to: '/profile/badges' | '/profile/achievements' | '/profile/history'
  children: ReactNode
}) {
  const { t } = useTranslation('account')
  const fold = useFold(`profile.${to.slice('/profile/'.length)}`)
  return (
    <FoldSection
      title={title}
      fold={fold}
      action={<SeeAll label={t('profile.badges.seeAll')} render={<Link to={to} />} />}
      className="gap-2"
      headingClassName="px-1 font-sans text-xl font-bold"
    >
      {children}
    </FoldSection>
  )
}
