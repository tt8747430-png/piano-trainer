import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { DiagramChord } from '@/features/practice'
import { cn, useScrollMotion } from '@/shared/lib'
import { printedSymbol } from '@/shared/lib/music'
import { ChordDiagram } from './ChordDiagram'
import { ChordSheet } from './ChordSheet'

/**
 * A piece's chord summary (ADR 0099, 0101): its chords in the order they first sound
 * (`chordSummary`), each its keys over its symbol as the sheet prints it (`C♯m7`), a button opening
 * its sheet; one row, scrolling sideways where it is wider than its room. Nothing for music of no
 * chord symbol. Following the music (`sounding`, Chords over lyrics' pinned row, ADR 0108), the
 * chord sounding is outlined in ink and kept in sight, the others' symbols muted.
 */
export function ChordSummary({
  chords,
  sounding,
}: {
  chords: readonly DiagramChord[]
  /** The symbol of the chord sounding, where the row follows the music; none in a bar of none. */
  sounding?: string | null
}) {
  const { t } = useTranslation('music')
  // The chord last opened stays in its sheet as the sheet closes; drawn as its piece draws it now.
  const [shown, setShown] = useState<{ symbol: string; open: boolean } | null>(null)
  const chord = shown ? chords.find(({ symbol }) => symbol === shown.symbol) : undefined
  const row = useRef<HTMLUListElement>(null)
  const motion = useScrollMotion()
  const follows = sounding !== undefined
  // The chord sounding brought into the row's sight, sideways only: the row is its offset parent.
  useEffect(() => {
    const list = row.current
    const now = list?.querySelector<HTMLElement>('[aria-current]')
    if (!list || !now) return
    const left = now.offsetLeft
    const right = left + now.offsetWidth
    if (left >= list.scrollLeft && right <= list.scrollLeft + list.clientWidth) return
    list.scrollTo({
      left: Math.max(0, left - (list.clientWidth - now.offsetWidth) / 2),
      behavior: motion,
    })
  }, [sounding, motion])
  if (chords.length === 0) return null
  return (
    <>
      <ul
        ref={row}
        aria-label={t('chordSummary')}
        className="relative flex fade-scroll-x gap-2 overflow-x-auto overscroll-x-contain scrollbar-none"
      >
        {chords.map((each) => {
          const now = each.symbol === sounding
          return (
            <li key={each.symbol} className="shrink-0">
              <button
                type="button"
                aria-current={now ? 'true' : undefined}
                onClick={() => setShown({ symbol: each.symbol, open: true })}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-xl border border-transparent p-2 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3',
                  now && 'border-foreground',
                )}
              >
                {/* Every chord on the same keys, the same size. */}
                <ChordDiagram chord={each} className="h-10 w-auto" />
                <span
                  aria-hidden
                  className={cn(
                    'font-display text-lg leading-tight font-semibold',
                    follows && !now && 'text-muted-foreground',
                  )}
                >
                  {printedSymbol(each.symbol)}
                </span>
              </button>
            </li>
          )
        })}
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
