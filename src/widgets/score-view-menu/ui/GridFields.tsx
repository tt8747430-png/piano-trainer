import { useTranslation } from 'react-i18next'
import { GRID_BARS, useGridBars, useSettingsStoreApi } from '@/entities/settings'
import { setScoreView } from '@/features/set-preference'
import { Labelled, Segmented } from '@/shared/ui'
import { PartChips } from './PartChip'
import { ViewChip } from './ViewChip'

/**
 * The Grid's own part of the View (PlayerViewGrid's Grid settings): Bars per row, two or four; then
 * its words under the beats they are sung on (ADR 0108, Chordify's Lyrics button), a chip as the
 * View's other parts are (ADR 0115), greyed where the music has none (`noWords`, why).
 */
export function GridFields({ noWords }: { noWords?: string | undefined }) {
  const { t } = useTranslation(['player', 'music'])
  const store = useSettingsStoreApi()
  const bars = useGridBars()
  return (
    <>
      <Labelled label={t('views.barsPerRow')}>
        <Segmented
          label={t('views.barsPerRow')}
          value={bars}
          options={GRID_BARS.map((each) => ({ value: each, label: String(each) }))}
          onChange={(gridBars) => setScoreView(store, { gridBars })}
        />
      </Labelled>
      <PartChips label={t('music:view.show')}>
        <ViewChip part="lyrics" reason={noWords} />
      </PartChips>
    </>
  )
}
