import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount } from '@/shared/lib/account'
import { buttonVariants } from '@/shared/ui/primitives/button'
import { AccountScreen } from './AccountScreen'

/**
 * Where the server's links come back (ADR 0116): Google's sign-in, an email confirmed, a password
 * reset. The code is exchanged once for a session; then Settings, or New password after a reset.
 */
export function AuthCallbackPage() {
  const search = useSearch({ from: '/shell/auth/callback' })
  const { t } = useTranslation('account')
  const { auth } = useAccount()
  const navigate = useNavigate()
  const [failed, setFailed] = useState(search.error !== undefined || search.code === undefined)
  // A code is good once: the exchange must not run again when the effect does.
  const exchanged = useRef(false)
  useEffect(() => {
    const { code, next } = search
    if (code === undefined || search.error !== undefined || exchanged.current) return
    exchanged.current = true
    void auth.completeRedirect(code).then((result) => {
      if (!result.ok) setFailed(true)
      else
        void navigate({
          to: next === 'reset' ? '/account/new-password' : '/settings',
          replace: true,
        })
    })
  }, [auth, navigate, search])
  return (
    <AccountScreen title={t('signIn.title')}>
      {failed ? (
        <>
          <p role="alert">{t('callback.failed')}</p>
          <Link to="/account/sign-in" replace className={buttonVariants({ size: 'lg' })}>
            {t('callback.again')}
          </Link>
        </>
      ) : (
        <p role="status" className="text-muted-foreground">
          {t('callback.working')}
        </p>
      )}
    </AccountScreen>
  )
}
