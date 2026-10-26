import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import type { DiagramChord } from '@/features/practice'
import { cn } from '@/shared/lib'
import { printedSymbol } from '@/shared/lib/music'
import { ChordDiagram } from '@/widgets/chord-diagrams'

/**
 * A diagram's place in the pair: the one sounding's, the next's, past the room's right edge (the one
 * coming), or past its left (the chord before, drawn in by a swipe back).
 */
export type Slot = -1 | -0.5 | 0 | 0.5 | 1 | 2

/** How far a diagram past an edge shows: as far as the slide and the swipe have drawn it in. */
const SHOWN = {
  coming: 'clamp(0, calc(var(--slide, 0) + var(--swipe, 0)), 1)',
  gone: 'clamp(0, calc(-1 * var(--swipe, 0)), 1)',
} as const

/**
 * A chord of the pair, the one sounding or the next, each half the pair's room and 28rem at most:
 * its keys over its symbol, a button taking the cursor to it (`onGo`). The next (`muted`) is greyed
 * and its symbol muted, named for a screen reader as the next; the one sounding by its keys' notes,
 * its symbol in ink. In a room too short for them as drawn, its keys shrink to it, its symbol kept
 * whole. It stands in its `slot`, moved on by the pair's slide (`--slide`) and a swipe (`--swipe`);
 * one past the room's edges is hidden and out of reach, showing as it is drawn in.
 */
export function PairDiagram({
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
  const gone = slot < 0
  return (
    <button
      type="button"
      aria-label={muted ? t('nextChord', { symbol: printedSymbol(chord.symbol) }) : undefined}
      data-diagram=""
      aria-hidden={coming || gone || undefined}
      inert={coming || gone}
      onClick={onGo}
      // One past an edge shows as it is drawn in: at rest it is out of sight, even in the gutters' fade.
      style={
        {
          '--slot': slot,
          ...(coming || gone ? { opacity: SHOWN[coming ? 'coming' : 'gone'] } : {}),
        } as CSSProperties
      }
      className="col-start-1 row-start-1 flex max-h-full min-h-0 min-w-0 translate-x-[calc((var(--slot)-var(--slide,0)-var(--swipe,0))*100%)] flex-col items-center gap-2 self-end rounded-xl p-1.5 transition-[translate,background-color] duration-300 ease-out group-data-moving/pair:transition-[background-color] group-data-swiping/pair:transition-[background-color] group-data-settling/pair:transition-[translate,background-color]! hover:bg-muted group-data-swiping/pair:bg-transparent! motion-reduce:transition-none landscape-phone:self-center"
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
