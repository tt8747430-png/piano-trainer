import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOnline } from '@/shared/lib'
import { useAccount } from '@/shared/lib/account'
import { FormField } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { passwordProblem } from '../model/fields'
import { useAuthSubmit } from '../model/use-auth-submit'
import { AccountScreen, OfflineLine, ProblemLine } from './AccountScreen'

/** New password (ADR 0116): opened by a reset link, signed in by it; the new password saved. */
export function NewPasswordPage() {
  const { t } = useTranslation('account')
  const { auth } = useAccount()
  const online = useOnline()
  const [password, setPassword] = useState('')
  const [invalid, setInvalid] = useState(false)
  const [saved, setSaved] = useState(false)
  const { busy, problem, submit } = useAuthSubmit({
    check: () => {
      const wrong = passwordProblem(password) !== undefined
      setInvalid(wrong)
      return !wrong
    },
    send: () => auth.updatePassword(password),
    done: () => setSaved(true),
  })
  return (
    <AccountScreen title={t('newPassword.title')}>
      {saved ? (
        <p role="status" className="card p-5">
          {t('newPassword.saved')}
        </p>
      ) : (
        <>
          <OfflineLine online={online} />
          <form noValidate onSubmit={(event) => void submit(event)} className="flex flex-col gap-4">
            <FormField
              label={t('password')}
              info={t('signUp.passwordInfo')}
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={invalid ? t('invalid.password') : undefined}
            />
            <ProblemLine problem={problem} />
            <Button type="submit" size="lg" disabled={!online || busy}>
              {t('newPassword.submit')}
            </Button>
          </form>
        </>
      )}
    </AccountScreen>
  )
}
