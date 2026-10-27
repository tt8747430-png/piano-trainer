import { GalleryHorizontalEnd, LayoutGrid } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  DIAGRAMS_MODES,
  selectScoreView,
  useSettings,
  useSettingsStoreApi,
  type DiagramsMode,
} from '@/entities/settings'
import { setScoreView } from '@/features/set-preference'
import { Labelled, Segmented } from '@/shared/ui'
import { PartChips } from './PartChip'
import { ViewChip } from './ViewChip'

/** Each mode drawn: the chord sounding with the next behind it; the song's chords in a grid. */
const MODE_ICONS = {
  animated: GalleryHorizontalEnd,
  summary: LayoutGrid,
} as const satisfies Record<DiagramsMode, unknown>

/**
 * Diagrams' own part of the View (ADR 0102, Chordify's "Diagram view mode"): its mode first,
 * Animated or Summary, what each does the ⓘ beside its name; then the words sung under its strip,
 * greyed where the music has none (`noWords`, why).
 */
export function DiagramsFields({ noWords }: { noWords?: string | undefined }) {
  const { t } = useTranslation(['player', 'music'])
  const store = useSettingsStoreApi()
  const mode = useSettings((state) => selectScoreView(state).diagrams)
  return (
    <>
      <Labelled label={t('views.mode.label')} info={t('views.mode.about')}>
        <Segmented
          label={t('views.mode.label')}
          value={mode}
          options={DIAGRAMS_MODES.map((each) => {
            const Icon = MODE_ICONS[each]
            return {
              value: each,
              label: t(`views.mode.${each}`),
              icon: <Icon aria-hidden className="size-5" />,
            }
          })}
          onChange={(diagrams) => setScoreView(store, { diagrams })}
        />
      </Labelled>
      <PartChips label={t('music:view.show')}>
        <ViewChip part="lyrics" reason={noWords} />
      </PartChips>
    </>
  )
}
