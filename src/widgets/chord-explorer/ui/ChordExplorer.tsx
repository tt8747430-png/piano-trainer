import { Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { cn } from '@/shared/lib'
import { lastInversion, noteName, qualitySpellings, type Midi } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlay, usePlayback } from '@/shared/lib/services'
import { ROLE_BG, Segmented, type KeyMark } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { changedView, viewChord, type ChordView } from '../model/chord-view'
import { ChordBuilder } from './ChordBuilder'
import { ChordSheet } from './ChordSheet'

/** Root position and the first three inversions, with the name each has on screen. */
const INVERSIONS = [
  { value: 0, name: 'root' },
  { value: 1, name: 'first' },
  { value: 2, name: 'second' },
  { value: 3, name: 'third' },
] as const

/** The keys a chord's placement strikes, the left hand's first. */
const keysOf = (view: ChordView): Midi[] => {
  const { placed } = viewChord(view)
  return [...placed.lh, ...placed.rh].map((key) => key.midi)
}

/**
 * Any chord built part by part on any root: its keys by role and degree, inversions, one hand or
 * two, played, named, and every way the table writes it.
 */
export function ChordExplorer({
  chord,
  onChange,
}: {
  chord: ChordView
  onChange: (view: ChordView) => void
}) {
  const { t } = useTranslation(['learn', 'music', 'common'])
  const play = usePlay()
  const playback = usePlayback<'chord' | 'arpeggio'>()
  const { chord: built, placed } = viewChord(chord)
  const keys = [...placed.lh, ...placed.rh]
  const marks = new Map<Midi, KeyMark>(
    keys.map((key) => [key.midi, { tone: key.tone.role, label: key.tone.degree }]),
  )
  const rootName = noteName(built.root)
  const symbol = rootName + built.suffix
  // A choice sounds by itself: it has no button, so no Stop, and it cuts off what played.
  const change = (next: Partial<ChordView>) => {
    const view = changedView(chord, next)
    onChange(view)
    play(chordSounds(keysOf(view), { arpeggio: false }))
  }

  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10 lg:gap-y-6">
      <div className="flex flex-col gap-4">
        <hgroup>
          <h2 className="text-7xl">{symbol}</h2>
          {built.quality ? (
            <p className="text-muted-foreground">{t(`music:quality.${built.quality}`)}</p>
          ) : null}
        </hgroup>
        <ChordBuilder chord={chord} onChange={change} />
        <div className="flex flex-col gap-4 sm:flex-row">
          <Segmented
            label={t('learn:inversionLabel')}
            value={chord.inversion}
            options={INVERSIONS.filter(
              ({ value }) => value <= lastInversion(built.tones.length),
            ).map(({ value, name }) => ({ value, label: t(`music:inversion.${name}`) }))}
            onChange={(inversion) => change({ inversion })}
          />
          <Segmented
            label={t('learn:handsLabel')}
            value={chord.hands}
            options={[
              { value: 'rh', label: t('common:hands.rh') },
              { value: 'both', label: t('common:hands.both') },
            ]}
            onChange={(hands) => change({ hands })}
          />
        </div>
      </div>
      <ExplorerKeyboard
        keys={keys.map((key) => key.midi)}
        marks={marks}
        className="lg:order-first lg:col-span-2"
      />
      <div className="flex flex-col gap-4">
        <ChordSheet placed={placed} />
        <ol className="flex flex-wrap gap-2">
          {built.tones.map((tone) => (
            <li
              key={tone.degree}
              className="flex items-center gap-2 rounded-xl border border-border bg-card py-1 pr-3 pl-1"
            >
              <span
                className={cn(
                  'grid size-7 place-items-center rounded-lg text-sm font-bold text-on-role',
                  ROLE_BG[tone.role],
                )}
              >
                {tone.degree}
              </span>
              <span className="font-semibold">{noteName(tone.note)}</span>
            </li>
          ))}
        </ol>
        <div className="flex gap-3">
          <Button
            size="pill"
            className="flex-1"
            onClick={() =>
              playback.toggle('chord', chordSounds(keysOf(chord), { arpeggio: false }))
            }
          >
            {playback.playing === 'chord' ? (
              <>
                <Square data-icon="inline-start" />
                {t('common:stop')}
              </>
            ) : (
              t('learn:play')
            )}
          </Button>
          <Button
            size="pill"
            variant="soft"
            className="flex-1"
            onClick={() =>
              playback.toggle('arpeggio', chordSounds(keysOf(chord), { arpeggio: true }))
            }
          >
            {playback.playing === 'arpeggio' ? (
              <>
                <Square data-icon="inline-start" />
                {t('common:stop')}
              </>
            ) : (
              t('learn:arpeggio')
            )}
          </Button>
        </div>
        <p className="flex flex-wrap items-baseline gap-x-4">
          <span className="text-muted-foreground">{t('learn:written')}</span>
          <span className="font-display text-xl font-semibold">
            {(built.quality ? qualitySpellings(built.quality) : [built.suffix])
              .map((suffix) => rootName + suffix)
              .join(' · ')}
          </span>
        </p>
      </div>
    </div>
  )
}
