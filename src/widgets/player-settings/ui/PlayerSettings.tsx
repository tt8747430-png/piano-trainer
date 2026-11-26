import { Link } from '@tanstack/react-router'
import { Metronome } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  SPEED_STEPS,
  selectPlayback,
  selectSound,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setPlayback, setSound } from '@/features/set-preference'
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
    <div className="flex flex-col gap-4">
      {children}
      <SettingsGroup flush>
        <RowLink
          title={t('settingsPage.metronome')}
          icon={Metronome}
          paint="grass"
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
    </div>
  )
}
