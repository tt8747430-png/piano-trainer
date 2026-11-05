import type { KeyboardEvent, PointerEvent } from 'react'
import { cn } from '@/shared/lib'

/**
 * A piano's pedal as the player sees it from the bench (R31-P): a brass foot paddle on a short shank,
 * sinking as it goes down, a padlock on it while it is held down for the player. A picture alone:
 * the pedal's button and the On-screen piano's Pedals picture both draw it.
 */
export function PedalPaddle({
  down,
  locked = false,
  className,
}: {
  down: boolean
  locked?: boolean
  className?: string
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 34"
      className={cn('h-8.5 w-10 overflow-visible', className)}
      data-down={down || undefined}
    >
      <rect
        x="16"
        y={down ? 6 : 0}
        width="8"
        height={down ? 8 : 14}
        rx="1.5"
        className={down ? 'fill-pedal-shank-down' : 'fill-pedal-shank'}
      />
      <path
        d={
          down
            ? 'M6 14h28l3 12a7 7 0 0 1-7 8H10a7 7 0 0 1-7-8Z'
            : 'M6 12h28l3 12a7 7 0 0 1-7 8H10a7 7 0 0 1-7-8Z'
        }
        className={cn(
          'stroke-pedal-shank-down stroke-[1.2]',
          down ? 'fill-pedal-down' : 'fill-pedal',
        )}
      />
      {locked ? (
        <g transform="translate(14 18)" className="fill-foreground stroke-foreground">
          <rect x="0" y="5" width="12" height="9" rx="2" className="stroke-0" />
          <path d="M3 5V3a3 3 0 0 1 6 0v2" fill="none" strokeWidth="1.8" />
        </g>
      ) : null}
    </svg>
  )
}

/**
 * One pedal at the end of the keys' strip: its paddle over its name, 48px to press. What it does
 * on a press, a release and a key is the screen's (a live keyboard's sustain holds or locks).
 */
export function Pedal({
  label,
  name,
  down,
  locked = false,
  onPointerDown,
  onPointerUp,
  onKeyDown,
}: {
  /** What it is for, to a screen reader: "Sustain pedal". */
  label: string
  /** Its name under it: "Sustain". */
  name: string
  down: boolean
  locked?: boolean
  onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void
  onPointerUp: (event: PointerEvent<HTMLButtonElement>) => void
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={down}
      data-slot="pedal"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      className="grid min-h-12 min-w-14 shrink-0 touch-none content-center justify-items-center rounded-control select-none focus-visible:-outline-offset-2"
    >
      <PedalPaddle down={down} locked={locked} />
      <span
        aria-hidden
        className={cn(
          'text-xs leading-tight font-semibold',
          down ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {name}
      </span>
    </button>
  )
}
