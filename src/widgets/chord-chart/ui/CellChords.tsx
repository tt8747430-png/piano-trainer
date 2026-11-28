import { chordLabelWidth, cn } from '@/shared/lib'
import { printedSymbol } from '@/shared/lib/music'
import { RaisedSymbol } from '@/shared/ui'

/** A later chord starting in the same beat, as a share of the first's size: a size down. */
const LATER = 0.8
/** The room kept after a beat's chords before the beats they hold end, CSS rem. */
const INSET = 0.25
/** The least and the largest a chord is drawn in a cell, rem: smaller, it is not read at a glance. */
const LEAST = 0.75

/** How wide a beat's chord names are drawn at a size of 1, the gap between two included. */
function namesWidth(printed: readonly string[]): number {
  return printed.reduce(
    (sum, symbol, i) => sum + chordLabelWidth(symbol, i === 0 ? 1 : LATER) + (i > 0 ? 0.25 : 0),
    0,
  )
}

/** A cell's own inset round its chords at its widest, rem: the Grid's 14px from 640px. */
const CELL_INSET = 1.125

/**
 * A bar's beat columns: each beat its share of the bar, and a beat holding chords never narrower than
 * its names at `LEAST`, so a long name in a crowded bar takes room from the empty beats beside it
 * instead of running into the next chord (`B♭maj⁷` beside `C/B♭ C⁷sus⁴` on a phone).
 */
export function beatColumns(cells: readonly (readonly string[])[]): string {
  return cells
    .map((chords) =>
      chords.length === 0
        ? 'minmax(0, 1fr)'
        : `minmax(${(namesWidth(chords.map(printedSymbol)) * LEAST + CELL_INSET).toFixed(3)}rem, 1fr)`,
    )
    .join(' ')
}

/**
 * How a chart sets its chords, as its board does: the Player's Grid (`grid`, PlayerViewGrid and
 * PlayerDesk) in the sans at 500, 19 at most on a phone and 28 from 640px; a song's chart (`chart`,
 * the Explore board's) in the book serif at 700, 22.
 */
export type ChordFace = 'grid' | 'chart'
const FACE: Record<ChordFace, { most: string; look: string }> = {
  grid: {
    most: 'var(--chord-most)',
    look: 'font-medium [--chord-most:1.1875rem] sm:[--chord-most:1.75rem]',
  },
  chart: { most: '1.375rem', look: 'font-display font-bold' },
}

/**
 * The chords starting in a beat cell (ADR 0108), in their chart's face (`face`), the extensions raised
 * at max(12px, .6em) (`G⁷`, `C♯m⁷`): as large as the cell holds them, a size down where it is narrow, never under `LEAST`;
 * the later of two a size down again. Sized by the container (`@container`) round it, which spans
 * the beats they hold (their own and the empty ones after it, ADR 0108), so a chord held for a bar is
 * drawn as large as its bar allows, as its neighbours are.
 */
export function CellChords({
  symbols,
  face,
  className,
}: {
  symbols: readonly string[]
  face: ChordFace
  className?: string
}) {
  if (symbols.length === 0) return null
  const printed = symbols.map(printedSymbol)
  const width = namesWidth(printed)
  return (
    <span
      data-chords=""
      className={cn(
        'flex items-baseline gap-1 leading-none whitespace-nowrap',
        FACE[face].look,
        className,
      )}
      style={{
        fontSize: `clamp(${LEAST}rem, calc((100cqi - ${INSET}rem) / ${width.toFixed(3)}), ${FACE[face].most})`,
      }}
    >
      {printed.map((symbol, i) => {
        return (
          <span key={i} style={i > 0 ? { fontSize: `${LATER}em` } : undefined}>
            <RaisedSymbol symbol={symbol} />
          </span>
        )
      })}
    </span>
  )
}
