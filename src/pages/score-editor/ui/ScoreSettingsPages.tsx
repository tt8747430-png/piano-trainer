import { useTranslation } from 'react-i18next'
import { BARS_PER_LINE, STAFF_SIZES, type StaffSize } from '@/entities/piece'
import { selectEditing, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { MetronomeSwitch, TuneSwitch } from '@/features/record-take'
import { MOST_BARS } from '@/features/score-editor'
import { setEditing } from '@/features/set-preference'
import { ChoiceCard, SettingRows, SettingsGroup, Stepper, SwitchRow } from '@/shared/ui'
import { InstrumentList, type InstrumentFamily } from '@/widgets/instrument-list'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { KeyPicker } from './KeyPicker'
import { TempoPicker } from './TempoPopover'
import { TimePicker } from './TimePicker'
import type { ScorePage } from '../model/score-pages'

/** Bars per line offered: as the notes space them, or a few to a line (Flat's). */
const LINE_BARS = [0, 2, 3, 4, 5, 6].filter((most) => most <= BARS_PER_LINE.max)

/**
 * A page of the score's Settings: its Staves (Flat's Manage instruments), Key signature, Time
 * signature and Tempo (the pickers the printed marks open), Bars, Layout, Note input and Recording.
 */
export function ScorePageBody({
  page,
  families,
  bars,
  onBars,
  onDone,
}: {
  page: ScorePage
  families: readonly InstrumentFamily[]
  bars: number
  onBars: (count: number) => void
  onDone: () => void
}) {
  const { t } = useTranslation(['editor', 'songs'])
  const { actions } = useScoreEditorContext()
  const settings = useSettingsStoreApi()
  const editing = useSettings(selectEditing)
  const layout = useEditorState((state) => state.draft.layout)
  switch (page) {
    case 'staves':
      return (
        <SettingsGroup bare info={t('scoreSettings.instrumentsInfo')}>
          <InstrumentList families={families} />
        </SettingsGroup>
      )
    case 'key':
      return (
        <div className="card p-4">
          <KeyPicker bar={0} />
        </div>
      )
    case 'time':
      return (
        <div className="card p-4">
          <TimePicker bar={0} onDone={onDone} />
        </div>
      )
    case 'tempo':
      return (
        <div className="card p-4">
          <TempoPicker onDone={onDone} />
        </div>
      )
    case 'bars':
      return (
        <SettingsGroup info={t('scoreSettings.barsInfo')} title={t('scoreSettings.pages.bars')}>
          <Stepper
            label={t('scoreSettings.pages.bars')}
            typed
            value={bars}
            min={1}
            max={MOST_BARS}
            format={(value) => t('songs:setup.barsValue', { count: value })}
            onChange={onBars}
            decrease={t('songs:setup.fewerBars')}
            increase={t('songs:setup.moreBars')}
          />
        </SettingsGroup>
      )
    case 'layout':
      return (
        <>
          <ChoiceCard
            title={t('scoreSettings.staffSize')}
            info={t('scoreSettings.staffSizeInfo')}
            value={String(layout?.staffSize ?? 100)}
            options={STAFF_SIZES.map((size) => ({
              value: String(size),
              label: t(`scoreSettings.staffSizes.${size}`),
            }))}
            onChange={(size) =>
              actions.dispatch({ type: 'layout', staffSize: Number(size) as StaffSize })
            }
          />
          <ChoiceCard
            title={t('scoreSettings.barsPerLine')}
            info={t('scoreSettings.barsPerLineInfo')}
            value={String(layout?.barsPerLine ?? 0)}
            options={LINE_BARS.map((most) => ({
              value: String(most),
              label: most === 0 ? t('scoreSettings.asWritten') : String(most),
            }))}
            onChange={(most) =>
              actions.dispatch({ type: 'layout', barsPerLine: most === '0' ? null : Number(most) })
            }
          />
        </>
      )
    case 'input':
      return (
        <SettingsGroup flush>
          <SwitchRow
            setting="editing.hearNotes"
            label={t('scoreSettings.hearNotes')}
            info={t('scoreSettings.hearNotesInfo')}
            checked={editing.hearNotes}
            onCheckedChange={(hearNotes) => setEditing(settings, { hearNotes })}
          />
        </SettingsGroup>
      )
    case 'recording':
      return (
        <SettingsGroup flush>
          <SettingRows>
            <MetronomeSwitch />
            <TuneSwitch />
          </SettingRows>
        </SettingsGroup>
      )
  }
}
