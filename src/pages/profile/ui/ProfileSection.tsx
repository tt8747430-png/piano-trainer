import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useFold } from '@/features/fold-section'
import { FoldSection, SeeAll } from '@/shared/ui'

/**
 * A Profile section (canvas 128): its name, folding its body away as the boards' folds.py and
 * remembered, and See all to the section's own page at the heading's end while there is more to see.
 */
export function ProfileSection({
  title,
  to,
  seeAll = true,
  children,
}: {
  title: string
  to: '/profile/badges' | '/profile/achievements' | '/profile/history'
  /** Whether its page holds anything to see: an empty history has no See all. */
  seeAll?: boolean
  children: ReactNode
}) {
  const { t } = useTranslation('account')
  const fold = useFold(`profile.${to.slice('/profile/'.length)}`)
  return (
    <FoldSection
      title={title}
      fold={fold}
      action={
        seeAll ? <SeeAll label={t('profile.badges.seeAll')} render={<Link to={to} />} /> : undefined
      }
      className="gap-2"
      headingClassName="px-1 font-sans text-xl font-bold"
    >
      {children}
    </FoldSection>
  )
}
