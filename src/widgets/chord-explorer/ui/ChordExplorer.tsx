import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { chordShown, useShownKeys } from '@/features/play-example'
import { isOneOf } from '@/shared/lib'
import {
  type Midi,
  noteName,
  qualitySpellings,
  TENSION_CHORDS,
  writtenSymbol,
} from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlay, usePlayback } from '@/shared/lib/services'
import { ChordHeading, PlayLabel, ToneChip } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { changedView, viewChord, type ChordView } from '../model/chord-view'
import { ChordBuilder } from './ChordBuilder'
import { ChordPractice } from './ChordPractice'
import { ChordSheet } from './ChordSheet'
import { ChordTensions } from './ChordTensions'

const takesTensions = isOneOf(TENSION_CHORDS)

/** The keys a chord's placement strikes, the left hand's first. */
const keysOf = (view: ChordView): Midi[] => {
  const { placed } = viewChord(view)
  return [...placed.lh, ...placed.rh].map((key) => key.midi)
}

/**
 * Any chord built part by part on any root, read top to bottom: the keys by role and degree; what it
 * is (its symbol, its tones, the other ways it is written, the chord on a staff) with Play and Arpeggio;
 * its choices; a 7th chord's available tensions; and its ways into the Player.
 */
export function ChordExplorer({
  chord,
  onChange,
}: {
  chord: ChordView
  onChange: (view: ChordView) => void
}) {
  const { t } = useTranslation(['learn', 'music'])
  const play = usePlay()
  const playback = usePlayback<string>()
  // Placed once per view: a Play or Stop re-renders here, and a new placement would engrave the staff again.
  const { chord: built, placed } = useMemo(() => viewChord(chord), [chord])
  // What stands on the keys is this chord's: a tension played over the last one is forgotten with it.
  const at = Object.values(chord).join(' ')
  const [shown, show] = useShownKeys(at, chordShown([...placed.lh, ...placed.rh]))
  const symbol = writtenSymbol(built)
  const { quality } = built
  // The other ways its symbol is written: the table's, where the table has the chord.
  const others = quality ? qualitySpellings(quality).slice(1) : []
  // A choice sounds by itself: it has no button, so no Stop, and it cuts off what played.
  const change = (next: Partial<ChordView>) => {
    const view = changedView(chord, next)
    onChange(view)
    play(chordSounds(keysOf(view), { arpeggio: false }))
  }
  const sound = (id: 'chord' | 'arpeggio') =>
    playback.toggle(id, () => chordSounds(keysOf(chord), { arpeggio: id === 'arpeggio' }))

  return (
    <div className="flex flex-col gap-6">
      <ExplorerKeyboard shown={shown} />
      <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4">
        <div className="flex min-w-0 flex-col gap-3">
          <hgroup>
            <ChordHeading symbol={symbol} />
            {quality ? (
              <p className="text-muted-foreground">{t(`music:quality.${quality}`)}</p>
            ) : null}
          </hgroup>
          <ol className="flex flex-wrap gap-2">
            {built.tones.map((tone) => (
              <li key={tone.degree}>
                <ToneChip face={tone.role} degree={tone.degree} note={noteName(tone.note)} />
              </li>
            ))}
          </ol>
          {others.length > 0 ? (
            <p className="flex flex-wrap items-baseline gap-x-4">
              <span className="text-muted-foreground">{t('learn:written')}</span>
              <span className="font-display text-xl font-semibold">
                {others.map((suffix) => writtenSymbol({ root: built.root, suffix })).join(' · ')}
              </span>
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
          <ChordSheet placed={placed} />
          <div className="flex gap-3">
            <Button size="pill" onClick={() => sound('chord')}>
              <PlayLabel playing={playback.playing === 'chord'}>{t('learn:play')}</PlayLabel>
            </Button>
            <Button size="pill" variant="soft" onClick={() => sound('arpeggio')}>
              <PlayLabel playing={playback.playing === 'arpeggio'}>{t('learn:arpeggio')}</PlayLabel>
            </Button>
          </div>
        </div>
      </div>
      <ChordBuilder chord={chord} notes={built.tones.length} onChange={change} />
      {quality && takesTensions(quality) ? (
        <ChordTensions
          root={built.root}
          quality={quality}
          isPlaying={(tone) => playback.playing === `${at} ${tone.pitchClass}`}
          onPlay={(tone, over) => {
            show(over)
            playback.toggle(`${at} ${tone.pitchClass}`, () =>
              chordSounds(over.keys, { arpeggio: false }),
            )
          }}
        />
      ) : null}
      {quality ? <ChordPractice root={built.root} quality={quality} /> : null}
    </div>
  )
}
