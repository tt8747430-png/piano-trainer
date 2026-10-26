import { useLayoutEffect, useMemo, useRef, type CSSProperties } from 'react'
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
import { cn, useMediaQuery } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import { printedSymbol, type Tick } from '@/shared/lib/music'
import { SheetTitle } from '@/shared/ui'
import { ChordDiagram } from '@/widgets/chord-diagrams'
import { chordsFrom, pairSlide } from '../model/chords-from'
import { lyricLines, type Span } from '../model/lyric-lines'
import { sungPlace } from '../model/sung-place'
import { useEveryFrame } from '../model/use-every-frame'
import { BeatStrip } from './BeatStrip'
import { SummaryGrid } from './SummaryGrid'
import { SungLines } from './SungLines'

/** A diagram's place in the pair: the one sounding's, the next's, or past the room's right edge. */
type Slot = 0 | 0.5 | 1 | 2

/**
 * A chord of the pair, the one sounding or the next, each half the pair's room and 28rem at most:
 * its keys over its symbol, a button taking the cursor to it (`onGo`). The next (`muted`) is greyed
 * and its symbol muted, named for a screen reader as the next; the one sounding by its keys' notes,
 * its symbol in ink. In a room too short for them as drawn, its keys shrink to it, its symbol kept
 * whole. It stands in its `slot`, moved on by the pair's slide (`--slide`); one past the room's edge
 * is coming, hidden and out of reach.
 */
function Diagram({
  chord,
  muted,
  label,
  slot,
  onGo,
}: {
  chord: DiagramChord
  muted: boolean
  /** What its symbol says: the symbol, or that it comes next. */
  label: string
  slot: Slot
  onGo: () => void
}) {
  const { t } = useTranslation('player')
  const coming = slot === 2
  return (
    <button
      type="button"
      aria-label={muted ? t('nextChord', { symbol: printedSymbol(chord.symbol) }) : undefined}
      aria-hidden={coming || undefined}
      inert={coming}
      onClick={onGo}
      style={{ '--slot': slot } as CSSProperties}
      className="col-start-1 row-start-1 flex max-h-full min-h-0 min-w-0 translate-x-[calc((var(--slot)-var(--slide,0))*100%)] flex-col items-center gap-2 self-end rounded-xl p-1.5 transition-[translate,background-color] duration-300 ease-out group-data-moving/pair:transition-[background-color] hover:bg-muted motion-reduce:transition-none landscape-phone:self-center"
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
 * Diagrams (ADR 0099, 0101, 0108, Chordify's), every chord on the same keys, each in the inversion
 * its piece chose. Animated, the chord sounding and the next beside it, the same size, the next
 * greyed; where no chord sounds yet (a pickup, a bar of none) the next alone, saying it is next. As a
 * change comes the pair slides with Listen's clock frame by frame (`pairSlide`), the next into the
 * place of the one sounding, the one after it in from the right, the page itself still; taken to a
 * chord it slides there; under reduced motion it stands still. Under them the beat strip, and under
 * it, with the View's Lyrics on, the line sung (`SungLines`). On a phone on its side, the title, the
 * strip and the words beside the chords. All of it stands in the room above the transport, in the
 * middle of it, the chords shrinking where it is short (`diagrams-view`), nothing scrolling. In its
 * summary mode, the strip and the words over the song's chords at once (`SummaryGrid`), the one
 * sounding marked, scrolling down. A diagram, a card or a beat tapped takes the cursor there
 * (`onGo`, `onChord`).
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
  const pairOf = chordsFrom(performance, span.played, looped)
  const { now, next } = pairOf
  // The chord after the next, coming in from the right as the pair slides.
  const nextStart = next === null ? null : (performance.chords[next]?.startTick ?? null)
  const later =
    now === null || nextStart === null
      ? null
      : chordsFrom(performance, { from: nextStart, to: nextStart + 1 }, looped).next
  const lines = useMemo(() => lyricLines(performance), [performance])
  const summary = useMemo(() => chordSummary(performance, chosen), [performance, chosen])
  const place = words
    ? sungPlace(performance, lines, { bar: beat.bar, played: span.played }, loop)
    : null
  const chord = (index: number | null) =>
    index === null ? null : diagramChord(performance, index, chosen)
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
  // The pair's slide, set as each frame is drawn and again as the pair changes, before it is painted.
  const pair = useRef<HTMLDivElement>(null)
  const moving = clock !== null && !still && mode === 'animated'
  const slide = () => {
    const tick = clock?.()
    const by =
      moving && tick !== null && tick !== undefined
        ? pairSlide(performance, pairOf, looped, tick)
        : 0
    pair.current?.style.setProperty('--slide', String(by))
  }
  useLayoutEffect(slide)
  useEveryFrame(slide, moving)
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
  const first = chord(now)
  const second = chord(next)
  const third = chord(later)
  const go = (drawn: DiagramChord) => () => onGo(performance.chords[drawn.chord]?.startTick ?? 0)
  return (
    <section
      aria-label={t('views.diagrams')}
      className="diagrams-view -mx-gutter h-full overflow-hidden px-gutter pb-(--float-room) landscape-phone:mx-0 landscape-phone:px-0"
    >
      <div data-area="title">
        <SheetTitle title={title} place="lines" />
      </div>
      <div
        ref={pair}
        data-area="chords"
        data-moving={moving ? '' : undefined}
        className="group/pair grid grid-cols-[repeat(2,minmax(0,28rem))] justify-center overflow-hidden landscape-phone:grid-cols-[repeat(2,minmax(0,14rem))]"
      >
        {first ? (
          <>
            <Diagram
              key={first.chord}
              chord={first}
              muted={false}
              label={printedSymbol(first.symbol)}
              slot={second ? 0 : 0.5}
              onGo={go(first)}
            />
            {second ? (
              <Diagram
                key={second.chord}
                chord={second}
                muted
                label={printedSymbol(second.symbol)}
                slot={1}
                onGo={go(second)}
              />
            ) : null}
            {second && third && third.chord !== first.chord ? (
              <Diagram
                key={third.chord}
                chord={third}
                muted
                label={printedSymbol(third.symbol)}
                slot={2}
                onGo={go(third)}
              />
            ) : null}
          </>
        ) : second ? (
          // No chord yet: the next alone, greyed, saying so.
          <Diagram
            key={second.chord}
            chord={second}
            muted
            label={t('nextChord', { symbol: printedSymbol(second.symbol) })}
            slot={0.5}
            onGo={go(second)}
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
