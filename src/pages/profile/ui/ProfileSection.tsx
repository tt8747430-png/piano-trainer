import { Link } from '@tanstack/react-router'
import { useId, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { SectionHead, SeeAll } from '@/shared/ui'

/**
 * A Profile section (the boards' H2 over its box): its name, 20 bold, 12 over what it heads, with
 * See all to the section's own page at the heading's end while there is more to see, or what the
 * heading says beside it (the week's summary). Its box is the last child, so a laptop's row can
 * stretch it to its neighbour's height.
 */
export function ProfileSection({
  title,
  to,
  aside,
  children,
}: {
  title: string
  /** The section's own page: See all opens it; none while it holds nothing to see. */
  to?: '/profile/badges' | '/profile/achievements' | '/profile/history'
  /** What stands at the heading's end in place of See all. */
  aside?: ReactNode
  children: ReactNode
}) {
  const { t } = useTranslation('account')
  const id = useId()
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <SectionHead id={id} title={title}>
        {to ? <SeeAll label={t('profile.badges.seeAll')} render={<Link to={to} />} /> : aside}
      </SectionHead>
      {children}
    </section>
  )
}
