import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useFold } from '@/features/fold-section'
import { FoldSection, SeeAll } from '@/shared/ui'

/**
 * A Profile section (the boards' H2 over its box, folding as the boards' folds): its name, 20 bold,
 * the heading the button that folds the box away, remembered as `fold` names it; See all to the
 * section's own page at the heading's end while there is more to see, or what the heading says
 * beside it (the week's summary). Its box is the last child, so a laptop's row can stretch it to its
 * neighbour's height.
 */
export function ProfileSection({
  fold: foldId,
  title,
  to,
  aside,
  children,
}: {
  /** The section's name in the folds the learner left: `profile.<fold>`. */
  fold: 'week' | 'history' | 'badges' | 'achievements'
  title: string
  /** The section's own page: See all opens it; none while it holds nothing to see. */
  to?: '/profile/badges' | '/profile/achievements' | '/profile/history'
  /** What stands at the heading's end in place of See all. */
  aside?: ReactNode
  children: ReactNode
}) {
  const { t } = useTranslation('account')
  const fold = useFold(`profile.${foldId}`)
  return (
    <FoldSection
      title={title}
      fold={fold}
      action={to ? <SeeAll label={t('profile.badges.seeAll')} render={<Link to={to} />} /> : aside}
    >
      {children}
    </FoldSection>
  )
}
