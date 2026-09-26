import { Square } from 'lucide-react'
import type { Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'

/**
 * One bar of a chart: its number, its chords, and under them its method labels or short length.
 * Where a tap plays the bar, it is a toggle, pressed while the bar sounds.
 */
export function BarButton({
  number,
  symbols,
  notes,
  current,
  pressed,
  onClick,
  ref,
}: {
  number: number
  symbols: readonly string[]
  /** Method labels and a short bar's length, under the chords. */
  notes: readonly string[]
  current: boolean
  /** Pressed while its sound plays, where the bar is a toggle; left out where it is not. */
  pressed?: boolean | undefined
  onClick: () => void
  ref?: Ref<HTMLButtonElement>
}) {
  const { t } = useTranslation('piece')
  return (
    <button
      ref={ref}
      type="button"
      aria-label={`${t('barLabel', { n: number })}: ${symbols.join(' ')}`}
      aria-current={current ? 'step' : undefined}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        'relative flex min-h-18 min-w-24 shrink-0 flex-col items-start justify-end gap-0.5 border-l-2 border-foreground/80 px-2.5 pt-5 pb-2 text-left landscape-phone:min-h-14 landscape-phone:pb-1 transition-colors duration-200 ease-out outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset',
        current || pressed ? 'bg-muted text-primary' : 'hover:bg-muted/60',
      )}
    >
      {pressed ? <Square aria-hidden className="absolute top-1.5 right-2 size-3" /> : null}
      <span
        aria-hidden
        className="absolute top-1 left-2 text-xs text-muted-foreground tabular-nums"
      >
        {number}
      </span>
      <span aria-hidden className="text-xl font-bold whitespace-nowrap">
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
