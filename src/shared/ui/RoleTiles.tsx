import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { printedSymbol, type RoleOf } from '@/shared/lib/music'
import { PAINT, ROLE_PAINT } from './paint'

/**
 * A progression with why it works drawn on its chords (canvas 177): each chord a tile in its role's
 * paint, four to a row like bars, and under each how its root moves on to the next.
 */
export function RoleTiles({ label, children }: { label: string; children: ReactNode }) {
  return (
    <ol aria-label={label} className="grid grid-cols-4 gap-x-2 gap-y-3">
      {children}
    </ol>
  )
}

/**
 * One chord of the row: a tile 96 tall (120 on a laptop) in its role's paint, its numeral in the
 * serif over its chord, ringed in ink while it sounds; under it, how the root moves on. A tap plays it.
 */
export function RoleTile({
  numeral,
  chord,
  role,
  sounding,
  label,
  move,
  onClick,
}: {
  /** The numeral or Nashville number, where the row names its chords so. */
  numeral?: string | undefined
  /** The chord's symbol. */
  chord: string
  role: RoleOf
  sounding: boolean
  /** What a screen reader says: the chord and what it does. */
  label: string
  /** How its root moves to the next chord, in words. */
  move: string
  onClick: () => void
}) {
  const look = PAINT[ROLE_PAINT[role.role]]
  return (
    <li className="flex min-w-0 flex-col items-center gap-2">
      <button
        type="button"
        aria-label={label}
        aria-pressed={sounding}
        onClick={onClick}
        className={cn(
          'flex h-24 w-full flex-col items-center justify-center gap-0.5 rounded-card px-1 text-foreground lg:h-30',
          look.fill,
          sounding && 'ring-2 ring-foreground ring-inset',
        )}
      >
        {numeral ? (
          <span className="max-w-full truncate font-display text-name/[normal] lg:text-4xl/[normal]">
            {printedSymbol(numeral)}
          </span>
        ) : null}
        <span className="max-w-full truncate text-subhead/[normal] font-bold">
          {printedSymbol(chord)}
        </span>
      </button>
      <span className="max-w-full truncate text-xs leading-3.5 text-muted-foreground">{move}</span>
    </li>
  )
}

/**
 * What the tiles' paints mean, in one line under them (Tonic, Predominant, Dominant), the terms
 * theory books use, with no ⓘ, as the Progression board draws it.
 */
export function RoleLegend() {
  const { t } = useTranslation('music')
  return (
    <div className="flex flex-wrap items-center gap-y-1 text-footnote leading-[normal] text-muted-foreground">
      <span className="flex flex-wrap items-center gap-x-4">
        {(['home', 'away', 'tension'] as const).map((role) => (
          <span key={role} className="flex items-center gap-2">
            <span
              aria-hidden
              className={cn(
                'size-2.5 rounded-pill ring-1 ring-border',
                PAINT[ROLE_PAINT[role]].fill,
              )}
            />
            {t(`harmony.role.${role}`)}
          </span>
        ))}
      </span>
    </div>
  )
}
