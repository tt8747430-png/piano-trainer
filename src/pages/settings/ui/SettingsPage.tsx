import { Link } from '@tanstack/react-router'
import { ArrowDown, ArrowDownLeft, ArrowDownRight, Cable, LifeBuoy } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useProgressStoreApi } from '@/entities/progress'
import {
  FLOATING_PLACES,
  selectFloating,
  selectLocale,
  selectTheme,
  selectTitles,
  THEMES,
  TITLE_SIZES,
  useSettings,
  useSettingsStoreApi,
  type Theme,
} from '@/entities/settings'
import { BackupFields } from '@/features/backup-data'
import { useMidiSummary } from '@/features/connect-midi'
import { KeyboardSettingsFields } from '@/features/live-keyboard'
import { MetronomeSwitch, TuneSwitch } from '@/features/record-take'
import { resetProgress } from '@/features/reset-progress'
import { setFloating, setLocale, setTheme, setTitles } from '@/features/set-preference'
import { LOCALES, type Locale } from '@/shared/i18n'
import {
  BackButton,
  RowLink,
  ScreenHeader,
  Segmented,
  SettingField,
  SettingRows,
  SettingsGroup as Group,
  SwitchRow,
} from '@/shared/ui'
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

/** Each place the floating actions can stand, drawn as the corner of the screen's foot it is. */
const PLACE_ICON = {
  left: ArrowDownLeft,
  center: ArrowDown,
  right: ArrowDownRight,
} as const

/**
 * Settings, as an app's settings page reads (ADR 0096): Language, Theme, Appearance (the page titles,
 * the floating buttons), the Keyboard, the MIDI keyboard (a row to its own screen, its state at its
 * right, ADR 0034), Recording, Backup, Help (How to use, ADR 0052) and Progress, each choice one
 * compact row (its name with its ⓘ, the control at its right or under it), two columns from a
 * laptop's width.
 */
export function SettingsPage() {
  const { t } = useTranslation('settings')
  const settings = useSettingsStoreApi()
  const progress = useProgressStoreApi()
  const locale = useSettings(selectLocale)
  const theme = useSettings(selectTheme)
  const titles = useSettings(selectTitles)
  const floating = useSettings(selectFloating)
  const midiSummary = useMidiSummary()
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
        <Group title={t('appearance.label')}>
          <SettingRows>
            <SettingField label={t('appearance.titles.label')}>
              <Segmented
                label={t('appearance.titles.label')}
                value={titles}
                options={TITLE_SIZES.map((value) => ({
                  value,
                  label: t(`appearance.titles.${value}`),
                }))}
                onChange={(value) => setTitles(settings, value)}
              />
            </SettingField>
            <SettingField label={t('floating.place')} info={t('floating.placeInfo')}>
              <Segmented
                label={t('floating.place')}
                value={floating.place}
                options={FLOATING_PLACES.map((value) => {
                  const Icon = PLACE_ICON[value]
                  return {
                    value,
                    label: t(`floating.places.${value}`),
                    icon: <Icon aria-hidden className="size-5" />,
                  }
                })}
                onChange={(place) => setFloating(settings, { place })}
              />
            </SettingField>
            <SwitchRow
              label={t('floating.labels')}
              info={t('floating.labelsNote')}
              checked={floating.labels}
              onCheckedChange={(labels) => setFloating(settings, { labels })}
            />
          </SettingRows>
        </Group>
        <Group title={t('keyboard')} className="lg:col-start-2 lg:row-span-6 lg:row-start-2">
          <KeyboardSettingsFields />
        </Group>
        <nav aria-label={t('midi')} className="card p-1.5">
          <RowLink
            title={t('midi')}
            icon={Cable}
            paint="lilac"
            value={midiSummary}
            render={<Link to="/settings/midi" />}
          />
        </nav>
        <Group title={t('recording')}>
          <SettingRows>
            <MetronomeSwitch />
            <TuneSwitch />
          </SettingRows>
        </Group>
        <Group title={t('backup.label')} info={t('backup.says')}>
          <BackupFields />
        </Group>
        <Group title={t('help.label')}>
          <div className="-mx-3 -my-2">
            <RowLink
              title={t('help.howToUse')}
              detail={t('help.howToUseLine')}
              icon={LifeBuoy}
              paint="sky"
              render={<Link to="/settings/how-to-use" />}
            />
          </div>
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
