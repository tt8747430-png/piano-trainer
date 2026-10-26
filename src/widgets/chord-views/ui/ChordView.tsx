import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { MusicView } from '@/entities/settings'
import { usePieceInversions } from '@/features/choose-diagram-inversion'
import {
  beatGroupFrom,
  diagramChord,
  playedBeatCells,
  useBeat,
  type BarRange,
  type Practice,
} from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import { ChordSheet } from '@/widgets/chord-diagrams'
import { beatSpan } from '../model/beat-span'
import type { DiagramsMode } from '../model/diagrams-mode'
import { ChordDiagrams } from './ChordDiagrams'
import { ChordsOverLyrics } from './ChordsOverLyrics'
import { GridView } from './GridView'
import { NoChords } from './NoChords'

/**
 * The Player's music as one of its chord views (ADR 0099): Chords over lyrics, Diagrams (in its
 * mode, ADR 0101) or the Grid, each following the cursor a beat at a time (`useBeat`: Listen's
 * clock while it plays, else the beat the cursor stands on) and taking it to the beat tapped, the
 * beat group there or the next (`jumpToBeatGroup`, which sounds it while nothing plays). A chord
 * tapped opens its sheet, drawn in the inversion its piece chose. Music of no chord symbol says so,
 * with the way to its sheet music (`onSheet`).
 */
export function ChordView({
  view,
  title,
  performance,
  headings,
  practice,
  loop,
  words,
  mode = 'animated',
  onSheet,
}: {
  view: Exclude<MusicView, 'sheet'>
  title: string
  performance: Performance
  /** Each section's name, by section; none for music of one section. */
  headings: readonly string[]
  practice: Pick<Practice, 'state' | 'clock' | 'jumpToBeatGroup'>
  loop: BarRange | null
  /** The View's Lyrics: the Diagrams view's line sung. */
  words: boolean
  /** How Diagrams shows the chords: the one sounding and the next, or the song's all at once. */
  mode?: DiagramsMode
  onSheet: () => void
}) {
  const { t } = useTranslation('player')
  const beat = useBeat(performance, practice)
  const bars = useMemo(() => playedBeatCells(performance), [performance])
  const chosen = usePieceInversions()?.chosen
  // The chord last opened stays in its sheet as the sheet closes, drawn as its piece draws it now.
  const [shown, setShown] = useState<{ chord: number; open: boolean } | null>(null)
  const opened = shown ? diagramChord(performance, shown.chord, chosen) : null
  if (performance.chords.length === 0)
    return <NoChords title={title} label={t(`views.${view}`)} onSheet={onSheet} />
  const span = beatSpan(performance, bars, beat)
  const go = (at: Tick) => {
    const group = beatGroupFrom(performance, at)
    if (group !== null) practice.jumpToBeatGroup(group)
  }
  const open = (chord: number) => setShown({ chord, open: true })
  return (
    <>
      {view === 'grid' ? (
        <GridView
          title={title}
          performance={performance}
          headings={headings}
          beat={beat}
          loop={loop}
          onBeat={go}
        />
      ) : view === 'lyrics' ? (
        <ChordsOverLyrics
          title={title}
          performance={performance}
          headings={headings}
          bars={bars}
          beat={beat}
          written={span.written}
          loop={loop}
          onGo={go}
          onChord={open}
        />
      ) : (
        <ChordDiagrams
          title={title}
          performance={performance}
          bars={bars}
          beat={beat}
          span={span}
          loop={loop}
          words={words}
          mode={mode}
          onGo={go}
          onChord={open}
        />
      )}
      {shown && opened ? (
        <ChordSheet
          chord={opened}
          open={shown.open}
          onOpenChange={(open) => setShown({ ...shown, open })}
        />
      ) : null}
    </>
  )
}
