import { useTranslation } from 'react-i18next'
import type { DiagramChord } from '@/features/practice'
import { printedSymbol } from '@/shared/lib/music'
import { ChordDiagram } from './ChordDiagram'

/**
 * A piece's chords as diagrams on a page of their own, the last of its print (ADR 0107, Chordify's):
 * under their heading, each its keys over its symbol as the sheet prints it, in the order they first
 * sound and in the inversion its piece chose (ADR 0101), four a row. Nothing for music of no chord
 * symbol.
 */
export function PrintedDiagrams({ chords }: { chords: readonly DiagramChord[] }) {
  const { t } = useTranslation('music')
  if (chords.length === 0) return null
  return (
    <section className="flex flex-col gap-6 break-before-page">
      <h2 className="text-2xl">{t('chordSummary')}</h2>
      <div className="grid grid-cols-4 gap-x-6 gap-y-8">
        {chords.map((chord) => (
          <figure
            key={chord.symbol}
            className="flex flex-col items-center gap-2 break-inside-avoid"
          >
            <ChordDiagram chord={chord} />
            <figcaption className="font-display text-2xl leading-none font-semibold">
              {printedSymbol(chord.symbol)}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
