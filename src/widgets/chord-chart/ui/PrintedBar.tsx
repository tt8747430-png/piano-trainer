import type { CSSProperties } from 'react'
import { useBarName } from '@/shared/i18n'
import { BAR, barWords } from '../model/bar-look'
import { BarCells } from './BarCells'
import { beatColumns } from './CellChords'

/** A bar of a chart as it prints (ADR 0107): its beats and chords as the screen's, nothing to tap. */
export function PrintedBar({
  number,
  symbols,
  cells,
  notes,
  style,
}: {
  /** Its number as printed (`printedBar`): none for a pickup. */
  number: number | null
  symbols: readonly string[]
  cells: readonly (readonly string[])[]
  notes: readonly string[]
  style?: CSSProperties
}) {
  const barName = useBarName()
  return (
    <div
      role="group"
      aria-label={barName(number, barWords(symbols, notes))}
      className={BAR}
      style={{ ...style, gridTemplateColumns: beatColumns(cells) }}
    >
      <BarCells number={number} cells={cells} notes={notes} face="chart" />
    </div>
  )
}
