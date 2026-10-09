import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { barMs, type Take } from '@/entities/take'
import { cn } from '@/shared/lib'
import { isBlackKey } from '@/shared/lib/music'
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
 * A take drawn as a piano roll (spec 2026-10-09 §4.3): each key's note a bar on its lane from its
 * onset for as long as it sounds, shaded by how hard it was struck; the pedals a lane each under the
 * keys; its bars and beats as lines. Each bar is a button that plays from it, numbered as the piece
 * numbers it; the bars Keep bars would cut are dimmed. It scrolls sideways.
 */
export function TakeRoll({
  take,
  kept,
  playing,
  onPlayFrom,
}: {
  take: Take
  /** The bars kept (Keep bars' choice), from 0: the rest dimmed. */
  kept?: { readonly first: number; readonly last: number } | undefined
  /** While it plays: when on the audio clock it started, and from where in the take (ms). */
  playing: { readonly at: number; readonly fromMs: number } | null
  onPlayFrom: (bar: number) => void
}) {
  const { t } = useTranslation('editor')
  const roll = useMemo(() => rollOf(take), [take])
  const pxPerMs = BAR_PX / barMs(take)
  const width = roll.bars.length * BAR_PX
  const keysHeight = roll.lanes.length * LANE_PX
  const height = NUMBERS_PX + keysHeight + PEDAL_LANES.length * PEDAL_PX
  const highest = roll.lanes[0] ?? 0
  const x = (ms: number) => ms * pxPerMs
  const laneY = (key: number) => NUMBERS_PX + (highest - key) * LANE_PX
  const isKept = (bar: number) => !kept || (bar >= kept.first && bar <= kept.last)
  return (
    <div className="max-w-full overflow-x-auto overscroll-x-contain rounded-xl border border-border bg-card scrollbar-none">
      <div className="relative" style={{ width, height }}>
        <svg
          role="img"
          aria-label={t('roll.label', { notes: take.notes.length, bars: roll.bars.length })}
          width={width}
          height={height}
          className="block"
        >
          {roll.lanes.map((key) =>
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
          {roll.notes.map((note) => (
            <rect
              key={`${note.midi} ${note.at}`}
              x={x(note.at)}
              y={laneY(note.midi) + 1}
              width={Math.max(2, x(note.held))}
              height={LANE_PX - 2}
              rx={1}
              className={cn('fill-foreground', SHADE[note.shade])}
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
        <ol className="absolute inset-0 flex">
          {roll.bars.map(({ at, number }, bar) => (
            <li key={at} className="h-full shrink-0" style={{ width: BAR_PX }}>
              <button
                type="button"
                aria-label={t('roll.playFrom', { n: number })}
                data-dimmed={isKept(bar) ? undefined : ''}
                onClick={() => onPlayFrom(bar)}
                className="flex size-full items-start px-1.5 pt-0.5 text-sm text-muted-foreground tabular-nums transition-colors ease-out outline-none hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
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
