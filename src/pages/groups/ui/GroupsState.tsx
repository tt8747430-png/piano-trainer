import { Link } from '@tanstack/react-router'
import { Users } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { GroupsData } from '@/features/share-folder'
import { ButtonLink, Said } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * What a group page shows in place of its groups (R32-C): signed out, why groups need an account and
 * Sign in, and read with none, No groups yet and `actions`, each a card that draws what a group is;
 * failed or offline, what happened and Try again.
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
  // Signed out, or no group yet (the Groups board's first run): a card at the page's start, never a
  // line of text floating mid-screen; what groups are drawn (a group, the faces of a choir),
  // then what to do.
  const guest = data.kind === 'guest'
  return (
    <section className="card flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-7 sm:p-6">
      <div aria-hidden className="relative shrink-0 self-center">
        <span className="grid size-28 place-items-center rounded-[18px] bg-paint-grass sm:size-32">
          <Users className="size-12 text-on-paint-grass" />
        </span>
        <span className="absolute -right-3 -bottom-2 flex">
          {(['M', 'D', 'E'] as const).map((initial, index) => (
            <span
              key={initial}
              className={`grid size-9 place-items-center rounded-full text-sm font-bold ring-2 ring-card ${FACES[index]} ${index > 0 ? '-ms-2.5' : ''}`}
            >
              {initial}
            </span>
          ))}
        </span>
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <h2 className="font-sans text-xl font-bold text-balance">
          {t(guest ? 'groups.guestTitle' : 'groups.empty')}
        </h2>
        <p className="text-[0.9375rem] text-pretty text-muted-foreground">
          {t(guest ? 'groups.guestLine' : 'groups.emptyLine')}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {guest ? (
            <ButtonLink render={<Link to="/account/sign-in" />}>{t('groups.signIn')}</ButtonLink>
          ) : (
            actions
          )}
        </div>
      </div>
    </section>
  )
}

/** The faces of a group in the picture: three members, each on a paint of their own. */
const FACES = [
  'bg-paint-sand text-on-paint-sand',
  'bg-paint-sky text-on-paint-sky',
  'bg-paint-grass text-on-paint-grass',
] as const

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
