import { useTranslation } from 'react-i18next'
import {
  DIAGRAMS_MODES,
  selectScoreView,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setScoreView } from '@/features/set-preference'
import { GroupRow, InfoTip, Segmented } from '@/shared/ui'
import { PartRows } from './PartRows'
import { ViewPart } from './ViewPart'

/**
 * Diagrams' own part of the View (ADR 0108, Chordify's "Diagram view mode"), one card of rows as
 * its board draws it: its mode first, Animated or Summary, what each does the ⓘ beside its name;
 * then the words sung under its strip, greyed where the music has none (`noWords`, why).
 */
export function DiagramsFields({ noWords }: { noWords?: string | undefined }) {
  const { t } = useTranslation(['player', 'music'])
  const store = useSettingsStoreApi()
  const mode = useSettings((state) => selectScoreView(state).diagrams)
  return (
    <PartRows>
      <GroupRow
        label={
          <>
            {t('views.mode.label')}
            <InfoTip name={t('views.mode.label')} className="ms-1.5 align-middle">
              {t('views.mode.about')}
            </InfoTip>
          </>
        }
      >
        <span className="w-52 shrink-0">
          <Segmented
            label={t('views.mode.label')}
            value={mode}
            options={DIAGRAMS_MODES.map((each) => ({
              value: each,
              label: t(`views.mode.${each}`),
            }))}
            onChange={(diagrams) => setScoreView(store, { diagrams })}
          />
        </span>
      </GroupRow>
      <ViewPart part="lyrics" reason={noWords} />
    </PartRows>
  )
}
