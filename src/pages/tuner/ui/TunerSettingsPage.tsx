import { useTranslation } from 'react-i18next'
import { A4_RANGE, selectTuner, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setTunerA4 } from '@/features/set-preference'
import { BackButton, InfoTip, ScreenHeader, SettingsGroup, Stepper } from '@/shared/ui'

/**
 * The Tuner's Settings (`/practice/tuner/settings`, R29 B11), off its gear: the reference pitch, A4
 * from 415 to 466 Hz, 440 by default. The Tuner page and the Player's Tuner sheet both read it.
 */
export function TunerSettingsPage() {
  const { t } = useTranslation(['practice', 'player'])
  const store = useSettingsStoreApi()
  const { a4 } = useSettings(selectTuner)
  const label = t('player:tuner.a4')
  return (
    <div className="flex flex-col gap-6 pb-8">
      <ScreenHeader
        title={t('practice:settings.open', { page: t('practice:pages.tuner') })}
        back={<BackButton />}
      />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
        <SettingsGroup title={t('practice:tools.tuner.settings')}>
          <div
            data-setting="tuner.a4"
            className="flex min-h-12 flex-wrap items-center justify-between gap-3 px-4 py-2"
          >
            <span className="flex items-center gap-1.5 text-lg">
              {label}
              <InfoTip name={label}>{t('practice:tools.tuner.a4About')}</InfoTip>
            </span>
            <Stepper
              label={label}
              value={a4}
              min={A4_RANGE.min}
              max={A4_RANGE.max}
              format={(hz) => t('player:tuner.hz', { hz })}
              onChange={(hz) => setTunerA4(store, hz)}
              decrease={t('player:tuner.lower')}
              increase={t('player:tuner.higher')}
            />
          </div>
        </SettingsGroup>
      </div>
    </div>
  )
}
