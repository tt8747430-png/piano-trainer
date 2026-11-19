import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { DiagramChord } from '@/features/practice'
import { cn, useScrollMotion } from '@/shared/lib'
import { noteName, printedSymbol, symbolParts } from '@/shared/lib/music'
import { LeadSymbol, MiniKeys } from '@/shared/ui'
import { ChordDiagram } from './ChordDiagram'
import { ChordSheet } from './ChordSheet'

/** A symbol with its extensions raised (`G⁷`), as the Lyrics board names a pinned chord. */
function Raised({ symbol }: { symbol: string }) {
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

/**
 * A piece's chord summary (ADR 0108): its chords in the order they first sound
 * (`chordSummary`), each its keys over its symbol as the sheet prints it (`C♯m7`), a button opening
 * its sheet; one row, scrolling sideways where it is wider than its room. Nothing for music of no
 * chord symbol. Following the music (`sounding`, Chords over lyrics' pinned row, ADR 0108), it is
 * the Lyrics board's row: each chord's framed keys 42 tall, its name 8 under them in the sans at
 * 500, 14, 16 apart; the chord sounding named bold and kept in sight, and a chord tapped is the
 * music's to go to (`onChord`, ADR 0108) where its sheet would open.
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
          follows ? 'gap-4' : '-mx-4 gap-2.5 px-4 pt-0.5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0.5',
        )}
      >
        {chords.map((each) => {
          const now = each.symbol === sounding
          return (
            <li key={each.symbol} className="shrink-0">
              <button
                type="button"
                aria-current={now ? 'true' : undefined}
                aria-label={
                  follows
                    ? undefined
                    : t('chordDiagram', {
                        symbol: printedSymbol(each.symbol),
                        notes: each.notes.map(noteName).join(' '),
                      })
                }
                onClick={() =>
                  onChord ? onChord(each.symbol) : setShown({ symbol: each.symbol, open: true })
                }
                className={cn(
                  'flex flex-col items-center focus-visible:-outline-offset-3',
                  // Following the music, a quiet cell; on a song's page, the canvas's chord card.
                  follows
                    ? 'gap-2 rounded-control'
                    : 'gap-2 rounded-card bg-card p-3 shadow-[0_0_0_1px_var(--color-border)] transition-[filter] duration-200 ease-out hover:brightness-[0.97]',
                )}
              >
                {/* Every chord on the same keys, the same size: following the music the Diagrams' keys,
                    on a song's page the boards' mini keys (CHORDS_ROW). */}
                {follows ? (
                  <ChordDiagram chord={each} className="h-[42px] w-auto landscape-phone:h-8" />
                ) : (
                  <MiniKeys keys={each.keys} />
                )}
                <span
                  aria-hidden
                  className={cn(
                    'leading-tight',
                    follows
                      ? 'font-sans text-sm leading-6 font-medium'
                      : 'font-sans text-base font-bold',
                    now && 'font-bold',
                  )}
                >
                  {follows ? (
                    <Raised symbol={each.symbol} />
                  ) : (
                    <LeadSymbol text={printedSymbol(each.symbol)} />
                  )}
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
