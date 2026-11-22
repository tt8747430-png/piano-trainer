import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { AuthProblem } from '@/shared/lib/account'
import { BackButton, Problem, ScreenHeader } from '@/shared/ui'

/**
 * An account page, as the SignIn board: Close in the bar (a step aside, back where it was opened
 * from) and the page's name beside it, as every bar (owner's lines sweep, 2026-11-18: an empty bar
 * is a hole); one column under it, 16 apart, on the phone's 16 gutter. On a laptop the column is
 * 440 wide and centred, 32 under the bar.
 */
export function AccountScreen({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <ScreenHeader title={title} back={<BackButton close />} />
      <div className="mx-auto flex w-full max-w-110 flex-col gap-4 pt-2 pb-12 lg:pt-8">
        {children}
      </div>
    </div>
  )
}

/**
 * Sign in's and Create an account's head, as the board's `SIHEAD` (2026-11-22; Apple HIG, Onboarding:
 * say what an account brings): the app's mark, 64, over one line on what an account keeps, centred,
 * 8 above and below; the ways in follow.
 */
export function AccountHead() {
  const { t } = useTranslation('account')
  return (
    <div className="flex flex-col items-center gap-3 py-2 text-center">
      <span
        aria-hidden
        className="grid size-16 place-items-center rounded-menu bg-(--p-ink) font-display text-4xl text-(--p-honey)"
      >
        𝄞
      </span>
      <p className="max-w-80 text-base/[1.45] text-balance text-muted-foreground">{t('why')}</p>
    </div>
  )
}

/** A link of the account pages, as the board's: the link colour, 15 semibold, reaching 44. */
export const ACCOUNT_LINK =
  'inline-flex min-h-11 items-center px-1 text-subhead font-semibold text-link hover:underline'

/** What the server's answer came to, said where the form's button is. */
export function ProblemLine({ problem }: { problem: AuthProblem | null }) {
  const { t } = useTranslation('account')
  return (
    <Problem className="empty:hidden">{problem === null ? '' : t(`problem.${problem}`)}</Problem>
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
