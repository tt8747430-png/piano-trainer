import { useTranslation } from 'react-i18next'
import { ACCOMPANIMENT_PARTS, usePartName } from '@/entities/pattern'
import { selectAccompaniment, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setAccompaniment } from '@/features/set-preference'
import { SettingRows, SettingsGroup, SwitchRow } from '@/shared/ui'
import { PracticeSettingsScreen } from './PracticeSettingsScreen'

/**
 * Accompaniment's Settings (A24): which of its sources show as its tabs. The last one shown can't be
 * turned off, so the page always has one.
 */
export function AccompanimentSettingsPage() {
  const { t } = useTranslation('practice')
  const store = useSettingsStoreApi()
  const { hidden } = useSettings(selectAccompaniment)
  const partName = usePartName()
  const shown = ACCOMPANIMENT_PARTS.filter((part) => !hidden.includes(part))
  return (
    <PracticeSettingsScreen title={t('pages.accompaniment')}>
      {/* One preference, a switch a source: the group carries its key. */}
      <div data-setting="accompaniment.hidden">
        <SettingsGroup title={t('settings.sources')}>
          <SettingRows>
            {ACCOMPANIMENT_PARTS.map((part) => {
              const on = !hidden.includes(part)
              return (
                <SwitchRow
                  key={part}
                  label={partName(part)}
                  checked={on}
                  disabled={on && shown.length === 1}
                  reason={t('settings.lastSource')}
                  onCheckedChange={(next) => setAccompaniment(store, part, next)}
                />
              )
            })}
          </SettingRows>
        </SettingsGroup>
      </div>
    </PracticeSettingsScreen>
  )
}
