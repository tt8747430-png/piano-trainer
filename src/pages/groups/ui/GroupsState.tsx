import { Link } from '@tanstack/react-router'
import { Users } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { GroupsData } from '@/features/share-folder'
import { ButtonLink, Said } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * What a group page shows in place of its groups (R32-C), each the kit's one empty state: signed out,
 * why groups need an account and Sign in; read with none, No groups yet and `actions`; failed or
 * offline, what happened and Try again.
 */
export function GroupsState({
  data,
  onRetry,
  actions,
}: {
  data: Exclude<GroupsData, { kind: 'loading' }>
  onRetry: () => void
  /** What a read list with no groups offers: New group, Join with a link. */
  actions?: ReactNode
}) {
  const { t } = useTranslation('songs')
  // Failed or offline: the kit's one empty state, Try again its one honey way on.
  if (data.kind === 'failed')
    return (
      <Said
        icon={Users}
        title={t(data.reason === 'offline' ? 'groups.offline' : 'groups.failed')}
        primary
        action={<Button onClick={onRetry}>{t('groups.retry')}</Button>}
      />
    )
  // Signed out, or no group yet (the Groups board's states): the kit's one empty state, its way on
  // Sign in, or Join with a link and New group.
  const guest = data.kind === 'guest'
  return guest ? (
    <Said
      icon={Users}
      title={t('groups.guestTitle')}
      description={t('groups.guestLine')}
      primary
      action={<ButtonLink render={<Link to="/account/sign-in" />}>{t('groups.signIn')}</ButtonLink>}
    />
  ) : (
    <Said
      icon={Users}
      title={t('groups.empty')}
      description={t('groups.emptyLine')}
      pair
      action={actions}
    />
  )
}

/** Rows being read: their outlines, named for a screen reader. */
export function RowsLoading({ label, rows = 3 }: { label: string; rows?: number }) {
  return (
    <div role="status" aria-label={label} className="flex flex-col gap-2">
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="h-16 rounded-card bg-muted motion-safe:animate-pulse" />
      ))}
    </div>
  )
}
