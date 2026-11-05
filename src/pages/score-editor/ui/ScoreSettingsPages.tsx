import { useTranslation } from 'react-i18next'
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
import { setEditing, setRecorderCountIn } from '@/features/set-preference'
import { ChoiceCard, SettingRows, SettingsGroup, SwitchRow } from '@/shared/ui'
import { InstrumentsPanel } from './InstrumentsPanel'
import { LayoutPanel } from './LayoutPanel'
import type { GearPage } from '../model/gear-pages'

/** The gear's Settings' own pages (R32-B): what the score does not print. */
export type SettingsPage = Extract<GearPage, 'instruments' | 'layout' | 'input' | 'recording'>

/**
 * A page of the gear's Settings (R32-B, Flat's document menu): Instruments (Flat's Manage
 * instruments), Layout, Note input and Recording. The key, time, tempo, bars and title are set where
 * they print (ADR 0114), never here. Note input keeps Play notes while editing and the Palette side.
 */
export function ScorePageBody({ page }: { page: SettingsPage }) {
  const { t } = useTranslation(['editor', 'common'])
  const settings = useSettingsStoreApi()
  const editing = useSettings(selectEditing)
  const recorder = useSettings(selectRecorder)
  switch (page) {
    case 'instruments':
      return (
        <SettingsGroup bare info={t('scoreSettings.instrumentsInfo')}>
          <InstrumentsPanel />
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
