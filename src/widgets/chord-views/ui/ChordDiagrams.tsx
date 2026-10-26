import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { DiagramsMode } from '@/entities/settings'
import { usePieceInversions } from '@/features/choose-diagram-inversion'
import {
  chordSummary,
  diagramChord,
  loopTicks,
  type BarRange,
  type CellBar,
  type DiagramChord,
  type PlayedBeat,
} from '@/features/practice'
import { cn } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import { printedSymbol, type Tick } from '@/shared/lib/music'
import { SheetTitle } from '@/shared/ui'
import { ChordDiagram } from '@/widgets/chord-diagrams'
import { chordsFrom } from '../model/chords-from'
import { lyricLines, type Span } from '../model/lyric-lines'
import { sungPlace } from '../model/sung-place'
import { BeatStrip } from './BeatStrip'
import { SummaryGrid } from './SummaryGrid'
import { SungLines } from './SungLines'

/**
 * A chord of the pair, the one sounding or the next, each up to half the room and 28rem at most: its
 * keys over its symbol, a button opening its sheet. The next (`muted`) is greyed and its symbol
 * muted, named for a screen reader as the next; the one sounding by its keys' notes, its symbol in
 * ink. In a room too short for them as drawn, its keys shrink to it, its symbol kept whole.
 */
function Diagram({
  chord,
  muted,
  label,
  onOpen,
}: {
  chord: DiagramChord
  muted: boolean
  /** What its symbol says: the symbol, or that it comes next. */
  label: string
  onOpen: () => void
}) {
  const { t } = useTranslation('player')
  return (
    <button
      type="button"
      aria-label={muted ? t('nextChord', { symbol: printedSymbol(chord.symbol) }) : undefined}
      onClick={onOpen}
      className="flex max-h-full max-w-md min-w-0 shrink basis-1/2 flex-col items-center gap-2 rounded-xl p-1.5 transition-colors duration-200 ease-out hover:bg-muted landscape-phone:max-w-56"
    >
      <ChordDiagram chord={chord} muted={muted} className="min-h-0" />
      <span
        aria-hidden
        className={cn(
          'shrink-0 font-display text-3xl leading-none font-semibold landscape-phone:text-2xl',
          muted ? 'text-muted-foreground' : 'text-foreground',
        )}
      >
        {label}
      </span>
    </button>
  )
}

/**
 * Diagrams (ADR 0099, 0101, Chordify's), every chord on the same keys, each in the inversion its
 * piece chose. Animated, the chord sounding and the next beside it, the same size, the next greyed;
 * where no chord sounds yet (a pickup, a bar of none) the next alone, saying it is next. Under them
 * the beat strip, and under it, with the View's Lyrics on, the line sung (`SungLines`). On a phone on
 * its side, the title, the strip and the words beside the chords. All of it stands in the room above
 * the transport, in the middle of it, the chords shrinking where it is short (`diagrams-view`). In
 * its summary mode, the strip and the words over the song's chords at once (`SummaryGrid`), the one
 * sounding marked. A diagram opens its chord's sheet (`onChord`); a beat tapped takes the cursor
 * there (`onGo`).
 */
export function ChordDiagrams({
  title,
  performance,
  bars,
  beat,
  span,
  loop,
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
  /** The View's Lyrics: the line sung under the strip. */
  words: boolean
  /** The View's mode for Diagrams (ADR 0102's `scoreView.diagrams`). */
  mode: DiagramsMode
  onGo: (at: Tick) => void
  onChord: (chord: number) => void
}) {
  const { t } = useTranslation('player')
  const chosen = usePieceInversions()?.chosen
  const { now, next } = chordsFrom(
    performance,
    span.played,
    loop ? loopTicks(performance, loop) : null,
  )
  const lines = useMemo(() => lyricLines(performance), [performance])
  const summary = useMemo(() => chordSummary(performance, chosen), [performance, chosen])
  const place = words
    ? sungPlace(performance, lines, { bar: beat.bar, played: span.played }, loop)
    : null
  const chord = (index: number | null) =>
    index === null ? null : diagramChord(performance, index, chosen)
  const strip = (
    <BeatStrip performance={performance} bars={bars} beat={beat} loop={loop} onBeat={onGo} />
  )
  const sung = place ? <SungLines place={place} written={span.written} /> : null
  if (mode === 'summary') {
    return (
      <section
        aria-label={t('views.diagrams')}
        className="flex h-full flex-col gap-4 overflow-y-auto overscroll-contain pb-(--float-room) *:shrink-0"
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
  const first = chord(now)
  const after = chord(next)
  return (
    <section
      aria-label={t('views.diagrams')}
      className="diagrams-view h-full overflow-y-auto overscroll-contain pb-(--float-room)"
    >
      <div data-area="title">
        <SheetTitle title={title} place="lines" />
      </div>
      <div
        data-area="chords"
        className="flex items-end justify-center gap-3 sm:gap-6 landscape-phone:items-center"
      >
        {first ? (
          <>
            <Diagram
              chord={first}
              muted={false}
              label={printedSymbol(first.symbol)}
              onOpen={() => onChord(first.chord)}
            />
            {after ? (
              <Diagram
                chord={after}
                muted
                label={printedSymbol(after.symbol)}
                onOpen={() => onChord(after.chord)}
              />
            ) : null}
          </>
        ) : after ? (
          // No chord yet: the next alone, greyed, saying so.
          <Diagram
            chord={after}
            muted
            label={t('nextChord', { symbol: printedSymbol(after.symbol) })}
            onOpen={() => onChord(after.chord)}
          />
        ) : null}
      </div>
      <div data-area="strip" className="-mx-gutter landscape-phone:mx-0">
        {strip}
      </div>
      {sung}
    </section>
  )
}
