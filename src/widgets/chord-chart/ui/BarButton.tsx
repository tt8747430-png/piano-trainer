import { Square } from 'lucide-react'
import type { Ref } from 'react'
import { useBarName } from '@/shared/i18n'
import { cn } from '@/shared/lib'

/**
 * What a tap on a chart's bar does: plays it, a toggle pressed while it sounds (a song's chart); or
 * takes the Player there, its bar current while the cursor is in it (ADR 0098).
 */
export type BarTap = 'play' | 'go'

/**
 * One bar of a chart's line: its number, its chords, and under them its method labels or short
 * length; a bar of no chord its number alone (ADR 0094). `marked` while it plays: the bar sounding,
 * with a square to stop it, or the bar the Player is in, which is a pointer's target only, as the
 * sheet's bars are (the arrows move the cursor).
 */
export function BarButton({
  tap,
  number,
  symbols,
  notes,
  marked,
  onClick,
  ref,
}: {
  tap: BarTap
  number: number
  symbols: readonly string[]
  /** Method labels and a short bar's length, under the chords. */
  notes: readonly string[]
  marked: boolean
  onClick: () => void
  ref?: Ref<HTMLButtonElement> | undefined
}) {
  const barName = useBarName()
  return (
    <button
      ref={ref}
      type="button"
      // Named by all it prints: its number, its chords, and the notes under them.
      aria-label={barName(
        number,
        [symbols.join(' '), ...notes].filter((said) => said !== '').join(' · '),
      )}
      {...(tap === 'play'
        ? { 'aria-pressed': marked }
        : { 'aria-current': marked ? ('step' as const) : undefined, tabIndex: -1 })}
      onClick={onClick}
      className={cn(
        'relative flex min-h-18 min-w-0 flex-col items-start justify-end gap-0.5 overflow-hidden border-l border-input px-2.5 pt-5 pb-2 text-left landscape-phone:min-h-14 landscape-phone:pb-1 transition-colors duration-200 ease-out focus-visible:-outline-offset-3',
        marked ? 'bg-secondary text-secondary-foreground' : 'hover:bg-muted/60',
      )}
    >
      {marked && tap === 'play' ? (
        <Square aria-hidden className="absolute top-1.5 right-2 size-3" />
      ) : null}
      <span
        aria-hidden
        className="absolute top-1 left-2 text-xs text-muted-foreground tabular-nums"
      >
        {number}
      </span>
      {/* A bar of several chords wraps them, a size down, rather than cut the last off. */}
      <span
        aria-hidden
        className={cn(
          'flex max-w-full flex-wrap gap-x-1.5 font-display leading-tight font-semibold',
          symbols.length > 2 ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl',
        )}
      >
        {symbols.map((symbol, i) => (
          <span key={i} className="whitespace-nowrap">
            {symbol}
          </span>
        ))}
      </span>
      {notes.length > 0 ? (
        // Ends in an ellipsis where a narrow bar cannot hold it all; its name holds it whole.
        <span aria-hidden className="max-w-full truncate text-xs text-muted-foreground">
          {notes.join(' · ')}
        </span>
      ) : null}
    </button>
  )
}
