import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { selectLocale, selectWelcomed, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setLocale, setWelcomed } from '@/features/set-preference'
import { LOCALES } from '@/shared/i18n'
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
 * lands.
 */
export function Welcome({ shown }: { shown: boolean }) {
  const { t } = useTranslation(['account', 'settings'])
  const settings = useSettingsStoreApi()
  const welcomed = useSettings(selectWelcomed)
  const locale = useSettings(selectLocale)
  const navigate = useNavigate()
  const signIn = () => {
    setWelcomed(settings)
    void navigate({ to: '/account/sign-in' })
  }
  return (
    <AlertDialog open={shown && !welcomed}>
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
        <p className="text-sm text-muted-foreground">{t('welcome.account')}</p>
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
