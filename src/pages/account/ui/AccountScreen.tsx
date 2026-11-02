import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { AuthProblem } from '@/shared/lib/account'
import { BackButton, ScreenHeader } from '@/shared/ui'

/** An account page: its title with Back (to the Profile, opened directly), its one narrow column. */
export function AccountScreen({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <ScreenHeader title={title} back={<BackButton fallback={{ to: '/profile' }} />} />
      <div className="mx-auto flex w-full max-w-sm flex-col gap-6">{children}</div>
    </div>
  )
}

/** A form's fields in one card, as the Account's groups hold theirs; its one action under the card. */
export function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4 card px-5 py-5">{children}</div>
}

/** What the server's answer came to, said where the form's button is. */
export function ProblemLine({ problem }: { problem: AuthProblem | null }) {
  const { t } = useTranslation('account')
  return (
    <p role="alert" className="text-sm text-destructive empty:hidden">
      {problem === null ? '' : t(`problem.${problem}`)}
    </p>
  )
}

/** Offline, a form that needs the server says so over itself. */
export function OfflineLine({ online }: { online: boolean }) {
  const { t } = useTranslation('account')
  return online ? null : (
    <p role="status" className="rounded-2xl bg-muted px-4 py-3 text-sm">
      {t('offline')}
    </p>
  )
}
