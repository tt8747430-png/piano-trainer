import { Milestone } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { BARS_PER_LINE, STAFF_SIZES, useSectionHeading, type StaffSize } from '@/entities/piece'
import {
  EDITOR_START_MODES,
  PALETTE_SIDES,
  selectEditing,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { MetronomeSwitch, TuneSwitch } from '@/features/record-take'
import { barsOf, MOST_BARS } from '@/features/score-editor'
import { setEditing } from '@/features/set-preference'
import {
  ChoiceCard,
  ChoiceRow,
  Dropdown,
  SettingRows,
  SettingsGroup,
  Stepper,
  SwitchRow,
} from '@/shared/ui'
import { InstrumentList, type InstrumentFamily } from '@/widgets/instrument-list'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { KeyPicker } from './KeyPicker'
import { TempoPicker } from './TempoPopover'
import { TimePicker } from './TimePicker'
import type { ScorePage } from '../model/score-pages'

/**
 * The Key signature's or Time signature's page (R29, 3.5): From — the start, or a section, by its
 * first bar — then the picker the printed sign opens, changing it from there on.
 */
function SignaturePage({ sign, onDone }: { sign: 'key' | 'time'; onDone: () => void }) {
  const { t } = useTranslation('editor')
  const named = useSectionHeading()
  const sections = useEditorState((state) => state.draft.sections)
  const starts = useEditorState(
    useShallow((state) => {
      const firsts: number[] = []
      for (const placed of barsOf(state.draft))
        if (firsts[placed.section] === undefined) firsts[placed.section] = placed.index
      return firsts
    }),
  )
  const [from, setFrom] = useState(0)
  return (
    <>
      {starts.length > 1 ? (
        <SettingsGroup flush>
          <ChoiceRow title={t('signature.from')} icon={Milestone} paint="sky">
            <Dropdown
              label={t('signature.from')}
              bare
              align="end"
              value={String(from)}
              options={starts.map((bar, section) => ({
                value: String(bar),
                label:
                  section === 0
                    ? t('signature.start')
                    : t('signature.sectionAt', {
                        section: named({
                          ...(sections[section]?.heading ?? { kind: 'verse' }),
                          lines: [],
                        }),
                        bar: bar + 1,
                      }),
              }))}
              onChange={(bar) => setFrom(Number(bar))}
            />
          </ChoiceRow>
        </SettingsGroup>
      ) : null}
      <div className="card p-4">
        {sign === 'key' ? (
          <KeyPicker key={from} bar={from} />
        ) : (
          <TimePicker key={from} bar={from} onDone={onDone} />
        )}
      </div>
    </>
  )
}

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
    case 'time':
      return <SignaturePage sign={page} onDone={onDone} />
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
        <>
          <SettingsGroup flush>
            <SwitchRow
              setting="editing.hearNotes"
              label={t('scoreSettings.hearNotes')}
              info={t('scoreSettings.hearNotesInfo')}
              checked={editing.hearNotes}
              onCheckedChange={(hearNotes) => setEditing(settings, { hearNotes })}
            />
          </SettingsGroup>
          <ChoiceCard
            setting="editing.startMode"
            title={t('scoreSettings.startMode')}
            info={t('scoreSettings.startModeInfo')}
            value={editing.startMode}
            options={EDITOR_START_MODES.map((mode) => ({
              value: mode,
              label: t(`scoreSettings.startModes.${mode}`),
              example: t(`scoreSettings.startModeExamples.${mode}`),
            }))}
            onChange={(startMode) => setEditing(settings, { startMode })}
          />
          {/* The palette docks beside the sheet from 48rem wide; a phone's is a sheet at the foot. */}
          <div className="hidden md:contents">
            <ChoiceCard
              setting="editing.paletteSide"
              title={t('scoreSettings.paletteSide')}
              value={editing.paletteSide}
              options={PALETTE_SIDES.map((side) => ({
                value: side,
                label: t(`scoreSettings.paletteSides.${side}`),
              }))}
              onChange={(paletteSide) => setEditing(settings, { paletteSide })}
            />
          </div>
        </>
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
