import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { QuantisedNote, Take } from '@/entities/take'
import { cn } from '@/shared/lib'
import {
  MIDDLE_C,
  midi,
  PIANO,
  printedKeyName,
  TICKS_PER_BEAT,
  type Midi,
} from '@/shared/lib/music'
import { barIndexAt, rollOf } from '../model/roll'
import { RollPlayhead } from './RollPlayhead'

/** A bar's width and a key's lane, in the roll's own units (it is drawn to its width). */
const BAR = 100
const LANE = 8
/**
 * The least a bar is drawn on screen, in px: a long take scrolls sideways rather than squeeze; where
 * its number is a button under it, a finger's 44.
 */
const LEAST_BAR_PX = { roll: 24, numbered: 44 } as const

/**
 * The split point (A40, Flat's staff divider): a line across the roll under the key the upper staff
 * starts at, dragged up or down (a finger or a mouse), or moved by the arrow keys; named by its key.
 */
function SplitHandle({
  split,
  top,
  keyAt,
}: {
  split: { readonly key: Midi; readonly onChange: (key: Midi) => void }
  /** Where its line stands, as a share of the roll's height. */
  top: number
  /** The key whose lane's bottom is nearest a share of the roll's height. */
  keyAt: (share: number) => Midi
}) {
  const { t } = useTranslation('editor')
  const dragging = useRef(false)
  const name = printedKeyName(split.key)
  const move = (key: number) => {
    const kept = Math.min(PIANO.to, Math.max(PIANO.from + 1, key))
    if (kept !== split.key) split.onChange(midi(kept))
  }
  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={t('review.split')}
      aria-valuemin={PIANO.from + 1}
      aria-valuemax={PIANO.to}
      aria-valuenow={split.key}
      aria-valuetext={name}
      aria-orientation="vertical"
      onPointerDown={(event) => {
        dragging.current = true
        event.currentTarget.setPointerCapture?.(event.pointerId)
      }}
      onPointerMove={(event) => {
        if (!dragging.current) return
        const box = event.currentTarget.parentElement?.getBoundingClientRect()
        if (box && box.height > 0) move(keyAt((event.clientY - box.top) / box.height))
      }}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      onKeyDown={(event) => {
        const by = event.key === 'ArrowUp' ? 1 : event.key === 'ArrowDown' ? -1 : 0
        if (by === 0) return
        event.preventDefault()
        move(split.key + (event.shiftKey ? 12 * by : by))
      }}
      className="group absolute inset-x-0 z-10 -mt-3 flex h-6 cursor-ns-resize touch-none items-center focus-visible:outline-none"
      style={{ top: `${top * 100}%` }}
    >
      <span className="h-0.5 w-full bg-destructive group-focus-visible:h-1" />
      <span className="absolute left-2 flex h-6 items-center rounded-pill bg-destructive px-2 text-[0.8125rem] font-semibold whitespace-nowrap text-white">
        {t('review.splitAt', { key: name })}
      </span>
    </div>
  )
}

/**
 * A take drawn as a piano roll, as the Take and Takes boards' PROLL: on a card, each key's note a bar
 * on its lane from its onset for as long as it sounds, the notes from the split up in amber and those
 * under it in blue (the two staves it is written into), the bars parted by hairlines, the whole take
 * across the card's width (a long take scrolls sideways). On a take's page (`bars`), its bars' numbers
 * under it, each playing from its bar, the bars Keep bars keeps on the yellow wash, and under them how
 * many notes it holds or where it plays from; in Review your recording a tap on the roll plays from
 * the bar tapped.
 */
