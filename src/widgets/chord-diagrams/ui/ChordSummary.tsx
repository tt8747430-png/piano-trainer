import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { DiagramChord } from '@/features/practice'
import { cn, useScrollMotion } from '@/shared/lib'
import { printedSymbol } from '@/shared/lib/music'
import { ChordDiagram } from './ChordDiagram'
import { ChordSheet } from './ChordSheet'

/**
 * A piece's chord summary (ADR 0108): its chords in the order they first sound
 * (`chordSummary`), each its keys over its symbol as the sheet prints it (`C♯m7`), a button opening
 * its sheet; one row, scrolling sideways where it is wider than its room. Nothing for music of no
 * chord symbol. Following the music (`sounding`, Chords over lyrics' pinned row, ADR 0108), it is
 * drawn smaller, to stay pinned in little room, and the chord sounding is outlined in ink and kept
 * in sight, the others' symbols muted, and a chord tapped is the music's to go to (`onChord`, ADR
 * 0108) where its sheet would open.
 */
export function ChordSummary({
  chords,
  sounding,
  onChord,
}: {
  chords: readonly DiagramChord[]
  /** The symbol of the chord sounding, where the row follows the music; none in a bar of none. */
  sounding?: string | null
  /** A chord tapped, by its symbol, where the row follows the music: in place of its sheet. */
  onChord?: (symbol: string) => void
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
        className={cn(
          'relative flex overflow-x-auto overscroll-x-contain scrollbar-none',
          follows ? 'gap-2' : '-mx-4 gap-2.5 px-4 pt-0.5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0.5',
        )}
      >
        {chords.map((each) => {
          const now = each.symbol === sounding
          return (
            <li key={each.symbol} className="shrink-0">
              <button
                type="button"
                aria-current={now ? 'true' : undefined}
                onClick={() =>
                  onChord ? onChord(each.symbol) : setShown({ symbol: each.symbol, open: true })
                }
                className={cn(
                  'flex flex-col items-center focus-visible:-outline-offset-3',
                  // Following the music, a quiet cell; on a song's page, the canvas's chord card.
                  follows
                    ? 'gap-0.5 rounded-control border border-transparent px-1.5 py-1 transition-colors duration-200 ease-out hover:bg-muted'
                    : 'gap-1.5 rounded-[14px] bg-card p-2.5 shadow-[0_0_0_1px_var(--color-border)] transition-[filter] duration-200 ease-out hover:brightness-[0.97]',
                  now && 'border-foreground',
                )}
              >
                {/* Every chord on the same keys, the same size. */}
                <ChordDiagram
                  chord={each}
                  className={follows ? 'h-8 w-auto landscape-phone:h-6' : 'h-[2.875rem] w-auto'}
                />
                <span
                  aria-hidden
                  className={cn(
                    'leading-tight',
                    follows
                      ? 'font-display text-base font-semibold landscape-phone:text-sm'
                      : 'font-sans text-base font-bold',
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
