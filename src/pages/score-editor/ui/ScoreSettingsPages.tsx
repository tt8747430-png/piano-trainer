import { Columns3, Gauge, Hash, Mic, Milestone, Music2, Ruler, Volume2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { fullLayout, useSectionHeading } from '@/entities/piece'
import {
  PALETTE_SIDES,
  RECORDER_COUNT_INS,
  selectEditing,
  selectRecorder,
  type RecorderCountIn,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { MetronomeSwitch, TuneSwitch } from '@/features/record-take'
import { barsOf, MOST_BARS } from '@/features/score-editor'
import { setEditing, setRecorderCountIn } from '@/features/set-preference'
import { useKeyName } from '@/shared/i18n'
import { beatUnit, tempoMark, unitNote } from '@/shared/lib/music'
import {
  ChoiceCard,
  ChoiceRow,
  Dropdown,
  RowTrigger,
  SettingRows,
  SettingsGroup,
  Stepper,
  SwitchRow,
} from '@/shared/ui'
import { InstrumentsPanel } from './InstrumentsPanel'
import { LayoutPanel } from './LayoutPanel'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import type { GearPage } from '../model/gear-pages'
import { KeyPicker } from './KeyPicker'
import { TempoPicker } from './TempoPopover'
import { TimePicker } from './TimePicker'

/**
 * The Key signature's or Time signature's page (R29, 3.5): From — the start, or a section, by its
 * first bar — then the picker the printed sign opens, changing it from there on.
 */
function SignaturePage({ sign }: { sign: 'key' | 'time' }) {
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
          <TimePicker key={from} bar={from} />
        )}
      </div>
    </>
  )
}

/**
 * Music (R31-E), a page of the gear's Settings: its Staves, Key signature, Time signature, Tempo and
 * Bars, each a row with its value turning to its own page.
 */
export function MusicPage() {
  const { t } = useTranslation(['editor', 'music'])
  const { view } = useScoreEditorContext()
  const keyName = useKeyName()
  const draft = useEditorState((state) => state.draft)
  const bars = barsOf(draft).length
  const unit = draft.tempoUnit ?? beatUnit(draft.meter)
  const mark = Math.round(tempoMark(draft.tempo, unit, draft.meter))
  const meter = draft.timeSymbol
    ? t(draft.meter === '2/2' ? 'music:timeField.cut' : 'music:timeField.common')
    : draft.meter
  // Each instrument once: every single staff, and the piano where it is in sight.
  const staffCount = draft.staves.length + (draft.leadSheet ? 0 : 1)
  const turn = (page: GearPage) => () => view.setGear(page)
  return (
    <SettingsGroup flush>
      <RowTrigger
        title={t('scoreSettings.pages.staves')}
        icon={Music2}
        paint="lilac"
        value={String(staffCount)}
        onClick={turn('staves')}
      />
      <RowTrigger
        title={t('scoreSettings.pages.key')}
        icon={Hash}
        paint="sky"
        value={keyName(draft.key)}
        onClick={turn('key')}
      />
      <RowTrigger
        title={t('scoreSettings.pages.time')}
        icon={Music2}
        paint="sky"
        value={meter}
        onClick={turn('time')}
      />
      <RowTrigger
        title={t('scoreSettings.pages.tempo')}
        icon={Gauge}
        paint="sky"
        value={`${unitNote(unit)} = ${mark}`}
        onClick={turn('tempo')}
      />
      <RowTrigger
        title={t('scoreSettings.pages.bars')}
        icon={Columns3}
        paint="sky"
        value={String(bars)}
        onClick={turn('bars')}
      />
    </SettingsGroup>
  )
}

/**
 * How the editor works (R31-E), a page of the gear's Settings: Layout, Note input and Recording, each
 * a row turning to its own page.
 */
export function HowItWorksPage() {
  const { t } = useTranslation('editor')
  const { view } = useScoreEditorContext()
  const layout = useEditorState((state) => state.draft.layout)
  const laid = fullLayout(layout)
  return (
    <SettingsGroup flush>
      <RowTrigger
        title={t('scoreSettings.pages.layout')}
        icon={Ruler}
        paint="grass"
        value={t('layout.summary', {
          page: t(`layout.pageSizes.${laid.pageSize}`),
          size: t('layout.mm', { value: laid.staffSize }),
        })}
        onClick={() => view.setGear('layout')}
      />
      <RowTrigger
        title={t('scoreSettings.pages.input')}
        icon={Volume2}
        paint="yellow"
        onClick={() => view.setGear('input')}
      />
      <RowTrigger
        title={t('scoreSettings.pages.recording')}
        icon={Mic}
        paint="sand"
        onClick={() => view.setGear('recording')}
      />
    </SettingsGroup>
  )
}

/** The gear's Settings' own pages: Music's and How the editor works'. */
export type SettingsPage = Extract<
  GearPage,
  'staves' | 'key' | 'time' | 'tempo' | 'bars' | 'layout' | 'input' | 'recording'
>

/**
 * A page of the gear's Settings: its Staves (Flat's Manage instruments), Key signature, Time
 * signature and Tempo (the pickers the printed marks open), Bars, Layout, Note input and Recording.
 * Note input keeps Play notes while editing and the Palette side; the mode the editor writes in is
 * the palette's (R31-E).
 */
export function ScorePageBody({ page, onDone }: { page: SettingsPage; onDone: () => void }) {
  const { t } = useTranslation(['editor', 'songs', 'common'])
  const { actions } = useScoreEditorContext()
  const bars = useEditorState((state) => barsOf(state.draft).length)
  const settings = useSettingsStoreApi()
  const editing = useSettings(selectEditing)
  const recorder = useSettings(selectRecorder)
  switch (page) {
    case 'staves':
      return (
        <SettingsGroup bare info={t('scoreSettings.instrumentsInfo')}>
          <InstrumentsPanel />
        </SettingsGroup>
      )
    case 'key':
    case 'time':
      return <SignaturePage sign={page} />
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
            onChange={(count) => actions.dispatch({ type: 'barCount', count })}
            decrease={t('songs:setup.fewerBars')}
            increase={t('songs:setup.moreBars')}
          />
        </SettingsGroup>
      )
    case 'layout':
      return <LayoutPanel />
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
          {/* The palette docks beside the sheet from 48rem wide; a phone's floats at the foot. */}
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
        <>
          <SettingsGroup flush>
            <SettingRows>
              <MetronomeSwitch />
              <TuneSwitch />
            </SettingRows>
          </SettingsGroup>
          <ChoiceCard
            setting="recorder.countIn"
            title={t('common:recorderSettings.countIn')}
            info={t('common:recorderSettings.countInInfo')}
            value={String(recorder.countIn)}
            options={RECORDER_COUNT_INS.map((bars) => ({
              value: String(bars),
              label: t(`common:recorderSettings.countIns.${bars}`),
            }))}
            onChange={(bars) => setRecorderCountIn(settings, Number(bars) as RecorderCountIn)}
          />
        </>
      )
  }
}
