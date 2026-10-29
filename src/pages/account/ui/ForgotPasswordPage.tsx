import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOnline } from '@/shared/lib'
import { useAccount } from '@/shared/lib/account'
import { FormField } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { emailProblem } from '../model/fields'
import { useAuthSubmit } from '../model/use-auth-submit'
import { AccountScreen, OfflineLine, ProblemLine } from './AccountScreen'

/**
 * Forgotten password (ADR 0116): sends a link to choose a new one, and says so whatever the
 * address, as the server never says whether an email has an account.
 */
export function ForgotPasswordPage() {
  const { t } = useTranslation('account')
  const { auth } = useAccount()
  const online = useOnline()
  const [email, setEmail] = useState('')
  const [invalid, setInvalid] = useState(false)
  const [sent, setSent] = useState<string | null>(null)
  const { busy, problem, submit } = useAuthSubmit({
    check: () => {
      const wrong = emailProblem(email) !== undefined
      setInvalid(wrong)
      return !wrong
    },
    send: () => auth.requestPasswordReset(email.trim()),
    done: () => setSent(email.trim()),
  })
  return (
    <AccountScreen title={t('forgot.title')}>
      {sent === null ? (
        <>
          <p className="text-muted-foreground">{t('forgot.says')}</p>
          <OfflineLine online={online} />
          <form noValidate onSubmit={(event) => void submit(event)} className="flex flex-col gap-4">
            <FormField
              label={t('email')}
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={invalid ? t('invalid.email') : undefined}
            />
            <ProblemLine problem={problem} />
            <Button type="submit" size="lg" disabled={!online || busy}>
              {t('forgot.submit')}
            </Button>
          </form>
        </>
      ) : (
        <p role="status" className="card p-5">
          {t('forgot.sent', { email: sent })}
        </p>
      )}
      <Link
        to="/account/sign-in"
        replace
        className="inline-flex min-h-11 items-center justify-center text-sm font-medium"
      >
        {t('forgot.back')}
      </Link>
    </AccountScreen>
  )
}
