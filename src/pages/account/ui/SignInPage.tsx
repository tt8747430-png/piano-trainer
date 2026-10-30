import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGoBack, useOnline } from '@/shared/lib'
import { useAccount } from '@/shared/lib/account'
import { FormField } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { emailProblem } from '../model/fields'
import { useAuthSubmit } from '../model/use-auth-submit'
import { AccountScreen, FieldGroup, OfflineLine, ProblemLine } from './AccountScreen'
import { SocialButtons } from './SocialButtons'

/**
 * Sign in (ADR 0116): with Google, or an email and a password; Forgot password and Create an
 * account lead on in its place. Signed in, it goes back where it was opened from.
 */
export function SignInPage() {
  const { t } = useTranslation('account')
  const { auth } = useAccount()
  const online = useOnline()
  const back = useGoBack({ to: '/profile' })
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
      <p className="text-muted-foreground">{t('why')}</p>
      <OfflineLine online={online} />
      <SocialButtons online={online} onProblem={setProblem} />
      <form noValidate onSubmit={(event) => void submit(event)} className="flex flex-col gap-4">
        <FieldGroup>
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
          <Link
            to="/account/forgot"
            replace
            className="-my-2 inline-flex min-h-11 items-center self-end text-sm font-medium"
          >
            {t('signIn.forgot')}
          </Link>
        </FieldGroup>
        <ProblemLine problem={problem} />
        <Button type="submit" size="lg" disabled={!online || busy}>
          {t('signIn.submit')}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        {t('signIn.noAccount')}{' '}
        <Link to="/account/create" replace className="font-medium text-foreground underline">
          {t('signIn.create')}
        </Link>
      </p>
    </AccountScreen>
  )
}
