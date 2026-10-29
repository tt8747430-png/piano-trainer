import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGoBack, useOnline } from '@/shared/lib'
import { useAccount } from '@/shared/lib/account'
import { FormField } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { emailProblem, passwordProblem } from '../model/fields'
import { useAuthSubmit } from '../model/use-auth-submit'
import { AccountScreen, OfflineLine, ProblemLine } from './AccountScreen'
import { SocialButtons } from './SocialButtons'

type Field = 'name' | 'email' | 'password'

/**
 * Create an account (ADR 0116): a name, an email and a password, or Google. Where the server asks
 * the learner to confirm their email first, it says to check their email; else it goes back signed in.
 */
export function SignUpPage() {
  const { t } = useTranslation('account')
  const { auth } = useAccount()
  const online = useOnline()
  const back = useGoBack({ to: '/settings' })
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [invalid, setInvalid] = useState<Partial<Record<Field, true>>>({})
  const [confirming, setConfirming] = useState<string | null>(null)
  const { busy, problem, setProblem, submit } = useAuthSubmit({
    check: () => {
      const wrong = {
        ...(name.trim() === '' && { name: true as const }),
        ...(emailProblem(email) && { email: true as const }),
        ...(passwordProblem(password) && { password: true as const }),
      }
      setInvalid(wrong)
      return Object.keys(wrong).length === 0
    },
    send: () => auth.signUp({ name: name.trim(), email: email.trim(), password }),
    done: ({ confirm }) => (confirm ? setConfirming(email.trim()) : back()),
  })
  if (confirming !== null)
    return (
      <AccountScreen title={t('signUp.title')}>
        <section className="flex flex-col gap-2 card p-5" aria-labelledby="account-check">
          <h2 id="account-check" className="text-xl">
            {t('signUp.checkTitle')}
          </h2>
          <p>{t('signUp.check', { email: confirming })}</p>
        </section>
      </AccountScreen>
    )
  return (
    <AccountScreen title={t('signUp.title')}>
      <OfflineLine online={online} />
      <SocialButtons online={online} onProblem={setProblem} />
      <form noValidate onSubmit={(event) => void submit(event)} className="flex flex-col gap-4">
        <FormField
          label={t('name')}
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={invalid.name ? t('invalid.name') : undefined}
        />
        <FormField
          label={t('email')}
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={invalid.email ? t('invalid.email') : undefined}
        />
        <FormField
          label={t('password')}
          info={t('signUp.passwordInfo')}
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={invalid.password ? t('invalid.password') : undefined}
        />
        <ProblemLine problem={problem} />
        <Button type="submit" size="lg" disabled={!online || busy}>
          {t('signUp.submit')}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        {t('signUp.haveAccount')}{' '}
        <Link to="/account/sign-in" replace className="font-medium text-foreground underline">
          {t('signUp.signIn')}
        </Link>
      </p>
    </AccountScreen>
  )
}
