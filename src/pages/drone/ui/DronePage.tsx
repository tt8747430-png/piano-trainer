import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DRONE_KINDS,
  DRONE_OCTAVES,
  selectDrone,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setDrone } from '@/features/set-preference'
import { formatPercent, useLocale } from '@/shared/i18n'
import { useWakeLock } from '@/shared/lib'
import { pitchClass, type PitchClass } from '@/shared/lib/music'
import { volumeGain } from '@/shared/lib/schedule'
import { useServices } from '@/shared/lib/services'
import { ChoiceCard, InfoTip, PitchPicker, SettingsGroup, Stepper } from '@/shared/ui'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import { ToolPage } from '@/widgets/tool-page'
import { droneKeys } from '../model/drone-keys'

/** Each pitch's usual name, as the major keys name it. */
const NAMES = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'] as const
const keyName = (key: number) => `${NAMES[key % 12]}${Math.floor(key / 12) - 1}`

/**
 * The Drone (R29 B11), a tool of its own: a held tone to play over. Its root (the octave's keys), what
 * it holds over it (Note · Fifth · Major · Minor, `ChoiceCard`), its octave and its volume, all saved;
 * Start/Stop floating. It sounds a synthesised, sustained tone (the audio port's drone) until it is
 * stopped or the page is left; a change while it sounds is heard at once.
 */
export function DronePage() {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const { audio } = useServices()
  const store = useSettingsStoreApi()
  const drone = useSettings(selectDrone)
  const [on, setOn] = useState(false)
  useWakeLock(on)
  const keys = droneKeys(drone)
  const sounding = keys.join(' ')
  const gain = volumeGain(drone.volume)
  useEffect(() => {
    if (!on) return
    return audio.drone(
      sounding.split(' ').map((key) => Number(key) as (typeof keys)[number]),
      gain,
    )
  }, [audio, on, sounding, gain])
  const toggle = () => {
    if (on) setOn(false)
    else void audio.unlock().then(() => setOn(true))
  }
  const name = t('pages.drone')
  return (
    <ToolPage
      title={name}
      actions={
        <InfoTip name={name} bar>
          {t('tools.drone.info')}
        </InfoTip>
      }
      play={{ label: t('tools.drone.start'), playing: on, onToggle: toggle }}
      controls={
        <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
          <SettingsGroup>
            <div className="flex flex-col divide-y divide-border">
              <div
                data-setting="drone.root"
                className="flex min-h-12 items-center justify-between gap-3 px-4 py-2"
              >
                <span className="text-lg">{t('tools.drone.root')}</span>
                <PitchPicker
                  label={t('tools.drone.root')}
                  value={pitchClass(drone.root)}
                  onChange={(root: PitchClass) => setDrone(store, { root })}
                />
              </div>
              <div
                data-setting="drone.octave"
                className="flex min-h-12 flex-wrap items-center justify-between gap-3 px-4 py-2"
              >
                <span className="text-lg">{t('tools.drone.octave')}</span>
                <Stepper
                  label={t('tools.drone.octave')}
                  value={drone.octave}
                  min={DRONE_OCTAVES.min}
                  max={DRONE_OCTAVES.max}
                  onChange={(octave) => setDrone(store, { octave })}
                  decrease={t('tools.drone.lower')}
                  increase={t('tools.drone.higher')}
                />
              </div>
              <Slider
                data-setting="drone.volume"
                min={0}
                max={100}
                step={5}
                value={drone.volume}
                onValueChange={(volume) => setDrone(store, { volume })}
                className="flex flex-col gap-2 px-4 py-3"
              >
                <div className="flex justify-between gap-3 text-lg">
                  <SliderLabel>{t('tools.drone.volume')}</SliderLabel>
                  <span className="text-muted-foreground tabular-nums">
                    {formatPercent(locale, drone.volume)}
                  </span>
                </div>
              </Slider>
            </div>
          </SettingsGroup>
          <ChoiceCard
            title={t('tools.drone.kind')}
            setting="drone.kind"
            value={drone.kind}
            onChange={(kind) => setDrone(store, { kind })}
            options={DRONE_KINDS.map((kind) => ({
              value: kind,
              label: t(`tools.drone.kinds.${kind}`),
              example: t(`tools.drone.kindAbout.${kind}`),
            }))}
          />
        </div>
      }
    >
      <p aria-hidden className="font-heading text-7xl font-semibold">
        {NAMES[drone.root]}
      </p>
      <p aria-live="polite" className="text-muted-foreground">
        {on
          ? t('tools.drone.sounding', { notes: keys.map(keyName).join(' · ') })
          : t('tools.drone.silent')}
      </p>
    </ToolPage>
  )
}
