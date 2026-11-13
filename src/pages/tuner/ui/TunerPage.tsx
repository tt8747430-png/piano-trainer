import { useTranslation } from 'react-i18next'
import { A4_RANGE, selectTuner, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setTunerA4 } from '@/features/set-preference'
import { InfoTip, SettingsGroup, Stepper } from '@/shared/ui'
import { ToolPage } from '@/widgets/tool-page'
import { TunerReadout } from '@/widgets/tuner'

/**
 * The Tuner (R29 B11), a tool of its own on the tools' layout: B8's tuner large, listening while the
 * page is open (the note heard, the needle, its frequency), and under it, in place (R32), its one
 * setting: the reference pitch, A4 from 415 to 466 Hz, 440 by default, which the Player's Tuner sheet
 * and the Tools menu read too. No gear: a single setting never takes a page of its own.
 */
export function TunerPage() {
  const { t } = useTranslation(['practice', 'player'])
  const store = useSettingsStoreApi()
  const { a4 } = useSettings(selectTuner)
  const label = t('practice:tools.tuner.settings')
  return (
    <ToolPage
      title={t('practice:pages.tuner')}
      controls={
        <SettingsGroup title={t('practice:tools.tuner.group')} className="mx-auto w-full max-w-lg">
          <div
            data-setting="tuner.a4"
            className="flex min-h-12 flex-wrap items-center justify-between gap-3"
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
              format={(hz) => t('player:tuner.reference', { hz })}
              onChange={(hz) => setTunerA4(store, hz)}
              decrease={t('player:tuner.lower')}
              increase={t('player:tuner.higher')}
            />
          </div>
        </SettingsGroup>
      }
    >
      <TunerReadout listening large />
    </ToolPage>
  )
}
