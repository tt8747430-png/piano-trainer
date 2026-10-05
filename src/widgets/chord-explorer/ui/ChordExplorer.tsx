import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { chordShown } from '@/features/play-example'
import { ChromaticWalkLink } from '@/features/practice'
import { type Midi, noteName, qualitySpellings, writtenSymbol } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlay, usePlayback } from '@/shared/lib/services'
import { InversionChoice, PlayLabel, Segmented, ToneChip } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { changedView, viewChord, type ChordView } from '../model/chord-view'
import { ChordBuilder } from './ChordBuilder'
import { ChordSheet } from './ChordSheet'

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
  // Placed once per view: a Play or Stop re-renders here, and a new placement would engrave the staff again.
  const { chord: built, placed } = useMemo(() => viewChord(chord), [chord])
  const shown = chordShown([...placed.lh, ...placed.rh])
  const symbol = writtenSymbol(built)
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
          <InversionChoice
            notes={built.tones.length}
            value={chord.inversion}
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
      <ExplorerKeyboard shown={shown} className="order-first lg:col-span-2" />
      <div className="flex flex-col gap-4">
        <ChordSheet placed={placed} />
        <ol className="flex flex-wrap gap-2">
          {built.tones.map((tone) => (
            <li key={tone.degree}>
              <ToneChip face={tone.role} degree={tone.degree} note={noteName(tone.note)} />
            </li>
          ))}
        </ol>
        <div className="flex gap-3">
          <Button
            size="pill"
            className="flex-1"
            onClick={() =>
              playback.toggle('chord', () => chordSounds(keysOf(chord), { arpeggio: false }))
            }
          >
            <PlayLabel playing={playback.playing === 'chord'}>{t('learn:play')}</PlayLabel>
          </Button>
          <Button
            size="pill"
            variant="soft"
            className="flex-1"
            onClick={() =>
              playback.toggle('arpeggio', () => chordSounds(keysOf(chord), { arpeggio: true }))
            }
          >
            <PlayLabel playing={playback.playing === 'arpeggio'}>{t('learn:arpeggio')}</PlayLabel>
          </Button>
        </div>
        <p className="flex flex-wrap items-baseline gap-x-4">
          <span className="text-muted-foreground">{t('learn:written')}</span>
          <span className="font-display text-xl font-semibold">
            {(built.quality ? qualitySpellings(built.quality) : [built.suffix])
              .map((suffix) => writtenSymbol({ root: built.root, suffix }))
              .join(' · ')}
          </span>
        </p>
        {built.quality ? <ChromaticWalkLink root={built.root} quality={built.quality} /> : null}
      </div>
    </div>
  )
}
