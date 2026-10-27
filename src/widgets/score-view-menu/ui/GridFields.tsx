import { useTranslation } from 'react-i18next'
import { PartChips } from './PartChip'
import { ViewChip } from './ViewChip'

/**
 * The Grid's own part of the View (ADR 0108, Chordify's Lyrics button): its words under the beats
 * they are sung on, a chip as the View's other parts are (ADR 0115), greyed where the music has none
 * (`noWords`, why).
 */
export function GridFields({ noWords }: { noWords?: string | undefined }) {
  const { t } = useTranslation('music')
  return (
    <PartChips label={t('view.show')}>
      <ViewChip part="lyrics" reason={noWords} />
    </PartChips>
  )
}
