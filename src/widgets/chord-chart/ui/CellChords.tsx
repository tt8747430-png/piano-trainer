import { chordLabelWidth, cn } from '@/shared/lib'
import { printedSymbol, symbolParts } from '@/shared/lib/music'

/** A later chord starting in the same beat, as a share of the first's size: a size down. */
const LATER = 0.8
/** The room a cell keeps round its chords: its inset either side, CSS rem. */
const INSET = 0.5
/** The least and the largest a chord is drawn in a cell, rem: smaller, it is not read at a glance. */
const LEAST = 0.75

/**
 * How a chart sets its chords, as its board does: the Player's Grid (`grid`, PlayerViewGrid) in the
 * sans at 500, 19 at most; a song's chart (`chart`, the Explore board's) in the book serif at 700, 22.
 */
export type ChordFace = 'grid' | 'chart'
const FACE: Record<ChordFace, { most: number; look: string }> = {
  grid: { most: 1.1875, look: 'font-medium' },
  chart: { most: 1.375, look: 'font-display font-bold' },
}

/**
 * The chords starting in a beat cell (ADR 0108), in their chart's face (`face`), the extensions raised
 * at max(12px, .6em) (`G⁷`, `C♯m⁷`): as large as the cell holds them, a size down where it is narrow, never under `LEAST`;
 * the later of two a size down again. Sized by the cell, the container (`@container`) round it,
 * and the empty beats after it it may run on into (`span`, the beats it has, its own one of them;
 * ADR 0108), so a chord held for a bar is drawn as large as its bar allows, as its neighbours are.
 */
export function CellChords({
  symbols,
  span = 1,
  face,
  className,
}: {
  symbols: readonly string[]
  face: ChordFace
  /** The beats it has room in: its own and the empty ones after it. */
  span?: number
  className?: string
}) {
  if (symbols.length === 0) return null
  const printed = symbols.map(printedSymbol)
  // How wide the names are drawn at a size of 1, the gap between two included.
  const width = printed.reduce(
    (sum, symbol, i) => sum + chordLabelWidth(symbol, i === 0 ? 1 : LATER) + (i > 0 ? 0.25 : 0),
    0,
  )
  return (
    <span
      data-chords=""
      className={cn(
        'flex items-baseline gap-1 leading-none whitespace-nowrap',
        FACE[face].look,
        className,
      )}
      style={{
        fontSize: `clamp(${LEAST}rem, calc((${span} * 100cqi - ${INSET}rem) / ${width.toFixed(3)}), ${FACE[face].most}rem)`,
      }}
    >
      {printed.map((symbol, i) => {
        const { root, letters, raised, bass } = symbolParts(symbol)
        return (
          <span key={i} style={i > 0 ? { fontSize: `${LATER}em` } : undefined}>
            {root}
            {letters}
            {raised ? <sup className="text-[max(12px,0.6em)]">{raised}</sup> : null}
            {bass}
          </span>
        )
      })}
    </span>
  )
}
