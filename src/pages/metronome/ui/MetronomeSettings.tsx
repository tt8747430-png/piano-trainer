import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Metronome } from '@/features/metronome'
import {
  METRONOME_METERS,
  METRONOME_SOUNDS,
  SUBDIVISIONS,
  type MetronomeSound,
  type Subdivision,
} from '@/shared/lib/schedule'
import {
  ChoiceList,
  GroupLink,
  GroupRow,
  GroupRows,
  Sheet,
  SheetContent,
  Stepper,
} from '@/shared/ui'
import { BarTrainerField } from './BarTrainerField'
import { SpeedTrainerField } from './SpeedTrainerField'

/** The choice a row opens, in its sheet. */
type Opened = 'subdivision' | 'sound' | 'speed' | 'trainer'

/**
 * The Metronome's settings in place (canvas 179's `ME_ROWS`): one group of rows on the muted fill,
 * the time signature stepped in place, then Subdivision, Sound, Speed trainer and Silent bars, each
 * its value and a chevron opening its sheet. The Player's count-in and click sound as these say: one
 * engine, one set; the Metronome page is every setting's one home.
 */
export function MetronomeSettings({ metronome }: { metronome: Metronome }) {
  const { t } = useTranslation('practice')
  const [opened, setOpened] = useState<Opened | null>(null)
  const meter = METRONOME_METERS.findIndex((each) => each === metronome.meter)
  const sheet = (which: Opened, title: string, body: ReactNode) => (
    <Sheet open={opened === which} onOpenChange={(open) => setOpened(open ? which : null)}>
      <SheetContent title={title}>{body}</SheetContent>
    </Sheet>
  )
  const subdivisions = SUBDIVISIONS.map((subdivision) => ({
    value: subdivision,
    label: t(`metronome.subdivisions.${subdivision}`),
  }))
  const sounds = METRONOME_SOUNDS.map((sound) => ({
    value: sound,
    label: t(`metronome.sounds.${sound}`),
  }))
  const { speed, trainer } = metronome
  return (
    <>
      <GroupRows label={t('metronome.group')}>
        <GroupRow label={t('metronome.meter')} setting="metronome.meter">
          <Stepper
            label={t('metronome.meter')}
            value={meter}
            min={0}
            max={METRONOME_METERS.length - 1}
            format={(at) => METRONOME_METERS[at] ?? metronome.meter}
            onChange={(at) => {
              const next = METRONOME_METERS[at]
              if (next) metronome.setMeter(next)
            }}
            decrease={`${t('metronome.meter')} −`}
            increase={`${t('metronome.meter')} +`}
          />
        </GroupRow>
        <GroupLink
          label={t('metronome.subdivision')}
          value={t(`metronome.subdivisions.${metronome.subdivision}`)}
          setting="metronome.subdivision"
          onClick={() => setOpened('subdivision')}
        />
        <GroupLink
          label={t('metronome.sound')}
          value={t(`metronome.sounds.${metronome.sound}`)}
          setting="metronome.sound"
          onClick={() => setOpened('sound')}
        />
        <GroupLink
          label={t('metronome.speed.label')}
          value={
            speed.on
              ? t('metronome.speedValue', { from: speed.from, to: speed.to })
              : t('metronome.off')
          }
          setting="metronome.speed"
          onClick={() => setOpened('speed')}
        />
        <GroupLink
          label={t('metronome.trainer')}
          value={
            trainer.on
              ? t('metronome.trainerValue', { play: trainer.play, count: trainer.mute })
              : t('metronome.off')
          }
          setting="metronome.trainer"
          onClick={() => setOpened('trainer')}
        />
      </GroupRows>
      {metronome.playing && speed.on && metronome.bar !== null ? (
        <p role="status" className="text-center text-sm font-semibold tabular-nums">
          {t('metronome.speed.now', { bpm: metronome.tempoNow, bar: metronome.bar })}
        </p>
      ) : null}
      {sheet(
        'subdivision',
        t('metronome.subdivision'),
        <ChoiceList<Subdivision>
          label={t('metronome.subdivision')}
          value={metronome.subdivision}
          options={subdivisions}
          onChange={metronome.setSubdivision}
        />,
      )}
      {sheet(
        'sound',
        t('metronome.sound'),
        <ChoiceList<MetronomeSound>
          label={t('metronome.sound')}
          value={metronome.sound}
          options={sounds}
          onChange={metronome.setSound}
        />,
      )}
      {sheet(
        'speed',
        t('metronome.speed.label'),
        <SpeedTrainerField speed={speed} onChange={metronome.setSpeed} />,
      )}
      {sheet(
        'trainer',
        t('metronome.trainer'),
        <BarTrainerField trainer={trainer} onChange={metronome.setTrainer} />,
      )}
    </>
  )
}
