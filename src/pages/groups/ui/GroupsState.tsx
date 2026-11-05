import { Link } from '@tanstack/react-router'
import { Users } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { GroupsData } from '@/features/share-folder'
import { ButtonLink } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/ui/primitives/empty'

/**
 * What a group page shows in place of its groups (R32-C): signed out, why groups need an account and
 * Sign in; failed or offline, what happened and Try again; read with none, No groups yet and `actions`.
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
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Users aria-hidden />
        </EmptyMedia>
        {data.kind === 'guest' ? (
          <>
            <EmptyTitle>{t('groups.guestTitle')}</EmptyTitle>
            <EmptyDescription>{t('groups.guestLine')}</EmptyDescription>
          </>
        ) : data.kind === 'failed' ? (
          <EmptyTitle role="alert">
            {t(data.reason === 'offline' ? 'groups.offline' : 'groups.failed')}
          </EmptyTitle>
        ) : (
          <>
            <EmptyTitle>{t('groups.empty')}</EmptyTitle>
            <EmptyDescription>{t('groups.emptyLine')}</EmptyDescription>
          </>
        )}
      </EmptyHeader>
      <EmptyContent className="flex-row flex-wrap justify-center">
        {data.kind === 'guest' ? (
          <ButtonLink render={<Link to="/account/sign-in" />}>{t('groups.signIn')}</ButtonLink>
        ) : data.kind === 'failed' ? (
          <Button variant="soft" size="lg" onClick={onRetry}>
            {t('groups.retry')}
          </Button>
        ) : (
          actions
        )}
      </EmptyContent>
    </Empty>
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