export function TakeRoll({
  take,
  kept,
  playing,
  onPlayFrom,
  quantised,
  raw = true,
  split,
  bars = false,
  className,
}: {
  take: Take
  /** The bars kept (Keep bars' choice), from 0: on the yellow wash. */
  kept?: { readonly first: number; readonly last: number } | undefined
  /** While it plays: when on the audio clock it started, and from where in the take (ms). */
  playing: { readonly at: number; readonly fromMs: number } | null
  onPlayFrom: (bar: number) => void
  /** The take snapped (A40, Review your recording): drawn over the notes played, which fade. */
  quantised?: readonly QuantisedNote[] | undefined
  /** The notes as played drawn: false hides them (Hide raw notes). */
  raw?: boolean
  /** The key the hands split at (it and up the upper staff), dragged up or down by its handle. */
  split?: { readonly key: Midi; readonly onChange: (key: Midi) => void } | undefined
  /** Its bars' numbers under it, and its count or where it plays from: a take's page. */
  bars?: boolean
  /** The roll's height. */
  className?: string
}) {
  const { t } = useTranslation('editor')
  const roll = useMemo(() => rollOf(take), [take])
  const count = roll.bars.length
  const width = count * BAR
  // The lanes, the split's two keys among them.
  const lanes = useMemo(() => {
    if (!split) return roll.lanes
    const top = Math.max(roll.lanes[0] ?? split.key, split.key)
    const bottom = Math.min(roll.lanes.at(-1) ?? split.key, split.key - 1)
    return Array.from({ length: top - bottom + 1 }, (_, i) => midi(top - i))
  }, [roll.lanes, split])
  const height = lanes.length * LANE
  const highest = lanes[0] ?? 0
  const splitKey = split?.key ?? MIDDLE_C
  const msOf = (ticks: number) => (ticks / TICKS_PER_BEAT) * (60_000 / take.tempo)
  const x = (ms: number) => (ms / roll.length) * width
  const laneY = (key: number) => (highest - key) * LANE
  const hand = (key: number) => (key >= splitKey ? 'fill-roll-upper' : 'fill-roll-lower')
  const isKept = (bar: number) => !kept || (bar >= kept.first && bar <= kept.last)
  const playingBar = playing ? (roll.bars[barIndexAt(roll, playing.fromMs)]?.number ?? null) : null
  return (
    <div className={cn('flex flex-col gap-2 card', bars ? 'p-3' : 'px-3 py-2')}>
      <div className="max-w-full overflow-x-auto overscroll-x-contain scrollbar-none">
        <div
          className="flex flex-col gap-2"
          style={{ width: `max(100%, ${count * LEAST_BAR_PX[bars ? 'numbered' : 'roll']}px)` }}
        >
          <div className={cn('relative', className)}>
            <svg
              role="img"
              aria-label={t('roll.label', { notes: take.notes.length, bars: count })}
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="none"
              onClick={
                bars
                  ? undefined
                  : (event) => {
                      const box = event.currentTarget.getBoundingClientRect()
                      const ms = ((event.clientX - box.left) / box.width) * roll.length
                      onPlayFrom(barIndexAt(roll, ms))
                    }
              }
              className={cn('block size-full', !bars && 'cursor-pointer')}
            >
              {roll.bars.map(({ at }) => (
                <line
                  key={at}
                  x1={x(at)}
                  x2={x(at)}
                  y1={0}
                  y2={height}
                  vectorEffect="non-scaling-stroke"
                  className="stroke-muted"
                />
              ))}
              {raw
                ? roll.notes.map((note) => (
                    <rect
                      key={`${note.midi} ${note.at}`}
                      data-raw=""
                      x={x(note.at)}
                      y={laneY(note.midi) + 1}
                      width={Math.max(2, x(note.held) - 1)}
                      height={LANE - 2}
                      className={cn(hand(note.midi), quantised && 'opacity-25')}
                    />
                  ))
                : null}
              {quantised?.map((note) => (
                <rect
                  key={`q ${note.midi} ${note.startTick}`}
                  data-quantised=""
                  x={x(msOf(note.startTick))}
                  y={laneY(note.midi) + 1}
                  width={Math.max(2, x(msOf(note.durationTicks)) - 1)}
                  height={LANE - 2}
                  className={hand(note.midi)}
                />
              ))}
            </svg>
            {playing ? <RollPlayhead playing={playing} length={roll.length} /> : null}
            {split ? (
              <SplitHandle
                split={split}
                top={(laneY(split.key) + LANE) / height}
                keyAt={(share) => midi(Math.round(highest - (share * height) / LANE + 1))}
              />
            ) : null}
          </div>
          {bars ? (
            <ol
              className="grid"
              style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
            >
              {roll.bars.map(({ at, number }, bar) => (
                <li key={at} className="min-w-0">
                  <button
                    type="button"
                    aria-label={t('roll.playFrom', { n: number })}
                    data-kept={kept && isKept(bar) ? '' : undefined}
                    onClick={() => onPlayFrom(bar)}
                    className="flex h-11 w-full items-center justify-center py-1.5 text-xs text-muted-foreground tabular-nums focus-visible:-outline-offset-3 data-kept:[&>span]:bg-paint-yellow"
                  >
                    <span className="flex size-full items-center justify-center rounded-md transition-colors duration-200 ease-out hover:bg-muted">
                      {number}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </div>
      {bars ? (
        <p role="status" className="text-[0.8125rem]/4 text-muted-foreground tabular-nums">
          {playingBar === null
            ? t('roll.notes', { count: take.notes.length })
            : t('roll.playingFrom', { n: playingBar })}
        </p>
      ) : null}
    </div>
  )
}
