import { useTranslation } from 'react-i18next'
import {
  INTERVAL_ORDERS,
  INTERVAL_SPEEDS,
  selectIntervals,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setIntervals } from '@/features/set-preference'
import { GroupRows, GroupSegmented } from '@/shared/ui'

/**
 * Interval settings, as IntervalsLaptop draws them (`IV_SET`): how Play all goes through the
 * intervals (in the page's order, or shuffled each time) and how fast every interval plays.
 */
export function IntervalSettings() {
  const { t } = useTranslation('practice')
  const store = useSettingsStoreApi()
  const intervals = useSettings(selectIntervals)
  return (
    <GroupRows label={t('intervals.settings')}>
      <GroupSegmented
        setting="intervals.order"
        label={t('intervals.order.label')}
        value={intervals.order}
        options={INTERVAL_ORDERS.map((order) => ({
          value: order,
          label: t(`intervals.order.${order}`),
        }))}
        onChange={(order) => setIntervals(store, { order })}
      />
      <GroupSegmented
        setting="intervals.speed"
        label={t('intervals.speed.label')}
        value={intervals.speed}
        options={INTERVAL_SPEEDS.map((speed) => ({
          value: speed,
          label: t(`intervals.speed.${speed}`),
        }))}
        onChange={(speed) => setIntervals(store, { speed })}
      />
    </GroupRows>
  )
}
