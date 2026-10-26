import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { DiagramChord } from '@/features/practice'
import { printedSymbol } from '@/shared/lib/music'
import { ChordDiagram } from './ChordDiagram'
import { ChordSheet } from './ChordSheet'

/**
 * A piece's chord summary (ADR 0099, 0101): its chords in the order they first sound
 * (`chordSummary`), each its keys over its symbol as the sheet prints it (`C♯m7`), a button opening
 * its sheet; one row, scrolling sideways where it is wider than its room. Nothing for music of no
 * chord symbol.
 */
export function ChordSummary({ chords }: { chords: readonly DiagramChord[] }) {
  const { t } = useTranslation('music')
  // The chord last opened stays in its sheet as the sheet closes; drawn as its piece draws it now.
  const [shown, setShown] = useState<{ symbol: string; open: boolean } | null>(null)
  const chord = shown ? chords.find(({ symbol }) => symbol === shown.symbol) : undefined
  if (chords.length === 0) return null
  return (
    <>
      <ul
        aria-label={t('chordSummary')}
        className="flex fade-scroll-x gap-2 overflow-x-auto overscroll-x-contain scrollbar-none"
      >
        {chords.map((each) => (
          <li key={each.symbol} className="shrink-0">
            <button
              type="button"
              onClick={() => setShown({ symbol: each.symbol, open: true })}
              className="flex flex-col items-center gap-1.5 rounded-xl p-2 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3"
            >
              {/* Every chord on the same keys, the same size. */}
              <ChordDiagram chord={each} className="h-10 w-auto" />
              <span aria-hidden className="font-display text-lg leading-tight font-semibold">
                {printedSymbol(each.symbol)}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {shown && chord ? (
        <ChordSheet
          chord={chord}
          open={shown.open}
          onOpenChange={(open) => setShown({ ...shown, open })}
        />
      ) : null}
    </>
  )
}
