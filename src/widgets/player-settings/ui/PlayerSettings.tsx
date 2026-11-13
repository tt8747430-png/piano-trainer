import { Link } from '@tanstack/react-router'
import { Timer } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  COUNTDOWNS,
  OTHER_HAND_LOOKS,
  SPEED_STEPS,
  selectOtherHand,
  selectPlayback,
  selectSound,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setOtherHand, setPlayback, setSound } from '@/features/set-preference'
import { formatPercent, useLocale } from '@/shared/i18n'
import { RowLink, ChoiceCard, SettingsGroup, VolumeSlider } from '@/shared/ui'

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
 * The hands (the Player's Settings › Hands, R36): how the hand not practised looks on the music. The
 * hands at the keys are one neutral tone, no choice (R37).
 */
export function PlayerHands() {
  const { t } = useTranslation('player')
  const settings = useSettingsStoreApi()
  const otherHand = useSettings(selectOtherHand)
  return (
    <>
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
