import { useTranslation } from 'react-i18next'
import type { DiagramChord } from '@/features/practice'
import { cn } from '@/shared/lib'
import { printedSymbol } from '@/shared/lib/music'
import { ChordDiagram } from '@/widgets/chord-diagrams'

/**
 * The Diagrams view's summary (ADR 0101, Chordify's): the song's chords at once as cards in the
 * order they first sound, two a row on a phone held upright, three from a tablet's width, four on a
 * laptop; the card of the chord sounding outlined in ink, its symbol in ink, the others' muted. A
 * card opens its chord's sheet (`onChord`).
 */
export function SummaryGrid({
  chords,
  sounding,
  onChord,
}: {
  chords: readonly DiagramChord[]
  /** The symbol of the chord sounding; none in a bar of no chord. */
  sounding: string | null
  onChord: (chord: number) => void
}) {
  const { t } = useTranslation('music')
  return (
    <ul
      aria-label={t('chordSummary')}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
    >
      {chords.map((chord) => {
        const now = chord.symbol === sounding
        return (
          <li key={chord.symbol}>
            <button
              type="button"
              aria-current={now ? 'true' : undefined}
              onClick={() => onChord(chord.chord)}
              className={cn(
                'card flex w-full flex-col items-center gap-2 p-3 transition-colors duration-200 ease-out hover:bg-muted',
                now && 'border-foreground',
              )}
            >
              <ChordDiagram chord={chord} />
              <span
                aria-hidden
                className={cn(
                  'font-display text-2xl leading-none font-semibold',
                  now ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {printedSymbol(chord.symbol)}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
