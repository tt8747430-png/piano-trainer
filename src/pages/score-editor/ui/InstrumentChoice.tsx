import { useTranslation } from 'react-i18next'
import { INSTRUMENT_FAMILIES, instrumentsIn, type Instrument } from '@/shared/lib/music'
import { Dropdown } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** What a sung part is played on (ADR 0070), chosen from the instruments by family: 0 the tune's. */
export function InstrumentChoice({ part, label }: { part: number; label: string }) {
  const { t } = useTranslation('music')
  const { actions } = useScoreEditorContext()
  const instrument = useEditorState((state) => state.draft.instruments[part] ?? 'voice')
  return (
    <Dropdown<Instrument>
      label={label}
      value={instrument}
      groups={INSTRUMENT_FAMILIES.map((family) => ({
        label: t(`instrumentFamily.${family}`),
        options: instrumentsIn(family).map((each) => ({
          value: each,
          label: t(`instrument.${each}`),
        })),
      }))}
      onChange={(next) => actions.dispatch({ type: 'instrument', part, instrument: next })}
    />
  )
}
