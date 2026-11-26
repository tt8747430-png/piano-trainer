import { printedSymbol, symbolParts } from '@/shared/lib/music'

/**
 * A chord's symbol as printed (`C♯m⁷♭⁵`, `G/B`): the root, the quality, its numbers and alterations
 * raised (never under 12px), the bass after its slash; in the text's own ink and size.
 */
export function RaisedSymbol({ symbol }: { symbol: string }) {
  const { root, letters, raised, bass } = symbolParts(printedSymbol(symbol))
  return (
    <>
      {root}
      {letters}
      {raised ? <sup className="ms-px text-[max(12px,0.6em)]">{raised}</sup> : null}
      {bass}
    </>
  )
}
