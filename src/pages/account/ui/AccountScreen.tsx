import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { AuthProblem } from '@/shared/lib/account'
import { BackButton, ScreenHeader } from '@/shared/ui'

/**
 * An account page, as the SignIn board: Close in the bar (a step aside, back where it was opened
 * from), the title 32 bold at the head of one narrow column, everything in it 16 apart.
 */
export function AccountScreen({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <ScreenHeader title={title} titleOnPage back={<BackButton close />} />
      <div className="mx-auto flex w-full max-w-sm flex-col gap-4 px-2 pt-1 pb-12">
        <h1 className="mb-1 font-sans text-[2rem] leading-tight font-bold tracking-[-0.01em] text-balance">
          {title}
        </h1>
        {children}
      </div>
    </div>
  )
}

/** A link of the account pages, as the board's: the link colour, 15 semibold, reaching 44. */
export const ACCOUNT_LINK =
  'inline-flex min-h-11 items-center px-1 text-[0.9375rem] font-semibold text-link hover:underline'

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
    <p role="status" className="rounded-control bg-muted px-4 py-3 text-sm">
      {t('offline')}
    </p>
  )
}
