import { useTranslation } from 'react-i18next'
import { GRID_BARS, useGridBars, useSettingsStoreApi } from '@/entities/settings'
import { setScoreView } from '@/features/set-preference'
import { GroupRow, Segmented } from '@/shared/ui'
import { PartRows } from './PartRows'
import { ViewPart } from './ViewPart'

/**
 * The Grid's own part of the View, one card of rows as PlayerViewGrid's Grid settings draw it: Bars
 * per row, two or four; then its words under the beats they are sung on (ADR 0108, Chordify's
 * Lyrics button), a switch row as the View's other parts are, greyed where the music has none
 * (`noWords`, why).
 */
export function GridFields({ noWords }: { noWords?: string | undefined }) {
  const { t } = useTranslation(['player', 'music'])
  const store = useSettingsStoreApi()
  const bars = useGridBars()
  return (
    <PartRows>
      <GroupRow label={t('views.barsPerRow')}>
        <span className="w-25 shrink-0">
          <Segmented
            label={t('views.barsPerRow')}
            value={bars}
            options={GRID_BARS.map((each) => ({ value: each, label: String(each) }))}
            onChange={(gridBars) => setScoreView(store, { gridBars })}
          />
        </span>
      </GroupRow>
      <ViewPart part="lyrics" reason={noWords} />
    </PartRows>
  )
}
