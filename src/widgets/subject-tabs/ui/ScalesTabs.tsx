import { useTranslation } from 'react-i18next'
import { IN_PLACE } from '@/shared/lib'
import { NavTab, NavTabs } from '@/shared/ui'
import type { ScaleShow } from '@/widgets/scale-explorer'

/**
 * A scale's views as tabs, each the same scale under another light: its run, its chords, its key.
 * Only the views the scale has are offered; a tab keeps the scale and changes the view in place.
 */
export function ScalesTabs({
  shows,
  current,
}: {
  shows: readonly ScaleShow[]
  current: ScaleShow
}) {
  const { t } = useTranslation(['practice', 'learn'])
  return (
    <NavTabs label={t('practice:subjects.scales')}>
      {shows.map((show) => (
        <NavTab
          key={show}
          from="/practice/scales"
          to="/practice/scales"
          search={(prev) => ({ ...prev, show })}
          {...IN_PLACE}
          current={show === current}
        >
          {t(`learn:show.${show}`)}
        </NavTab>
      ))}
    </NavTabs>
  )
}
