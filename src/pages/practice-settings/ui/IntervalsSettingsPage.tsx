import { useTranslation } from 'react-i18next'
import {
  INTERVAL_ORDERS,
  INTERVAL_SPEEDS,
  selectIntervals,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setIntervals } from '@/features/set-preference'
import { Segmented, SettingField, SettingRows, SettingsGroup } from '@/shared/ui'
import { PracticeSettingsScreen } from './PracticeSettingsScreen'

/**
 * Intervals' Settings (canvas 176): how Play all goes through the intervals (in the page's order, or
 * shuffled each time) and how fast every interval plays, its two notes and the next one after it.
 */
export function IntervalsSettingsPage() {
  const { t } = useTranslation('practice')
  const store = useSettingsStoreApi()
  const intervals = useSettings(selectIntervals)
  return (
    <PracticeSettingsScreen title={t('pages.intervals')}>
      <SettingsGroup>
        <SettingRows>
          <SettingField setting="intervals.order" label={t('intervals.order.label')}>
            <Segmented
              label={t('intervals.order.label')}
              value={intervals.order}
              options={INTERVAL_ORDERS.map((order) => ({
                value: order,
                label: t(`intervals.order.${order}`),
              }))}
              onChange={(order) => setIntervals(store, { order })}
            />
          </SettingField>
          <SettingField setting="intervals.speed" label={t('intervals.speed.label')}>
            <Segmented
              label={t('intervals.speed.label')}
              value={intervals.speed}
              options={INTERVAL_SPEEDS.map((speed) => ({
                value: speed,
                label: t(`intervals.speed.${speed}`),
              }))}
              onChange={(speed) => setIntervals(store, { speed })}
            />
          </SettingField>
        </SettingRows>
      </SettingsGroup>
    </PracticeSettingsScreen>
  )
}
