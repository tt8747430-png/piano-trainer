import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn, useOnline, useUp } from '@/shared/lib'
import { useAccount } from '@/shared/lib/account'
import { FormField } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { emailProblem } from '../model/fields'
import { useAuthSubmit } from '../model/use-auth-submit'
import { ACCOUNT_LINK, AccountScreen, OfflineLine, ProblemLine } from './AccountScreen'
import { SocialButtons } from './SocialButtons'

/**
 * Sign in (ADR 0116): with Google, or an email and a password; Forgot password and Create an
 * account lead on in its place. Signed in, it goes back where it was opened from.
 */
export function SignInPage() {
  const { t } = useTranslation('account')
  const { auth } = useAccount()
  const online = useOnline()
  const back = useUp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [invalid, setInvalid] = useState<'email' | 'password'>()
  const { busy, problem, setProblem, submit } = useAuthSubmit({
    check: () => {
      const wrong = emailProblem(email) ?? (password === '' ? 'password' : undefined)
      setInvalid(wrong)
      return wrong === undefined
    },
    send: () => auth.signIn(email.trim(), password),
    done: back,
  })
  return (
    <AccountScreen title={t('signIn.title')}>
      <OfflineLine online={online} />
      <SocialButtons online={online} onProblem={setProblem} />
      <form noValidate onSubmit={(event) => void submit(event)} className="flex flex-col gap-4">
        <>
          <FormField
            label={t('email')}
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={invalid === 'email' ? t('invalid.email') : undefined}
          />
          <FormField
            label={t('password')}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={invalid === 'password' ? t('invalid.password') : undefined}
          />
          <Link to="/account/forgot" replace className={cn(ACCOUNT_LINK, '-mt-2 self-end')}>
            {t('signIn.forgot')}
          </Link>
        </>
        <ProblemLine problem={problem} />
        <Button
          type="submit"
          size="lg"
          className="h-12.5 rounded-full font-bold"
          disabled={!online || busy}
        >
          {t('signIn.submit')}
        </Button>
      </form>
      <p className="flex flex-wrap items-center justify-center gap-0.5 text-[0.9375rem] text-muted-foreground">
        {t('signIn.noAccount')}
        <Link to="/account/create" replace className={ACCOUNT_LINK}>
          {t('signIn.create')}
        </Link>
      </p>
    </AccountScreen>
  )
}
