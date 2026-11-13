import { useTranslation } from 'react-i18next'
import type { Metronome } from '@/features/metronome'
import {
  METRONOME_METERS,
  METRONOME_SOUNDS,
  SUBDIVISIONS,
  type MetronomeMeter,
  type MetronomeSound,
  type Subdivision,
} from '@/shared/lib/schedule'
import { Dropdown, SettingsGroup } from '@/shared/ui'
import { BarTrainerField } from './BarTrainerField'
import { MetronomeRow } from './MetronomeRow'
import { SpeedTrainerField } from './SpeedTrainerField'

/**
 * The Metronome's settings in place (R32, as Chordify's): Rhythm (the time signature, the sound and
 * the subdivision), then Practice aids (the speed trainer and silent bars, each a switch whose rows open
 * in place and read as a sentence). The Player's count-in and click sound as these say: one engine,
 * one set; the Metronome page is every setting's one home.
 */
export function MetronomeSettings({ metronome }: { metronome: Metronome }) {
  const { t } = useTranslation('practice')
  return (
    <>
      <SettingsGroup title={t('metronome.group')}>
        <div className="flex flex-col">
          <MetronomeRow label={t('metronome.meter')} setting="metronome.meter">
            <Dropdown<MetronomeMeter>
              label={t('metronome.meter')}
              value={metronome.meter}
              onChange={metronome.setMeter}
              options={METRONOME_METERS.map((meter) => ({ value: meter, label: meter }))}
              bare
              align="end"
            />
          </MetronomeRow>
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
        </div>
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
    </>
  )
}
