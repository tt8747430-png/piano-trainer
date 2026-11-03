import { Link } from '@tanstack/react-router'
import { Timer } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  COUNTDOWNS,
  CURSORS,
  OTHER_HAND_LOOKS,
  SPEED_STEPS,
  selectOtherHand,
  selectPlayback,
  selectPractice,
  selectScoreView,
  selectSound,
  type SpeedStep,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import type { TrackId } from '@/features/practice'
import {
  onlyTheChords,
  setOtherHand,
  setPlayback,
  setPracticeToggle,
  setScoreView,
  setSound,
  setStaffVolume,
} from '@/features/set-preference'
import { formatPercent, useLocale } from '@/shared/i18n'
import { PEDAL_PLAYS } from '@/shared/lib/schedule'
import {
  RowLink,
  ChoiceCard,
  SettingRows,
  SettingsGroup,
  SheetLayoutField,
  SwitchRow,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'

/** A volume as a screen reader says it: its percent, as the language writes one. */
const PERCENT = { style: 'unit', unit: 'percent' } as const
/** A volume's steps on its slider, and with the arrow keys. */
const VOLUME_STEP = 5

/** A track the Audio playback lists: its id and its name. */
export interface VolumeTrack {
  readonly id: TrackId
  readonly label: string
}

/** One volume: its name and percent over its slider, saved as it moves. */
function VolumeSlider({
  label,
  setting,
  value,
  onChange,
}: {
  label: string
  setting: string
  value: number
  onChange: (percent: number) => void
}) {
  const locale = useLocale()
  return (
    <div data-setting={setting}>
      <Slider
        min={0}
        max={100}
        step={VOLUME_STEP}
        value={value}
        onValueChange={onChange}
        format={PERCENT}
        locale={locale}
        className="flex flex-col gap-2 pb-2.5"
      >
        <div className="flex justify-between gap-3 text-base">
          <SliderLabel>{label}</SliderLabel>
          <span className="text-muted-foreground tabular-nums">{formatPercent(locale, value)}</span>
        </div>
      </Slider>
    </div>
  )
}

/**
 * The Player's settings (B7, Flat's Playback options and the reference's Display): how it always
 * plays, for every song. Audio playback: each track's volume (a song's own staves by name where the
 * page is a song's, else the piano's two and the recording), the metronome's, and Only the chords;
 * the Metronome's sound and beats a row to its own page (A39). Playback speed: speed training's step.
 * Display: the count-in, the cursor, the layout, the keys and the finger numbers. Practice: the other
 * hand's look and its Wait-mode accompaniment (A35). Pedal: as written, off, or automatic (A27).
 */
/** The volumes of this music's staves, its recording and the click (the Player's Settings › Volume). */
export function PlayerVolumes({ tracks }: { tracks: readonly VolumeTrack[] }) {
  const { t } = useTranslation(['player', 'music'])
  const settings = useSettingsStoreApi()
  const sound = useSettings(selectSound)
  const recording = tracks.some((track) => track.id === 'recording')
  return (
    <SettingsGroup title={t('settingsPage.audio')} info={t('settingsPage.audioInfo')}>
      <SettingRows>
        {tracks.map(({ id, label }) =>
          id === 'recording' ? (
            <VolumeSlider
              key={id}
              label={label}
              setting="sound.recording"
              value={sound.recording}
              onChange={(percent) => setSound(settings, { recording: percent })}
            />
          ) : (
            <VolumeSlider
              key={id}
              label={label}
              setting="sound.staves"
              value={sound.staves[id] ?? 100}
              onChange={(percent) => setStaffVolume(settings, id, percent)}
            />
          ),
        )}
        <VolumeSlider
          label={t('sound.click')}
          setting="sound.click"
          value={sound.click}
          onChange={(percent) => setSound(settings, { click: percent })}
        />
      </SettingRows>
      {recording ? (
        <Button
          variant="outline"
          className="min-h-11 self-start rounded-pill px-4 text-base"
          onClick={() => onlyTheChords(settings)}
        >
          {t('sound.onlyChords')}
        </Button>
      ) : null}
    </SettingsGroup>
  )
}

/** What the sheet shows, every song (the Player's Settings › Display). */
export function PlayerDisplay() {
  const { t } = useTranslation(['player', 'music'])
  const settings = useSettingsStoreApi()
  const practice = useSettings(selectPractice)
  const view = useSettings(selectScoreView)
  return (
    <>
      <div data-setting="scoreView.layout" className="card px-5 py-4">
        <SheetLayoutField
          value={view.layout}
          onChange={(layout) => setScoreView(settings, { layout })}
        />
      </div>
      <SettingsGroup flush>
        <SwitchRow
          setting="practice.fingerNumbers"
          label={t('music:view.parts.fingers')}
          checked={practice.fingerNumbers}
          onCheckedChange={(on) => setPracticeToggle(settings, 'fingerNumbers', on)}
        />
      </SettingsGroup>
    </>
  )
}

/** How the Player plays, every song (the Player's Settings › Playback): each choice a card (R29). */
export function PlayerPlayback() {
  const { t } = useTranslation(['player', 'music'])
  const locale = useLocale()
  const settings = useSettingsStoreApi()
  const playback = useSettings(selectPlayback)
  const otherHand = useSettings(selectOtherHand)
  return (
    <>
      <ChoiceCard
        title={t('settingsPage.countdown.label')}
        info={t('settingsPage.countdown.info')}
        setting="playback.countdown"
        value={playback.countdown}
        options={COUNTDOWNS.map((value) => ({
          value,
          label: t(`settingsPage.countdown.${value}`),
        }))}
        onChange={(countdown) => setPlayback(settings, { countdown })}
      />
      <ChoiceCard
        title={t('settingsPage.pedal.label')}
        info={t('settingsPage.pedal.info')}
        setting="playback.pedal"
        value={playback.pedal}
        options={PEDAL_PLAYS.map((value) => ({ value, label: t(`settingsPage.pedal.${value}`) }))}
        onChange={(pedal) => setPlayback(settings, { pedal })}
      />
      <ChoiceCard
        title={t('settingsPage.cursor.label')}
        info={t('settingsPage.cursor.info')}
        setting="playback.cursor"
        value={playback.cursor}
        options={CURSORS.map((value) => ({ value, label: t(`settingsPage.cursor.${value}`) }))}
        onChange={(cursor) => setPlayback(settings, { cursor })}
      />
      <ChoiceCard
        title={t('pace.speedTraining')}
        info={t('settingsPage.speedStepInfo')}
        setting="playback.speedStep"
        value={String(playback.speedStep)}
        options={SPEED_STEPS.map((step) => ({
          value: String(step),
          label: formatPercent(locale, step),
        }))}
        onChange={(step) => setPlayback(settings, { speedStep: Number(step) as SpeedStep })}
      />
      <ChoiceCard
        title={t('settingsPage.otherHand.label')}
        info={t('settingsPage.otherHand.info')}
        setting="otherHand.look"
        value={otherHand.look}
        options={OTHER_HAND_LOOKS.map((value) => ({
          value,
          label: t(`settingsPage.otherHand.${value}`),
        }))}
        onChange={(look) => setOtherHand(settings, { look })}
      />
    </>
  )
}

/** Every page of the Player's Settings in one column, for a screen with no Player to open them from
 * (Settings › Player, a song's /settings link). */
export function PlayerSettings({ tracks }: { tracks: readonly VolumeTrack[] }) {
  const { t } = useTranslation('player')
  return (
    <>
      <PlayerVolumes tracks={tracks} />
      <SettingsGroup flush>
        <RowLink
          title={t('settingsPage.metronome')}
          icon={Timer}
          paint="sand"
          render={<Link to="/practice/metronome" />}
        />
      </SettingsGroup>
      <PlayerPlayback />
      <PlayerDisplay />
    </>
  )
}
