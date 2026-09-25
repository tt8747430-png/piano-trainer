import { useTranslation } from 'react-i18next'
import { barColumns } from '@/features/practice'
import type { NoteHand, Performance } from '@/shared/lib/arrangement'
import { cn } from '@/shared/lib'

const HAND_TEXT: Readonly<Record<NoteHand, string>> = {
  rh: 'text-hand-rh',
  lh: 'text-hand-lh',
  melody: 'text-hand-melody',
}
const HANDS_HIGH_TO_LOW = ['melody', 'rh', 'lh'] as const

/** The current bar's notes by beat and hand; a column jumps there. */
export function NoteGrid({
  performance,
  bar,
  current,
  onJump,
}: {
  performance: Performance
  bar: number
  current: number
  onJump: (beatGroup: number) => void
}) {
  const { t } = useTranslation('player')
  const columns = barColumns(performance, bar)
  const hands = HANDS_HIGH_TO_LOW.filter((hand) => columns.some((c) => c.notes[hand].length > 0))
  return (
    <div
      role="group"
      aria-label={t('grid.label', { n: bar + 1 })}
      className="-mx-4 flex overflow-x-auto px-4 scrollbar-none landscape-phone:mx-0 landscape-phone:px-0"
    >
      {columns.map((column) => (
        <button
          key={column.beatGroup}
          type="button"
          aria-current={column.beatGroup === current ? 'step' : undefined}
          onClick={() => onJump(column.beatGroup)}
          className={cn(
            'flex min-w-16 shrink-0 flex-col items-center gap-1 rounded-2xl px-2 py-3 landscape-phone:py-1 transition-colors duration-200 ease-out outline-none focus-visible:ring-3 focus-visible:ring-ring',
            column.beatGroup === current ? 'bg-muted' : 'hover:bg-muted/60',
          )}
        >
          <span className="text-sm font-semibold text-muted-foreground">{column.beat}</span>
          {hands.map((hand) => (
            <span
              key={hand}
              className={cn(
                'flex flex-col items-center text-lg font-bold landscape-phone:text-base',
                HAND_TEXT[hand],
              )}
            >
              {column.notes[hand].map((n, i) => (
                <span key={i}>
                  {n.label}
                  {n.finger ? <sup className="ml-0.5">{n.finger}</sup> : null}
                </span>
              ))}
            </span>
          ))}
        </button>
      ))}
    </div>
  )
}
