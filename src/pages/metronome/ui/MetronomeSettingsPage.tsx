import { useTranslation } from 'react-i18next'
import { useMetronome } from '@/features/metronome'
import {
  METRONOME_SOUNDS,
  SUBDIVISIONS,
  type MetronomeSound,
  type Subdivision,
} from '@/shared/lib/schedule'
import { BackButton, Dropdown, ScreenHeader, SettingsGroup } from '@/shared/ui'
import { BarTrainerField } from './BarTrainerField'
import { MetronomeRow } from './MetronomeRow'
import { SpeedTrainerField } from './SpeedTrainerField'

/**
 * The Metronome's Settings (`/practice/metronome/settings`, R29 B11, D21), off its gear: what is not
 * its tempo and beats. How it sounds (its sound, what falls between the beats), then the two ways to
 * practise with it, each a switch whose rows read as a sentence. The Player's count-in and click
 * sound as these say: one engine, one set.
 */
export function MetronomeSettingsPage() {
  const { t } = useTranslation('practice')
  const metronome = useMetronome()
  return (
    <div className="flex flex-col gap-6 pb-8">
      <ScreenHeader
        title={t('settings.open', { page: t('pages.metronome') })}
        back={<BackButton />}
      />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
        <SettingsGroup title={t('metronome.sound')}>
          <MetronomeRow label={t('metronome.sound')} setting="metronome.sound">
            <Dropdown<MetronomeSound>
              label={t('metronome.sound')}
              value={metronome.sound}
              onChange={metronome.setSound}
              options={METRONOME_SOUNDS.map((sound) => ({
                value: sound,
                label: t(`metronome.sounds.${sound}`),
              }))}
              bare
              align="end"
            />
          </MetronomeRow>
          <MetronomeRow label={t('metronome.subdivision')} setting="metronome.subdivision">
            <Dropdown<Subdivision>
              label={t('metronome.subdivision')}
              value={metronome.subdivision}
              onChange={metronome.setSubdivision}
              options={SUBDIVISIONS.map((subdivision) => ({
                value: subdivision,
                label: t(`metronome.subdivisions.${subdivision}`),
              }))}
              bare
              align="end"
            />
          </MetronomeRow>
        </SettingsGroup>
        <SettingsGroup title={t('metronome.trainers')}>
          <div data-setting="metronome.speed">
            <SpeedTrainerField
              speed={metronome.speed}
              tempoNow={metronome.tempoNow}
              bar={metronome.bar}
              playing={metronome.playing}
              onChange={metronome.setSpeed}
            />
          </div>
          <div className="border-t border-border" />
          <div data-setting="metronome.trainer">
            <BarTrainerField trainer={metronome.trainer} onChange={metronome.setTrainer} />
          </div>
        </SettingsGroup>
      </div>
    </div>
  )
}
