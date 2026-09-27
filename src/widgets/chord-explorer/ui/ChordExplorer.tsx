import { Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { cn } from '@/shared/lib'
import {
  CHORD_FAMILIES,
  chordRootSpelling,
  chordSymbol,
  lastInversion,
  noteFromParam,
  noteName,
  noteParam,
  PITCH_CLASSES,
  placeChord,
  qualitiesIn,
  qualityIntervals,
  qualitySpellings,
  qualitySuffix,
  spellChord,
  type Midi,
} from '@/shared/lib/music'
import { placedChordSounds } from '@/shared/lib/schedule'
import { usePlay, usePlayback } from '@/shared/lib/services'
import { Dropdown, ROLE_BG, Segmented, type KeyMark } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { ChordView } from '../model/chord-view'

/** Root position and the first three inversions, with the name each has on screen. */
const INVERSIONS = [
  { value: 0, name: 'root' },
  { value: 1, name: 'first' },
  { value: 2, name: 'second' },
  { value: 3, name: 'third' },
] as const

/** Any chord on any root: its keys by role and degree, inversions, one hand or two, played, and every way it is written. */
export function ChordExplorer({
  chord,
  onChange,
}: {
  chord: ChordView
  onChange: (change: Partial<ChordView>) => void
}) {
  const { t } = useTranslation(['learn', 'music', 'common'])
  const play = usePlay()
  const playback = usePlayback<'chord' | 'arpeggio'>()
  const root = noteFromParam(chord.root)
  const tones = spellChord(root, chord.quality)
  const placed = placeChord(tones, {
    inversion: chord.inversion,
    bothHands: chord.hands === 'both',
  })
  const keys = [...placed.lh, ...placed.rh]
  const marks = new Map<Midi, KeyMark>(
    keys.map((key) => [key.midi, { tone: key.tone.role, label: key.tone.degree }]),
  )
  const soundsOf = (view: ChordView, arpeggio: boolean) =>
    placedChordSounds(
      { root: noteFromParam(view.root), quality: view.quality },
      { inversion: view.inversion, bothHands: view.hands === 'both', arpeggio },
    )
  // A choice sounds by itself: it has no button, so no Stop, and it cuts off what played.
  const change = (next: Partial<ChordView>) => {
    onChange(next)
    play(soundsOf({ ...chord, ...next }, false))
  }

  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10 lg:gap-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-7xl">{chordSymbol({ root, quality: chord.quality })}</h2>
        <div className="flex flex-wrap gap-2">
          <Dropdown
            label={t('learn:root')}
            value={chord.root}
            options={PITCH_CLASSES.map((pc) => {
              const spelled = chordRootSpelling(pc, qualityIntervals(chord.quality))
              return { value: noteParam(spelled), label: noteName(spelled) }
            })}
            onChange={(value) => change({ root: value })}
          />
          <Dropdown
            label={t('learn:chordLabel')}
            value={chord.quality}
            groups={CHORD_FAMILIES.map((family) => ({
              label: t(`music:family.${family}`),
              options: qualitiesIn(family).map((quality) => ({
                value: quality,
                label: t(`music:quality.${quality}`),
                detail: qualitySuffix(quality) || t('music:major'),
              })),
            }))}
            onChange={(quality) => change({ quality, inversion: 0 })}
          />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Segmented
            label={t('learn:inversionLabel')}
            value={chord.inversion}
            options={INVERSIONS.filter(({ value }) => value <= lastInversion(tones.length)).map(
              ({ value, name }) => ({ value, label: t(`music:inversion.${name}`) }),
            )}
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
        <ol className="flex flex-wrap gap-2">
          {tones.map((tone) => (
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
            onClick={() => playback.toggle('chord', soundsOf(chord, false))}
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
            onClick={() => playback.toggle('arpeggio', soundsOf(chord, true))}
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
            {qualitySpellings(chord.quality)
              .map((suffix) => noteName(root) + suffix)
              .join(' · ')}
          </span>
        </p>
      </div>
    </div>
  )
}
