import { Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'

/**
 * One bar of a chart's line: its number, its chords, and under them its method labels or short
 * length. A tap plays the bar: it is a toggle, pressed while the bar sounds.
 */
export function BarButton({
  number,
  symbols,
  notes,
  pressed,
  onClick,
}: {
  number: number
  symbols: readonly string[]
  /** Method labels and a short bar's length, under the chords. */
  notes: readonly string[]
  /** Pressed while its sound plays. */
  pressed: boolean
  onClick: () => void
}) {
  const { t } = useTranslation('piece')
  return (
    <button
      type="button"
      aria-label={`${t('barLabel', { n: number })}: ${symbols.join(' ')}`}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        'relative flex min-h-18 min-w-0 flex-col items-start justify-end gap-0.5 overflow-hidden border-l border-input px-2.5 pt-5 pb-2 text-left landscape-phone:min-h-14 landscape-phone:pb-1 transition-colors duration-200 ease-out outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset',
        pressed ? 'bg-secondary text-secondary-foreground' : 'hover:bg-muted/60',
      )}
    >
      {pressed ? <Square aria-hidden className="absolute top-1.5 right-2 size-3" /> : null}
      <span
        aria-hidden
        className="absolute top-1 left-2 text-xs text-muted-foreground tabular-nums"
      >
        {number}
      </span>
      <span
        aria-hidden
        className="font-display text-xl font-semibold whitespace-nowrap sm:text-2xl"
      >
        {symbols.join(' ')}
      </span>
      {notes.length > 0 ? (
        <span aria-hidden className="text-xs whitespace-nowrap text-muted-foreground">
          {notes.join(' · ')}
        </span>
      ) : null}
    </button>
  )
}
