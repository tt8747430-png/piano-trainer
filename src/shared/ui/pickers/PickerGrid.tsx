import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { usePickerLayout } from './picker-layout'

/** A picker grid's columns: four on the narrowest phone, so each cell keeps 44px; seven from 380px. */
const COLUMNS = 'grid-cols-4 min-[380px]:grid-cols-7'

/**
 * A picker's signs as one bordered grid (ADR 0114, as notation apps' key and clef sheets): each group
 * of signs (`rows`) its own rows, hairlines between every cell, empty cells closing a short row so
 * the lines run whole; four columns on the narrowest phone, seven from 380px.
 */
export function PickerGrid({
  label,
  rows,
  columns = 7,
}: {
  label: string
  /** Four for a grid whose rows hold four (a new song's time signatures): no empty cells. */
  columns?: 4 | 7
  /** Each group's cells, in order: a group starts a row of its own. */
  rows: readonly { readonly label: string; readonly cells: readonly ReactNode[] }[]
}) {
  // In a row (the score editor's folded palette, R31-E): every sign in turn, nothing between.
  if (usePickerLayout() === 'row')
    return (
      <div role="group" aria-label={label} className="flex shrink-0 items-center gap-0.5">
        {rows.flatMap((row) => row.cells)}
      </div>
    )
  return (
    <div
      role="group"
      aria-label={label}
      className="overflow-hidden rounded-control border border-hairline bg-hairline"
    >
      {rows.map((row) => (
        <div
          key={row.label}
          role="group"
          aria-label={row.label}
          className={cn(
            'grid gap-px border-hairline not-first:border-t',
            columns === 4 ? 'grid-cols-4' : COLUMNS,
          )}
        >
          {row.cells}
          {/* The row's empty cells: up to a whole row at seven, and at four. */}
          {Array.from({ length: (columns - (row.cells.length % columns)) % columns }, (_, at) => (
            <span
              key={`wide-${at}`}
              aria-hidden
              className={cn('bg-card', columns === 7 && 'hidden min-[380px]:block')}
            />
          ))}
          {columns === 7
            ? Array.from({ length: (4 - (row.cells.length % 4)) % 4 }, (_, at) => (
                <span key={`narrow-${at}`} aria-hidden className="bg-card min-[380px]:hidden" />
              ))
            : null}
        </div>
      ))}
    </div>
  )
}

/**
 * A sign in a picker's grid: a 52px cell (44px wide at the least), named by its tooltip and to a screen
 * reader, the one in force tinted in the accent and pressed; a tap chooses it.
 */
export function PickerCell({
  label,
  pressed,
  disabled = false,
  onClick,
  children,
}: {
  label: string
  pressed: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  const row = usePickerLayout() === 'row'
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'grid place-items-center px-0.5 text-foreground/75 choice focus-visible:z-10 focus-visible:-outline-offset-3 disabled:opacity-35 motion-reduce:transition-none',
        row ? 'h-10 min-w-11 shrink-0 rounded-control' : 'min-h-13 min-w-11 bg-card',
      )}
    >
      {children}
    </button>
  )
}
