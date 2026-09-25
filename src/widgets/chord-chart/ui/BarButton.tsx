import type { Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'

/** One bar of a chart: its number, its chords, and under them its method labels or short length. */
export function BarButton({
  number,
  symbols,
  notes,
  current,
  onClick,
  ref,
}: {
  number: number
  symbols: readonly string[]
  /** Method labels and a short bar's length, under the chords. */
  notes: readonly string[]
  current: boolean
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
      onClick={onClick}
      className={cn(
        'relative flex min-h-18 min-w-24 shrink-0 flex-col items-start justify-end gap-0.5 border-l-2 border-foreground/80 px-2.5 pt-5 pb-2 text-left transition-colors duration-200 ease-out outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset',
        current ? 'bg-muted text-primary' : 'hover:bg-muted/60',
      )}
    >
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
