import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { selectLocale, selectWelcomed, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setLocale, setWelcomed } from '@/features/set-preference'
import { LOCALES } from '@/shared/i18n'
import { useAccount } from '@/shared/lib/account'
import { Segmented } from '@/shared/ui'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/primitives/alert-dialog'
import { Button } from '@/shared/ui/primitives/button'

/**
 * The welcome, once, on the app's first run: what the app is for, its language, and that an account
 * is optional; Start playing, or Sign in. Not over the account pages, where a link from an email
 * lands, and never to a learner signed in: their account says they have been here (an update that
 * starts the settings afresh would otherwise ask them again), so it is marked seen.
 */
export function Welcome({ shown }: { shown: boolean }) {
  const { t } = useTranslation(['account', 'settings'])
  const settings = useSettingsStoreApi()
  const welcomed = useSettings(selectWelcomed)
  const locale = useSettings(selectLocale)
  const navigate = useNavigate()
  const { account, ready } = useAccount()
  const signedIn = account !== null
  useEffect(() => {
    if (signedIn && !welcomed) setWelcomed(settings)
  }, [signedIn, welcomed, settings])
  const signIn = () => {
    setWelcomed(settings)
    void navigate({ to: '/account/sign-in' })
  }
  return (
    <AlertDialog open={shown && ready && !signedIn && !welcomed}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-2xl">
            {t('welcome.title')}
          </AlertDialogTitle>
          <AlertDialogDescription>{t('welcome.says')}</AlertDialogDescription>
        </AlertDialogHeader>
        <Segmented
          label={t('welcome.language')}
          value={locale}
          options={LOCALES.map((value) => ({ value, label: t(`settings:language.${value}`) }))}
          onChange={(value) => setLocale(settings, value)}
        />
        <AlertDialogFooter>
          <Button variant="outline" onClick={signIn}>
            {t('welcome.signIn')}
          </Button>
          <Button onClick={() => setWelcomed(settings)}>{t('welcome.start')}</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
