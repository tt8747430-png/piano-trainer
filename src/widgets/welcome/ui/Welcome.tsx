import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { selectLocale, selectWelcomed, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setLocale, setWelcomed } from '@/features/set-preference'
import { LOCALES } from '@/shared/i18n'
import { useAccount } from '@/shared/lib/account'
import { Segmented, SettingsGroup } from '@/shared/ui'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
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
      {/* The AppLayers board's welcome: the app's tile, a sans title, Language in caps, then Start
          playing over Sign in, each the dialog's width. */}
      <AlertDialogContent className="w-100 max-w-[calc(100%-3rem)] gap-3 rounded-sheet bg-background p-5 shadow-(--elevation-3)">
        <img src="/favicon.svg" alt="" className="size-18 justify-self-center rounded-[18px]" />
        <AlertDialogHeader className="place-items-center gap-3 text-center">
          <AlertDialogTitle className="font-sans text-[1.5rem] leading-[normal] font-bold text-balance">
            {t('welcome.title')}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base/[1.45] text-pretty">
            {t('welcome.says')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <SettingsGroup title={t('welcome.language')} bare className="gap-3">
          <Segmented
            label={t('welcome.language')}
            value={locale}
            options={LOCALES.map((value) => ({ value, label: t(`settings:language.${value}`) }))}
            onChange={(value) => setLocale(settings, value)}
          />
        </SettingsGroup>
        <div className="mt-1.5 grid gap-2">
          <Button
            size="lg"
            className="h-[50px] rounded-full font-bold"
            onClick={() => setWelcomed(settings)}
          >
            {t('welcome.start')}
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="h-[50px] rounded-full bg-muted font-bold hover:bg-muted/80"
            onClick={signIn}
          >
            {t('welcome.signIn')}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
