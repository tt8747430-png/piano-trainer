import type { KeyboardEvent, PointerEvent, ReactNode } from 'react'
import { cn } from '@/shared/lib'

/**
 * A piano's pedal as the player sees it from the bench (R32): a brass foot plate on its shank, rising
 * from the lyre. Down, it sinks and a honey glow spreads under it; latched, a honey dot sits on its
 * corner. A picture alone: the pedal's button and the On-screen piano's Pedals picture both draw it.
 */
export function PedalPaddle({
  down,
  latched = false,
  className,
}: {
  down: boolean
  latched?: boolean
  className?: string
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 44 30"
      className={cn(
        'h-7.5 w-11 overflow-visible transition-transform duration-100 ease-out',
        down ? 'translate-y-0.75' : null,
        className,
      )}
      data-down={down || undefined}
    >
      {down ? <ellipse cx="22" cy="27" rx="22" ry="5" className="fill-primary opacity-75" /> : null}
      <rect
        x="18"
        y="0"
        width="8"
        height={down ? 7 : 10}
        rx="1.5"
        className={down ? 'fill-pedal-shank-down' : 'fill-pedal-shank'}
      />
      <path
        d={
          down
            ? 'M4 8h36l3 11a6 6 0 0 1-6 7H7a6 6 0 0 1-6-7Z'
            : 'M4 10h36l3 11a6 6 0 0 1-6 7H7a6 6 0 0 1-6-7Z'
        }
        className={cn(
          'stroke-pedal-shank-down stroke-[1.2]',
          down ? 'fill-pedal-down' : 'fill-pedal',
        )}
      />
      <path
        d={down ? 'M7 12h30' : 'M7 14h30'}
        className={cn('stroke-pedal-sheen stroke-[1.4]', down ? 'opacity-35' : 'opacity-80')}
      />
      {latched ? (
        <circle
          cx="38"
          cy="4"
          r="5"
          className="fill-primary stroke-primary-foreground stroke-[1.5]"
        />
      ) : null}
    </svg>
  )
}

/**
 * One pedal on the piano's lyre, beneath the keys: its brass plate over its name, 48px to press.
 * What it does on a press, a release and a key is the screen's (a live keyboard's sustain holds or
 * latches).
 */
export function Pedal({
  label,
  name,
  down,
  latched = false,
  onPointerDown,
  onPointerUp,
  onKeyDown,
}: {
  /** What it is for, to a screen reader: "Sustain pedal". */
  label: string
  /** Its name under it: "Sustain". */
  name: string
  down: boolean
  latched?: boolean
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
      className="grid min-h-12 min-w-12 shrink-0 touch-none content-end justify-items-center gap-0.5 rounded-control pb-0.5 select-none focus-visible:-outline-offset-2"
    >
      <PedalPaddle down={down} latched={latched} />
      <span
        aria-hidden
        className={cn(
          'text-[11px] leading-tight font-semibold transition-colors duration-100',
          down ? 'text-pedal-name-down' : 'text-pedal-name',
        )}
      >
        {name}
      </span>
    </button>
  )
}

/** The lyre the pedals rise from, centred beneath the keys as on an upright or a grand. */
export function PedalLyre({ children }: { children: ReactNode }) {
  return (
    <span
      data-slot="pedal-lyre"
      className="flex h-full items-end gap-1 rounded-t-control bg-pedal-lyre px-2 pt-1"
    >
      {children}
    </span>
  )
}
