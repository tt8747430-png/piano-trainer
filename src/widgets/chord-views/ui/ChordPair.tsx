import { useTranslation } from 'react-i18next'
import { usePieceInversions } from '@/features/choose-diagram-inversion'
import { diagramChord, type DiagramChord } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { printedSymbol, type Tick } from '@/shared/lib/music'
import { chordBefore, chordsFrom, pairSlide } from '../model/chords-from'
import type { Span } from '../model/lyric-lines'
import { usePairMotion } from '../model/use-pair-motion'
import { PairDiagram } from './PairDiagram'

/**
 * The Diagrams view's pair (ADR 0101, 0108): the chord sounding and the next beside it, the same
 * size, the next greyed; where no chord sounds yet (a pickup, a bar of none) the next alone, saying
 * it is next. As a change comes the pair slides with Listen's clock frame by frame (`pairSlide`), the
 * next into the place of the one sounding, the one after it in from the right; taken to a chord it
 * slides there. Swiped (a finger, a mouse, a trackpad), it goes on to the next chord or back to the
 * one before (`chordBefore`), following the hand (`usePairMotion`); up and down is the page's. Under
 * reduced motion nothing slides. Two diagrams' room, clipped there; on a phone held upright it runs
 * into the gutters, fading there, so a diagram sliding past is never cut hard.
 */
export function ChordPair({
  performance,
  played,
  looped,
  clock,
  moving,
  still,
  onGo,
}: {
  performance: Performance
  /** The beat sounding, as played. */
  played: Span
  /** The loop's ticks. */
  looped: Span | null
  clock: (() => Tick | null) | null
  /** Whether the pair follows Listen's clock. */
  moving: boolean
  still: boolean
  onGo: (at: Tick) => void
}) {
  const { t } = useTranslation('player')
  const chosen = usePieceInversions()?.chosen
  const pairOf = chordsFrom(performance, played, looped)
  const { now, next } = pairOf
  // The chord after the next, coming in from the right as the pair slides.
  const nextStart = next === null ? null : (performance.chords[next]?.startTick ?? null)
  const later =
    now === null || nextStart === null
      ? null
      : chordsFrom(performance, { from: nextStart, to: nextStart + 1 }, looped).next
  const before = chordBefore(performance, played, now, looped)
  const chord = (index: number | null) =>
    index === null ? null : diagramChord(performance, index, chosen)
  const first = chord(now)
  const second = chord(next)
  const third = chord(later)
  const back = chord(before)
  // Where the one sounding stands: beside the next, or alone in the middle.
  const firstSlot = first && second ? 0 : 0.5
  const startOf = (index: number | null) =>
    index === null ? undefined : performance.chords[index]?.startTick
  const { pair, onPointerDownCapture, onClickCapture } = usePairMotion({
    now,
    before: before !== null,
    after: next !== null,
    // Swiped on, the next in the first place; back, the chord before.
    landing: { on: first ? 1 : 0.5, back: firstSlot - 1 },
    moving,
    still,
    slide: () => {
      const tick = moving ? clock?.() : null
      return tick === null || tick === undefined ? 0 : pairSlide(performance, pairOf, looped, tick)
    },
    onSwipe: (way) => {
      const at = startOf(way === 1 ? next : before)
      if (at !== undefined) onGo(at)
    },
  })
  const go = (drawn: DiagramChord) => () => onGo(startOf(drawn.chord) ?? 0)
  const shown = new Set([first?.chord, second?.chord])
  return (
    <div
      ref={pair}
      data-area="chords"
      data-moving={moving ? '' : undefined}
      onPointerDownCapture={onPointerDownCapture}
      onClickCapture={onClickCapture}
      className="group/pair -mx-gutter grid w-[calc(100%+2*var(--gutter))] max-w-[calc(56rem+2*var(--gutter))] touch-pan-y grid-cols-2 justify-self-center overflow-hidden overscroll-x-none px-gutter select-none [mask-image:linear-gradient(to_right,transparent,#000_var(--gutter),#000_calc(100%-var(--gutter)),transparent)] landscape-phone:mx-0 landscape-phone:w-full landscape-phone:max-w-[28rem] landscape-phone:px-0 landscape-phone:mask-none"
    >
      {back && !shown.has(back.chord) ? (
        <PairDiagram
          key={back.chord}
          chord={back}
          muted
          label={printedSymbol(back.symbol)}
          slot={firstSlot === 0 ? -1 : -0.5}
          onGo={go(back)}
        />
      ) : null}
      {first ? (
        <PairDiagram
          key={first.chord}
          chord={first}
          muted={false}
          label={printedSymbol(first.symbol)}
          slot={firstSlot}
          onGo={go(first)}
        />
      ) : null}
      {second ? (
        <PairDiagram
          key={second.chord}
          chord={second}
          muted
          // No chord yet: the next alone, greyed, saying so.
          label={
            first
              ? printedSymbol(second.symbol)
              : t('nextChord', { symbol: printedSymbol(second.symbol) })
          }
          slot={first ? 1 : 0.5}
          onGo={go(second)}
        />
      ) : null}
      {first && second && third && !shown.has(third.chord) && third.chord !== back?.chord ? (
        <PairDiagram
          key={third.chord}
          chord={third}
          muted
          label={printedSymbol(third.symbol)}
          slot={2}
          onGo={go(third)}
        />
      ) : null}
    </div>
  )
}
