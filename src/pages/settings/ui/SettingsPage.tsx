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
import { cn } from '@/shared/lib'
import { BackButton, ScreenHeader, Segmented } from '@/shared/ui'
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

/** A group of settings, boxed as the book boxes a thing: its title in a band across the top. */
function Group({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('overflow-hidden card', className)}>
      <h2 className="border-b border-border bg-muted px-5 py-2 text-xl">{title}</h2>
      <div className="flex flex-col gap-3 p-5">{children}</div>
    </section>
  )
}

export function SettingsPage() {
  const { t } = useTranslation('settings')
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
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('title')} back={<BackButton fallback={{ to: '/' }} />} />
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
        <Group title={t('language.label')}>
          <Segmented
            label={t('language.label')}
            value={locale}
            options={LOCALES.map((value) => ({ value, label: t(`${LOCALE_LABEL[value]}`) }))}
            onChange={(value) => setLocale(settings, value)}
          />
        </Group>
        <Group title={t('theme.label')}>
          <Segmented
            label={t('theme.label')}
            value={theme}
            options={THEMES.map((value) => ({ value, label: t(`${THEME_LABEL[value]}`) }))}
            onChange={(value) => setTheme(settings, value)}
          />
        </Group>
        <Group title={t('keyboard')} className="lg:col-start-2 lg:row-span-4 lg:row-start-2">
          <KeyboardSettingsFields />
        </Group>
        <Group title={t('midi')}>
          <MidiControl />
        </Group>
        <Group title={t('progress.label')}>
          <AlertDialog open={confirming} onOpenChange={setConfirming}>
            <AlertDialogTrigger render={<Button variant="destructive" className="self-start" />}>
              {t('progress.reset')}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('progress.title')}</AlertDialogTitle>
                <AlertDialogDescription>{t('progress.body')}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('progress.cancel')}</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={reset}>
                  {t('progress.confirm')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Group>
      </div>
    </div>
  )
}
