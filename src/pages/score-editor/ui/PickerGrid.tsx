import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

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
}: {
  label: string
  /** Each group's cells, in order: a group starts a row of its own. */
  rows: readonly { readonly label: string; readonly cells: readonly ReactNode[] }[]
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="overflow-hidden rounded-2xl border border-hairline bg-hairline"
    >
      {rows.map((row) => (
        <div
          key={row.label}
          role="group"
          aria-label={row.label}
          className={cn('grid gap-px border-hairline not-first:border-t', COLUMNS)}
        >
          {row.cells}
          {/* The row's empty cells: up to a whole row at seven, and at four. */}
          {Array.from({ length: (7 - (row.cells.length % 7)) % 7 }, (_, at) => (
            <span key={`wide-${at}`} aria-hidden className="hidden bg-card min-[380px]:block" />
          ))}
          {Array.from({ length: (4 - (row.cells.length % 4)) % 4 }, (_, at) => (
            <span key={`narrow-${at}`} aria-hidden className="bg-card min-[380px]:hidden" />
          ))}
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
  onClick,
  children,
}: {
  label: string
  pressed: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      onClick={onClick}
      className="grid min-h-13 min-w-11 place-items-center bg-card px-0.5 text-foreground/75 transition-colors duration-150 outline-none hover:bg-accent hover:text-foreground focus-visible:z-10 focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-ring aria-pressed:bg-link/12 aria-pressed:text-link motion-reduce:transition-none"
    >
      {children}
    </button>
  )
}
