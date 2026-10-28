import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { printedSymbol, ROOT_STEPS } from '@/shared/lib/music'
import { MOVE_PAINT, PAINT, type Paint } from './paint'

/**
 * A progression's chips in one even grid: as many columns as fit, every chip as wide as the rest,
 * wrapping onto a second row on a narrow phone.
 */
export function HarmonyChips({ label, children }: { label: string; children: ReactNode }) {
  return (
    <ul
      aria-label={label}
      className="grid grid-cols-[repeat(auto-fit,minmax(3.25rem,1fr))] gap-1.5"
    >
      {children}
    </ul>
  )
}

/**
 * One chord of a progression as a chip: its numeral over a second line (its function, or how its
 * root moved there), in its paint's wash; at full strength, ink on it, while it sounds. A tap plays
 * the chord. A chip with no paint (a move that steps back) is sand-neutral.
 */
export function HarmonyChip({
  numeral,
  detail,
  paint,
  sounding,
  label,
  onClick,
}: {
  numeral: string
  /** The second line: `T`, `PD`, `D`, or a move (`↓5`); none for the first chord's move. */
  detail?: string | undefined
  paint: Paint | undefined
  sounding: boolean
  /** What a screen reader says: the numeral and what its line means in words. */
  label: string
  onClick: () => void
}) {
  const look = paint ? PAINT[paint] : undefined
  return (
    <li className="grid">
      <button
        type="button"
        aria-label={label}
        aria-pressed={sounding}
        onClick={onClick}
        className={cn(
          'flex min-h-14 min-w-0 flex-col items-center justify-center rounded-xl px-1 py-1.5 leading-tight transition-colors duration-200 ease-out focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring',
          sounding
            ? look
              ? cn(look.full, 'text-on-paint-full')
              : 'bg-foreground text-background'
            : look
              ? cn(look.fill, look.ink, 'hover:brightness-95')
              : 'bg-muted text-muted-foreground hover:text-foreground',
        )}
      >
        <span className="max-w-full truncate font-display text-lg font-semibold">
          {printedSymbol(numeral)}
        </span>
        <span aria-hidden className="text-sm font-semibold tabular-nums">
          {detail ?? ' '}
        </span>
      </button>
    </li>
  )
}

/**
 * What a root-motion chip's colours mean, on a card: each strong move in its paint, then the moves
 * that step back, in soft ink.
 */
export function RootMoveLegend() {
  const { t } = useTranslation('music')
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 card p-4 text-sm">
      {ROOT_STEPS.map((step) => (
        <div key={step} className="contents">
          <dt className={cn('font-semibold whitespace-nowrap', PAINT[MOVE_PAINT[step]].ink)}>
            {t(`harmony.legend.${step}.name`)}
          </dt>
          <dd>{t(`harmony.legend.${step}.text`)}</dd>
        </div>
      ))}
      <div className="contents">
        <dt className="font-semibold whitespace-nowrap text-muted-foreground">
          {t('harmony.legend.back.name')}
        </dt>
        <dd className="text-muted-foreground">{t('harmony.legend.back.text')}</dd>
      </div>
    </dl>
  )
}
