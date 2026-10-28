import { selectKeyboard, useSettings } from '@/entities/settings'
import { AudioLines, Square } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { chordShown, useShownKeys } from '@/features/play-example'
import { isOneOf } from '@/shared/lib'
import {
  printedSymbol,
  qualitySpellings,
  TENSION_CHORDS,
  writtenSymbol,
  type ChordFingers,
  type PlacedChord,
} from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlay, usePlayback } from '@/shared/lib/services'
import {
  ChordHeading,
  FabPill,
  FloatingActions,
  PlayFab,
  usePlayKey,
  type ShownKeys,
} from '@/shared/ui'
import {
  changedView,
  chordKeys,
  fingeringRows,
  viewChord,
  type ChordView,
} from '../model/chord-view'
import { ChordFingering } from './ChordFingering'
import { ChordBuilder } from './ChordBuilder'
import { ChordPractice } from './ChordPractice'
import { ChordSheet } from './ChordSheet'
import { ChordTensions } from './ChordTensions'

const takesTensions = isOneOf(TENSION_CHORDS)

/** The chord's keys by role, each with the finger its hand puts on it, as Scales marks a run's. */
function fingeredShown(placed: PlacedChord, fingers: ChordFingers): ShownKeys {
  const shown = chordShown([...placed.lh, ...placed.rh])
  const marks = new Map(shown.marks)
  for (const hand of ['lh', 'rh'] as const) {
    placed[hand].forEach((key, i) => {
      const mark = marks.get(key.midi)
      const finger = fingers[hand][i]
      if (mark && finger !== undefined) marks.set(key.midi, { ...mark, finger })
    })
  }
  return { ...shown, marks }
}

/**
 * Any chord built part by part on any root, read top to bottom: the keys by role and degree; what it
 * is (its symbol, its tones, the other ways it is written, the chord on a staff), Play and Arpeggio floating;
 * its choices; a 7th chord's available tensions; and its ways into the Player.
 */
export function ChordExplorer({
  chord,
  onChange,
}: {
  chord: ChordView
  onChange: (view: ChordView) => void
}) {
  const { t } = useTranslation(['music', 'practice', 'common'])
  const play = usePlay()
  const playback = usePlayback<string>()
  // Placed once per view: a Play or Stop re-renders here, and a new placement would engrave the staff again.
  const { chord: built, placed, fingers } = useMemo(() => viewChord(chord), [chord])
  const rows = useMemo(() => fingeringRows(chord), [chord])
  // What stands on the keys is this chord's: a tension played over the last one is forgotten with it.
  const at = Object.values(chord).join(' ')
  const [shown, show] = useShownKeys(at, fingeredShown(placed, fingers))
  const symbol = writtenSymbol(built)
  const { quality } = built
  // The other ways its symbol is written: the table's, where the table has the chord, each printed
  // as the sheets print a chord.
  const others = quality ? qualitySpellings(quality).slice(1) : []
  // A choice sounds by itself, unless Settings › Keyboard turns that off: it has no button, so no
  // Stop, and it cuts off what played.
  const { autoplay } = useSettings(selectKeyboard)
  const change = (next: Partial<ChordView>) => {
    const view = changedView(chord, next)
    onChange(view)
    if (autoplay) play(chordSounds(chordKeys(view), { arpeggio: false }))
  }
  const sound = (id: 'chord' | 'arpeggio') =>
    playback.toggle(id, () => chordSounds(chordKeys(chord), { arpeggio: id === 'arpeggio' }))
  usePlayKey(() => sound('chord'))

  return (
    <div className="flex flex-col gap-6">
      <PinnedKeyboard shown={shown} />
      <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4">
        <div className="flex min-w-0 flex-col gap-3">
          <hgroup>
            <ChordHeading symbol={symbol} />
            {quality ? (
              <p className="text-muted-foreground">{t(`music:quality.${quality}`)}</p>
            ) : null}
          </hgroup>
          {others.length > 0 ? (
            <p className="flex flex-wrap items-baseline gap-x-4">
              <span className="text-muted-foreground">{t('practice:chords.written')}</span>
              <span className="font-display text-xl font-semibold">
                {others
                  .map((suffix) => printedSymbol(writtenSymbol({ root: built.root, suffix })))
                  .join(' · ')}
              </span>
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
          <ChordSheet placed={placed} />
        </div>
      </div>
      <ChordBuilder chord={chord} tones={built.tones} placed={placed} onChange={change} />
      <ChordFingering rows={rows} />
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
      {quality ? (
        <ChordPractice
          root={built.root}
          quality={quality}
          inversion={built.tones.length <= 4 ? chord.inversion : 0}
        />
      ) : null}
      <FloatingActions>
        <FabPill
          label={playback.playing === 'arpeggio' ? t('common:stop') : t('practice:arpeggio')}
          icon={playback.playing === 'arpeggio' ? Square : AudioLines}
          aria-pressed={playback.playing === 'arpeggio'}
          onClick={() => sound('arpeggio')}
        />
        <PlayFab
          label={t('music:play')}
          playing={playback.playing === 'chord'}
          onClick={() => sound('chord')}
        />
      </FloatingActions>
    </div>
  )
}
