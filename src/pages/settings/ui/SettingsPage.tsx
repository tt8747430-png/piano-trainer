import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useProgressStoreApi } from '@/entities/progress'
import {
  selectLocale,
  selectTheme,
  THEMES,
  useSettings,
  useSettingsStoreApi,
  type Theme,
} from '@/entities/settings'
import { MidiControl } from '@/features/connect-midi'
import { KeyboardSettingsFields } from '@/features/live-keyboard'
import { resetProgress } from '@/features/reset-progress'
import { setLocale, setTheme } from '@/features/set-preference'
import { LOCALES, type Locale } from '@/shared/i18n'
import { RoundLink, ScreenHeader, Segmented } from '@/shared/ui'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/primitives/alert-dialog'
import { Button } from '@/shared/ui/primitives/button'

const LOCALE_LABEL = { en: 'language.en', ru: 'language.ru' } as const satisfies Record<
  Locale,
  string
>
const THEME_LABEL = {
  system: 'theme.system',
  light: 'theme.light',
  dark: 'theme.dark',
} as const satisfies Record<Theme, string>

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-muted-foreground">{title}</h2>
      {children}
    </section>
  )
}

export function SettingsPage() {
  const { t } = useTranslation(['settings', 'common'])
  const settings = useSettingsStoreApi()
  const progress = useProgressStoreApi()
  const locale = useSettings(selectLocale)
  const theme = useSettings(selectTheme)
  const [confirming, setConfirming] = useState(false)
  const reset = () => {
    resetProgress(progress)
    setConfirming(false)
  }
  return (
    <div className="flex flex-col gap-8">
      <ScreenHeader
        title={t('settings:title')}
        back={<RoundLink label={t('common:back')} icon={ArrowLeft} render={<Link to="/" />} />}
      />
      <Group title={t('settings:language.label')}>
        <Segmented
          label={t('settings:language.label')}
          value={locale}
          options={LOCALES.map((value) => ({ value, label: t(`settings:${LOCALE_LABEL[value]}`) }))}
          onChange={(value) => setLocale(settings, value)}
        />
      </Group>
      <Group title={t('settings:theme.label')}>
        <Segmented
          label={t('settings:theme.label')}
          value={theme}
          options={THEMES.map((value) => ({ value, label: t(`settings:${THEME_LABEL[value]}`) }))}
          onChange={(value) => setTheme(settings, value)}
        />
      </Group>
      <Group title={t('settings:keyboard')}>
        <KeyboardSettingsFields />
      </Group>
      <Group title={t('settings:midi')}>
        <MidiControl />
      </Group>
      <Group title={t('settings:progress.label')}>
        <AlertDialog open={confirming} onOpenChange={setConfirming}>
          <AlertDialogTrigger render={<Button variant="destructive" className="self-start" />}>
            {t('settings:progress.reset')}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('settings:progress.title')}</AlertDialogTitle>
              <AlertDialogDescription>{t('settings:progress.body')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('settings:progress.cancel')}</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={reset}>
                {t('settings:progress.confirm')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Group>
    </div>
  )
}
