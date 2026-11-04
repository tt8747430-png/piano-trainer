import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { barMs, type QuantisedNote, type Take } from '@/entities/take'
import { cn } from '@/shared/lib'
import {
  isBlackKey,
  midi,
  PIANO,
  printedKeyName,
  TICKS_PER_BEAT,
  type Midi,
} from '@/shared/lib/music'
import type { PedalKind } from '@/shared/lib/schedule'
import { rollOf, type Shade } from '../model/roll'
import { RollPlayhead } from './RollPlayhead'

/** A bar's width, a key's lane and a pedal's lane, in px. */
const BAR_PX = 96
const LANE_PX = 8
const PEDAL_PX = 6
/** The bars' numbers over the roll. */
const NUMBERS_PX = 24
/** The pedals' lanes under the keys, the sustain first. */
const PEDAL_LANES: readonly PedalKind[] = ['sustain', 'sostenuto', 'soft']
/** A note's ink by how hard it was struck: soft to loud. */
const SHADE: Readonly<Record<Shade, string>> = {
  1: 'opacity-30',
  2: 'opacity-55',
  3: 'opacity-80',
  4: 'opacity-100',
}

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
  /** Where its line stands, in px from the roll's top. */
  top: number
  /** The key whose lane's bottom is nearest a height, in px from the roll's top. */
  keyAt: (y: number) => Midi
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
        if (box) move(keyAt(event.clientY - box.top))
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
      style={{ top }}
    >
      <span className="h-0.5 w-full bg-destructive group-focus-visible:h-1" />
      <span className="absolute left-1 rounded-pill bg-destructive px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-white">
        {t('review.splitAt', { key: name })}
      </span>
    </div>
  )
}

/**
 * A take drawn as a piano roll: each key's note a bar on its lane from its
 * onset for as long as it sounds, shaded by how hard it was struck; the pedals a lane each under the
 * keys; its bars and beats as lines. Each bar is a button that plays from it, numbered as the piece
 * numbers it; the bars Keep bars would cut are dimmed. It scrolls sideways.
 */
export function TakeRoll({
  take,
  kept,
  playing,
  onPlayFrom,
  quantised,
  raw = true,
  split,
}: {
  take: Take
  /** The bars kept (Keep bars' choice), from 0: the rest dimmed. */
  kept?: { readonly first: number; readonly last: number } | undefined
  /** While it plays: when on the audio clock it started, and from where in the take (ms). */
  playing: { readonly at: number; readonly fromMs: number } | null
  onPlayFrom: (bar: number) => void
  /** The take snapped (A40, Review your recording): drawn in the accent over the notes played. */
  quantised?: readonly QuantisedNote[] | undefined
  /** The notes as played drawn: false hides them (Hide raw notes). */
  raw?: boolean
  /** The key the hands split at (it and up the upper staff), dragged up or down by its handle. */
  split?: { readonly key: Midi; readonly onChange: (key: Midi) => void } | undefined
}) {
  const { t } = useTranslation('editor')
  const roll = useMemo(() => rollOf(take), [take])
  const pxPerMs = BAR_PX / barMs(take)
  const width = roll.bars.length * BAR_PX
  // The lanes, the split's two keys among them.
  const lanes = useMemo(() => {
    if (!split) return roll.lanes
    const top = Math.max(roll.lanes[0] ?? split.key, split.key)
    const bottom = Math.min(roll.lanes.at(-1) ?? split.key, split.key - 1)
    return Array.from({ length: top - bottom + 1 }, (_, i) => midi(top - i))
  }, [roll.lanes, split])
  const keysHeight = lanes.length * LANE_PX
  const height = NUMBERS_PX + keysHeight + PEDAL_LANES.length * PEDAL_PX
  const highest = lanes[0] ?? 0
  const msOf = (ticks: number) => (ticks / TICKS_PER_BEAT) * (60_000 / take.tempo)
  const x = (ms: number) => ms * pxPerMs
  const laneY = (key: number) => NUMBERS_PX + (highest - key) * LANE_PX
  const isKept = (bar: number) => !kept || (bar >= kept.first && bar <= kept.last)
  return (
    <div className="max-w-full overflow-x-auto overscroll-x-contain rounded-control border border-border bg-card scrollbar-none">
      <div className="relative" style={{ width, height }}>
        <svg
          role="img"
          aria-label={t('roll.label', { notes: take.notes.length, bars: roll.bars.length })}
          width={width}
          height={height}
          className="block"
        >
          {lanes.map((key) =>
            isBlackKey(key) ? (
              <rect
                key={key}
                x={0}
                y={laneY(key)}
                width={width}
                height={LANE_PX}
                className="fill-muted"
              />
            ) : null,
          )}
          {roll.beats.map((at) => (
            <line
              key={at}
              x1={x(at)}
              x2={x(at)}
              y1={NUMBERS_PX}
              y2={height}
              className="stroke-hairline"
            />
          ))}
          {roll.bars.map(({ at }) => (
            <line key={at} x1={x(at)} x2={x(at)} y1={0} y2={height} className="stroke-border" />
          ))}
          {raw
            ? roll.notes.map((note) => (
                <rect
                  key={`${note.midi} ${note.at}`}
                  data-raw=""
                  x={x(note.at)}
                  y={laneY(note.midi) + 1}
                  width={Math.max(2, x(note.held))}
                  height={LANE_PX - 2}
                  rx={1}
                  className={cn('fill-foreground', quantised ? 'opacity-25' : SHADE[note.shade])}
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
              height={LANE_PX - 2}
              rx={1}
              className="fill-link/80"
            />
          ))}
          {PEDAL_LANES.map((pedal, lane) =>
            roll.pedals[pedal].map((press) => (
              <rect
                key={`${pedal} ${press.down}`}
                x={x(press.down)}
                y={NUMBERS_PX + keysHeight + lane * PEDAL_PX + 1}
                width={Math.max(2, x(press.up - press.down))}
                height={PEDAL_PX - 2}
                className="fill-muted-foreground"
              />
            )),
          )}
          {roll.bars.map(({ at }, bar) =>
            isKept(bar) ? null : (
              <rect
                key={at}
                x={x(at)}
                y={0}
                width={BAR_PX}
                height={height}
                className="fill-card opacity-70"
              />
            ),
          )}
        </svg>
        {playing ? <RollPlayhead playing={playing} length={roll.length} pxPerMs={pxPerMs} /> : null}
        {split ? (
          <SplitHandle
            split={split}
            top={laneY(split.key) + LANE_PX}
            keyAt={(y) => midi(Math.round(highest - (y - NUMBERS_PX) / LANE_PX + 1))}
          />
        ) : null}
        <ol className="absolute inset-0 flex">
          {roll.bars.map(({ at, number }, bar) => (
            <li key={at} className="h-full shrink-0" style={{ width: BAR_PX }}>
              <button
                type="button"
                aria-label={t('roll.playFrom', { n: number })}
                data-dimmed={isKept(bar) ? undefined : ''}
                onClick={() => onPlayFrom(bar)}
                className="flex size-full items-start px-1.5 pt-0.5 text-sm text-muted-foreground tabular-nums transition-colors ease-out hover:bg-foreground/5 focus-visible:-outline-offset-3"
              >
                {number}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
