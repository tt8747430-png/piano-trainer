import { Link } from '@tanstack/react-router'
import { Timer } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  COUNTDOWNS,
  CURSORS,
  FOLLOW_RETURNS,
  type FollowReturn,
  OTHER_HAND_LOOKS,
  SPEED_STEPS,
  selectOtherHand,
  selectPlayback,
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
  SwitchRow,
  VolumeSlider,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** A track the Audio playback lists: its id and its name. */
export interface VolumeTrack {
  readonly id: TrackId
  readonly label: string
}

/**
 * The Player's settings (B7, Flat's Playback options and the reference's Display): how it always
 * plays, for every song. Audio playback: each track's volume (a song's own staves by name where the
 * page is a song's, else the piano's two and the recording), the metronome's, and Only the chords;
 * the Metronome's sound and beats a row to its own page (A39). Playback speed: speed training's step.
 * Display: the count-in, the cursor, the layout, the keys and the finger numbers. Practice: the other
 * hand's look and its Wait-mode accompaniment (A35). Pedal: as written, off, or automatic (A27).
 */
/** The piano's staves' and a recording's volumes, for every song (Settings › Player, R31-P: a song's are its Staves page's). */
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

/**
 * How the Player plays, every song (the Player's Settings › Playback, R31-P, R32): the music's own
 * first (`children`: a score's Swing), then the count-in, the pedalling, the metronome (its page and
 * its level), speed training's step and the other hand's look; each choice a card with its line.
 */
export function PlayerPlayback({ children }: { children?: ReactNode }) {
  const { t } = useTranslation(['player', 'music'])
  const locale = useLocale()
  const settings = useSettingsStoreApi()
  const playback = useSettings(selectPlayback)
  const otherHand = useSettings(selectOtherHand)
  const click = useSettings((state) => selectSound(state).click)
  return (
    <>
      {children}
      <ChoiceCard
        title={t('settingsPage.countdown.label')}
        description={t('settingsPage.countdown.detail')}
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
        description={t('settingsPage.pedal.detail')}
        info={t('settingsPage.pedal.info')}
        setting="playback.pedal"
        value={playback.pedal}
        options={PEDAL_PLAYS.map((value) => ({ value, label: t(`settingsPage.pedal.${value}`) }))}
        onChange={(pedal) => setPlayback(settings, { pedal })}
      />
      <SettingsGroup flush>
        <RowLink
          title={t('settingsPage.metronome')}
          icon={Timer}
          paint="sand"
          render={<Link to="/practice/metronome" />}
        />
        <div className="px-4 pt-3">
          <VolumeSlider
            label={t('sound.click')}
            setting="sound.click"
            value={click}
            onChange={(percent) => setSound(settings, { click: percent })}
          />
        </div>
      </SettingsGroup>
      <ChoiceCard
        title={t('pace.speedTraining')}
        description={t('settingsPage.speedStepDetail')}
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
        description={t('settingsPage.otherHand.detail')}
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

/**
 * How the Player shows the music while it plays (the Player's Settings › Score view, R29 B8, R32):
 * the cursor and following the music, then annotations and Pick your view on opening; each with
 * its line. The count-in is Playback's.
 */
export function PlayerDisplay() {
  const { t } = useTranslation('player')
  const settings = useSettingsStoreApi()
  const playback = useSettings(selectPlayback)
  const annotations = useSettings((state) => selectScoreView(state).annotations)
  const askOnOpen = useSettings((state) => selectScoreView(state).askOnOpen)
  return (
    <>
      <ChoiceCard
        title={t('settingsPage.cursor.label')}
        description={t('settingsPage.cursor.detail')}
        info={t('settingsPage.cursor.info')}
        setting="playback.cursor"
        value={playback.cursor}
        options={CURSORS.map((value) => ({ value, label: t(`settingsPage.cursor.${value}`) }))}
        onChange={(cursor) => setPlayback(settings, { cursor })}
      />
      {/* The views' one follow rule (A37). */}
      <SettingsGroup flush>
        <SwitchRow
          setting="playback.follow"
          label={t('settingsPage.follow.label')}
          description={t('settingsPage.follow.detail')}
          info={t('settingsPage.follow.info')}
          checked={playback.follow}
          onCheckedChange={(follow) => setPlayback(settings, { follow })}
        />
      </SettingsGroup>
      {playback.follow ? (
        <ChoiceCard
          title={t('settingsPage.follow.return')}
          info={t('settingsPage.follow.returnInfo')}
          setting="playback.followReturn"
          value={String(playback.followReturn)}
          options={FOLLOW_RETURNS.map((seconds) => ({
            value: String(seconds),
            label:
              seconds === 0
                ? t('settingsPage.follow.off')
                : t('settingsPage.follow.seconds', { count: seconds }),
          }))}
          onChange={(value) =>
            setPlayback(settings, { followReturn: Number(value) as FollowReturn })
          }
        />
      ) : null}
      <SettingsGroup flush>
        {/* Pick your view opened as a song opens (ADR 0108): a setting, so here, never in the popover (A4). */}
        <SwitchRow
          setting="scoreView.askOnOpen"
          label={t('views.showOnOpen')}
          checked={askOnOpen}
          onCheckedChange={(ask) => setScoreView(settings, { askOnOpen: ask })}
        />
        <SwitchRow
          setting="scoreView.annotations"
          label={t('settingsPage.annotations')}
          description={t('settingsPage.annotationsDetail')}
          checked={annotations}
          onCheckedChange={(on) => setScoreView(settings, { annotations: on })}
        />
      </SettingsGroup>
    </>
  )
}

/** Every page of the Player's Settings in one column, for a screen with no Player to open them from
 * (Settings › Player, a song's /settings link). */
export function PlayerSettings({ tracks }: { tracks: readonly VolumeTrack[] }) {
  return (
    <>
      <PlayerVolumes tracks={tracks} />
      <PlayerPlayback />
      <PlayerDisplay />
    </>
  )
}
