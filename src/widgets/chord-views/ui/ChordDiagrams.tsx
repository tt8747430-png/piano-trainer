import type { ScoreHeader } from '@/entities/piece'
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
import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import { chordsFrom } from '../model/chords-from'
import { lyricLines, type Span } from '../model/lyric-lines'
import { sungPlace } from '../model/sung-place'
import { BeatStrip } from './BeatStrip'
import { ChordRow } from './ChordRow'
import { SummaryGrid } from './SummaryGrid'
import { SungLines } from './SungLines'
import { ViewTitle } from './ViewTitle'

/**
 * Diagrams (ADR 0108, Chordify's; loop round 61, the Player's Diagrams board), every chord on the
 * same keys, each in the inversion its piece chose. Animated: under the title and its credits, the
 * row of every change (`ChordRow`), the one sounding at its start and the next beside it, sliding
 * to each change and swiped a chord at a time; under it the beat strip, following the beat; under
 * that, with the View's Lyrics on, the line sung (`SungLines`). The three stand together in the
 * middle of the room above the transport (`diagrams-view`); on a phone on its side, the strip and
 * the words beside the chords. In its summary mode, the strip and the words over the
 * song's chords at once (`SummaryGrid`), the one sounding marked, scrolling down. A diagram, a card
 * or a beat tapped takes the cursor there (`onGo`).
 */
export function ChordDiagrams({
  title,
  credits,
  performance,
  bars,
  beat,
  span,
  loop,
  words,
  mode,
  onGo,
  onLoop,
}: {
  title: string
  credits?: ScoreHeader | undefined
  performance: Performance
  /** Every bar as played, in beats. */
  bars: readonly CellBar[]
  beat: PlayedBeat
  /** The beat sounding, as played and as its bar is written. */
  span: { readonly played: Span; readonly written: Span }
  loop: BarRange | null
  /** The View's Lyrics: the line sung under the strip. */
  words: boolean
  /** The View's mode for Diagrams (ADR 0108's `scoreView.diagrams`). */
  mode: DiagramsMode
  onGo: (at: Tick) => void
  /** The loop dragged by a strip's grip to other bars. */
  onLoop: (loop: BarRange) => void
}) {
  const { t } = useTranslation('player')
  const chosen = usePieceInversions()?.chosen
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
      onBeat={onGo}
      onLoop={onLoop}
    />
  )
  const sung = place ? <SungLines place={place} written={span.written} /> : null
  if (mode === 'summary') {
    return (
      <section
        aria-label={t('views.diagrams')}
        className="-mx-gutter flex h-full flex-col gap-4 overflow-x-hidden overflow-y-auto overscroll-contain px-gutter pb-(--float-room) *:shrink-0 landscape-phone:mx-0 landscape-phone:px-0"
      >
        <ViewTitle title={title} credits={credits} />
        <div className="sticky top-0 z-20 -mx-gutter bg-background py-2 landscape-phone:mx-0">
          {strip}
        </div>
        {sung}
        <SummaryGrid
          performance={performance}
          chords={summary}
          now={now}
          onGo={(chord) => {
            const at = performance.chords[chord]?.startTick
            if (at !== undefined) onGo(at)
          }}
        />
      </section>
    )
  }
  return (
    <section
      aria-label={t('views.diagrams')}
      className="diagrams-view -mx-gutter h-full overflow-hidden px-gutter pb-(--float-room) landscape-phone:mx-0 landscape-phone:px-0"
    >
      <ViewTitle title={title} credits={credits} />
      <ChordRow performance={performance} at={span.played.from} onGo={onGo} />
      <div data-area="strip" className="-mx-gutter landscape-phone:mx-0">
        {strip}
      </div>
      {sung}
    </section>
  )
}
