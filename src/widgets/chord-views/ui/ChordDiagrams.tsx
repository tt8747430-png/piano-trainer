import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { DiagramsMode } from '@/entities/settings'
import { usePieceInversions } from '@/features/choose-diagram-inversion'
import {
  chordSummary,
  loopTicks,
  type BarRange,
  type CellBar,
  type PlayedBeat,
} from '@/features/practice'
import { useMediaQuery } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import { SheetTitle } from '@/shared/ui'
import { chordsFrom } from '../model/chords-from'
import { lyricLines, type Span } from '../model/lyric-lines'
import { sungPlace } from '../model/sung-place'
import { BeatStrip } from './BeatStrip'
import { ChordPair } from './ChordPair'
import { SummaryGrid } from './SummaryGrid'
import { SungLines } from './SungLines'

/**
 * Diagrams (ADR 0099, 0101, 0108, Chordify's), every chord on the same keys, each in the inversion
 * its piece chose. Animated, the pair (`ChordPair`): the chord sounding and the next beside it,
 * sliding with Listen's clock and swiped to the next chord or the one before, the page itself still.
 * Under them the beat strip, dragged to scrub, and under it, with the View's Lyrics on, the line sung
 * (`SungLines`). On a phone on its side, the title, the strip and the words beside the chords. All of
 * it stands in the room above the transport, in the middle of it, the chords shrinking where it is
 * short (`diagrams-view`), nothing scrolling. In its summary mode, the strip and the words over the
 * song's chords at once (`SummaryGrid`), the one sounding marked, scrolling down. A diagram, a card
 * or a beat tapped takes the cursor there (`onGo`, `onChord`).
 */
export function ChordDiagrams({
  title,
  performance,
  bars,
  beat,
  span,
  loop,
  clock,
  words,
  mode,
  onGo,
  onChord,
}: {
  title: string
  performance: Performance
  /** Every bar as played, in beats. */
  bars: readonly CellBar[]
  beat: PlayedBeat
  /** The beat sounding, as played and as its bar is written. */
  span: { readonly played: Span; readonly written: Span }
  loop: BarRange | null
  /** Listen's clock while it plays. */
  clock: (() => Tick | null) | null
  /** The View's Lyrics: the line sung under the strip. */
  words: boolean
  /** The View's mode for Diagrams (ADR 0102's `scoreView.diagrams`). */
  mode: DiagramsMode
  onGo: (at: Tick) => void
  /** A chord tapped by its symbol: the cursor taken to it. */
  onChord: (symbol: string) => void
}) {
  const { t } = useTranslation('player')
  const chosen = usePieceInversions()?.chosen
  const still = useMediaQuery('(prefers-reduced-motion: reduce)')
  const looped = loop ? loopTicks(performance, loop) : null
  const { now } = chordsFrom(performance, span.played, looped)
  const lines = useMemo(() => lyricLines(performance), [performance])
  const summary = useMemo(() => chordSummary(performance, chosen), [performance, chosen])
  const place = words
    ? sungPlace(performance, lines, { bar: beat.bar, played: span.played }, loop)
    : null
  const strip = (
    <BeatStrip
      performance={performance}
      bars={bars}
      beat={beat}
      loop={loop}
      clock={clock}
      onBeat={onGo}
    />
  )
  const sung = place ? <SungLines place={place} written={span.written} /> : null
  if (mode === 'summary') {
    return (
      <section
        aria-label={t('views.diagrams')}
        className="-mx-gutter flex h-full flex-col gap-4 overflow-x-hidden overflow-y-auto overscroll-contain px-gutter pb-(--float-room) *:shrink-0 landscape-phone:mx-0 landscape-phone:px-0"
      >
        <SheetTitle title={title} place="lines" />
        <div className="sticky top-0 z-20 -mx-gutter bg-background py-2 landscape-phone:mx-0">
          {strip}
        </div>
        {sung}
        <SummaryGrid
          chords={summary}
          sounding={now === null ? null : (performance.chords[now]?.symbol ?? null)}
          onChord={onChord}
        />
      </section>
    )
  }
  return (
    <section
      aria-label={t('views.diagrams')}
      className="diagrams-view -mx-gutter h-full overflow-hidden px-gutter pb-(--float-room) landscape-phone:mx-0 landscape-phone:px-0"
    >
      <div data-area="title">
        <SheetTitle title={title} place="lines" />
      </div>
      <ChordPair
        performance={performance}
        played={span.played}
        looped={looped}
        clock={clock}
        moving={clock !== null && !still}
        still={still}
        onGo={onGo}
      />
      <div data-area="strip" className="-mx-gutter landscape-phone:mx-0">
        {strip}
      </div>
      {sung}
    </section>
  )
}
