import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { DiagramChord } from '@/features/practice'
import { ChordDiagram } from './ChordDiagram'
import { ChordSheet } from './ChordSheet'

/**
 * A piece's chord summary (ADR 0099): its chords in the order they first sound (`chordSummary`), each
 * its keys over its symbol, a button opening its sheet; one row, scrolling sideways where it is
 * wider than its room. Nothing for music of no chord symbol.
 */
export function ChordSummary({ chords }: { chords: readonly DiagramChord[] }) {
  const { t } = useTranslation('music')
  // The chord last opened stays in its sheet as the sheet closes.
  const [shown, setShown] = useState<{ chord: DiagramChord; open: boolean } | null>(null)
  if (chords.length === 0) return null
  return (
    <>
      <ul
        aria-label={t('chordSummary')}
        className="flex fade-scroll-x gap-2 overflow-x-auto overscroll-x-contain scrollbar-none"
      >
        {chords.map((chord) => (
          <li key={chord.symbol} className="shrink-0">
            <button
              type="button"
              onClick={() => setShown({ chord, open: true })}
              className="flex flex-col items-center gap-1.5 rounded-xl p-2 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3"
            >
              {/* One height for all: every chord's keys the same size, a wide chord wider. */}
              <ChordDiagram chord={chord} className="h-10 w-auto" />
              <span aria-hidden className="font-display text-lg leading-tight font-semibold">
                {chord.symbol}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {shown ? (
        <ChordSheet
          chord={shown.chord}
          open={shown.open}
          onOpenChange={(open) => setShown({ ...shown, open })}
        />
      ) : null}
    </>
  )
}
