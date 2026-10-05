import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { IN_PLACE } from '@/shared/lib'
import { NavTabs } from '@/shared/ui'
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
    <NavTabs
      label={t('practice:subjects.scales')}
      tabs={shows.map((show) => ({
        id: show,
        label: t(`learn:show.${show}`),
        current: show === current,
        render: (
          <Link
            from="/practice/scales"
            to="/practice/scales"
            search={(prev) => ({ ...prev, show })}
            {...IN_PLACE}
          />
        ),
      }))}
    />
  )
}
