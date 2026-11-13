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
  SKIN_TONES,
  SPEED_STEPS,
  selectHandsView,
  selectOtherHand,
  selectPlayback,
  selectScoreView,
  selectSound,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import {
  setHandsView,
  setOtherHand,
  setPlayback,
  setScoreView,
  setSound,
} from '@/features/set-preference'
import { formatPercent, useLocale } from '@/shared/i18n'
import { RowLink, ChoiceCard, SettingsGroup, SwitchRow, VolumeSlider } from '@/shared/ui'

/**
 * How the Player plays, every song (the Player's Settings › Playback, R31-P, R32): the music's own
 * first (`children`: a score's Swing), then the count-in, the metronome (its page and its level) and
 * speed training's step; each choice a card. No pedalling: it plays as marked, else automatically (R37).
 */
export function PlayerPlayback({ children }: { children?: ReactNode }) {
  const { t } = useTranslation(['player', 'music'])
  const locale = useLocale()
  const settings = useSettingsStoreApi()
  const playback = useSettings(selectPlayback)
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
        onChange={(step) =>
          setPlayback(settings, {
            speedStep: SPEED_STEPS.find((each) => String(each) === step) ?? playback.speedStep,
          })
        }
      />
    </>
  )
}

/**
 * The hands (the Player's Settings › Hands, R36): the skin the hands at the keys are drawn in, and how
 * the hand not practised looks on the music.
 */
export function PlayerHands() {
  const { t } = useTranslation('player')
  const settings = useSettingsStoreApi()
  const otherHand = useSettings(selectOtherHand)
  const skin = useSettings((state) => selectHandsView(state).skin)
  return (
    <>
      <ChoiceCard
        title={t('settingsPage.skin.label')}
        description={t('settingsPage.skin.detail')}
        setting="handsView.skin"
        value={skin}
        options={SKIN_TONES.map((value) => ({ value, label: t(`settingsPage.skin.${value}`) }))}
        onChange={(tone) => setHandsView(settings, { skin: tone })}
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
