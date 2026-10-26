import { useMemo } from 'react'
import type { DiagramsMode, MusicView, TextSize } from '@/entities/settings'
import {
  beatGroupFrom,
  playedBeatCells,
  useBeat,
  type BarRange,
  type Practice,
} from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import { beatSpan } from '../model/beat-span'
import { chordNear } from '../model/chords-from'
import { ChordDiagrams } from './ChordDiagrams'
import { ChordsOverLyrics } from './ChordsOverLyrics'
import { GridView } from './GridView'

/**
 * The Player's music as one of its chord views (ADR 0099), shown only for music with chord symbols
 * (ADR 0102): Chords over lyrics, Diagrams (in its mode, ADR 0101) or the Grid, each following the
 * cursor a beat at a time (`useBeat`: Listen's clock while it plays, else the beat the cursor stands
 * on) and taking it to the beat tapped, the beat group there or the next (`jumpToBeatGroup`, which
 * sounds it while nothing plays). A chord tapped anywhere, a chip, a diagram, a card, a beat, takes
 * it there too (ADR 0108), each view sliding or scrolling to it; a chord's sheet is the song page's
 * and Song information's, its diagram a laptop's on a chip hovered.
 */
export function ChordView({
  view,
  title,
  performance,
  headings,
  practice,
  loop,
  words,
  mode,
  pinned,
  textSize,
}: {
  view: Exclude<MusicView, 'sheet'>
  title: string
  performance: Performance
  /** Each section's name, by section; none for music of one section. */
  headings: readonly string[]
  practice: Pick<Practice, 'state' | 'clock' | 'jumpToBeatGroup'>
  loop: BarRange | null
  /** The View's Lyrics: the Diagrams view's line sung, the Grid's words under its beats. */
  words: boolean
  /** How Diagrams shows the chords: the one sounding and the next, or the song's all at once. */
  mode: DiagramsMode
  /** Chords over lyrics' chord diagrams pinned under its strip (ADR 0108). */
  pinned: boolean
  /** Chords over lyrics' words and chords, as a percent of their own size. */
  textSize: TextSize
}) {
  const beat = useBeat(performance, practice)
  const bars = useMemo(() => playedBeatCells(performance), [performance])
  const span = beatSpan(performance, bars, beat)
  const go = (at: Tick) => {
    const group = beatGroupFrom(performance, at)
    if (group !== null) practice.jumpToBeatGroup(group)
  }
  // A chord by its symbol: where it next starts from the beat sounding, else where it first does.
  const goToChord = (symbol: string) => {
    const chord = chordNear(performance, symbol, span.played.from)
    const at = chord === null ? undefined : performance.chords[chord]?.startTick
    if (at !== undefined) go(at)
  }
  return view === 'grid' ? (
    <GridView
      title={title}
      performance={performance}
      headings={headings}
      beat={beat}
      loop={loop}
      words={words}
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
      pinned={pinned}
      textSize={textSize}
      clock={practice.clock}
      onGo={go}
      onSymbol={goToChord}
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
      clock={practice.clock}
      onGo={go}
      onChord={goToChord}
    />
  )
}
