import { useTranslation } from 'react-i18next'
import { A4_RANGE, selectTuner, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setTunerA4 } from '@/features/set-preference'
import { GroupRow, GroupRows, Stepper } from '@/shared/ui'
import { ToolPage } from '@/widgets/tool-page'
import { TunerReadout } from '@/widgets/tuner'

/**
 * The Tuner (canvas 180), a tool of its own on the tools' layout: the readout listening while the page
 * is open (the note heard, how far in words, its Hz, the needle on its arc); under it on a phone,
 * beside it on a laptop, one group with its one setting, the reference pitch (A4 from 415 to 466 Hz,
 * 440 by default), which the Player's Tuner sheet reads too. No gear and no floating bar.
 */
export function TunerPage() {
  const { t } = useTranslation(['practice', 'player'])
  const store = useSettingsStoreApi()
  const { a4 } = useSettings(selectTuner)
  const label = t('practice:tools.tuner.settings')
  return (
    <ToolPage
      title={t('practice:pages.tuner')}
      column={720}
      side={
        <GroupRows label={label} surface="sheet">
          <GroupRow label={label} setting="tuner.a4">
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
          </GroupRow>
        </GroupRows>
      }
    >
      {/* 24 under the bar and 32 over its row, as the board's page. */}
      <div className="mt-4 mb-3 flex w-full flex-1 flex-col lg:mb-2">
        <TunerReadout />
      </div>
    </ToolPage>
  )
}
