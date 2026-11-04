import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { DiagramChord } from '@/features/practice'
import { cn } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import { printedSymbol } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { useServices } from '@/shared/lib/services'
import { Segmented } from '@/shared/ui'
import { ChordDiagram } from '@/widgets/chord-diagrams'
import { chordsInOrder, chordsInSong } from '../model/chords-from'

type SummaryList = 'song' | 'order'

const GRID = 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 landscape-phone:grid-cols-4'

/**
 * The Diagrams view's summary (ADR 0108, R29 A37), as Chordify splits it: **In this song**, each
 * chord once in the order it first sounds, how often the music changes to it and its bars; a card
 * tapped plays the chord and shows its places, each a jump, the cursor staying where it is. **In
 * order**, a card a change as played (repeats taken), its bar over it, the sounding one marked; a
 * card tapped takes the cursor there (`onGo`, its chord's index).
 */
export function SummaryGrid({
  performance,
  chords,
  now,
  onGo,
}: {
  performance: Performance
  /** Each chord's diagram, by its symbol. */
  chords: readonly DiagramChord[]
  /** The chord sounding, by its index; none in a bar of no chord. */
  now: number | null
  onGo: (chord: number) => void
}) {
  const { t } = useTranslation(['music', 'player'])
  const { audio } = useServices()
  const [list, setList] = useState<SummaryList>('song')
  const [picked, setPicked] = useState<string | null>(null)
  const diagrams = useMemo(() => new Map(chords.map((chord) => [chord.symbol, chord])), [chords])
  const inSong = useMemo(() => chordsInSong(performance), [performance])
  const inOrder = useMemo(() => chordsInOrder(performance), [performance])
  const sounding = now === null ? null : (performance.chords[now]?.symbol ?? null)
  // The card of the change sounding: the last that starts at or before the chord sounding.
  const current = now === null ? -1 : inOrder.findLastIndex((card) => card.chord <= now)
  const play = (symbol: string) => {
    const keys = diagrams.get(symbol)?.keys ?? []
    if (keys.length > 0) audio.play(chordSounds(keys, { arpeggio: false }))
    setPicked(symbol)
  }
  return (
    <section aria-label={t('chordSummary')} className="flex flex-col gap-3">
      <Segmented<SummaryList>
        label={t('player:summary.list')}
        value={list}
        options={[
          { value: 'song', label: t('player:summary.inSong') },
          { value: 'order', label: t('player:summary.inOrder') },
        ]}
        onChange={setList}
      />
      {list === 'song' ? (
        <ul aria-label={t('player:summary.inSong')} className={GRID}>
          {inSong.map((chord) => {
            const diagram = diagrams.get(chord.symbol)
            const isNow = chord.symbol === sounding
            return (
              <li key={chord.symbol} className="flex flex-col gap-1">
                <button
                  type="button"
                  aria-label={printedSymbol(chord.symbol)}
                  aria-current={isNow ? 'true' : undefined}
                  aria-pressed={picked === chord.symbol}
                  onClick={() => play(chord.symbol)}
                  className={cn(
                    'card flex w-full flex-col items-center gap-2 p-3 transition-colors duration-200 ease-out hover:bg-muted',
                    isNow && 'border-foreground',
                  )}
                >
                  {diagram ? <ChordDiagram chord={diagram} /> : null}
                  <span className="flex items-baseline gap-1.5">
                    <span
                      className={cn(
                        'font-display text-2xl leading-none font-semibold',
                        isNow ? 'text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {printedSymbol(chord.symbol)}
                    </span>
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {t('player:summary.times', { count: chord.count })}
                    </span>
                  </span>
                </button>
                {picked === chord.symbol ? (
                  <ul
                    aria-label={t('player:summary.places', { chord: printedSymbol(chord.symbol) })}
                    className="flex flex-wrap gap-1"
                  >
                    {inOrder.flatMap((card) =>
                      card.symbol === chord.symbol
                        ? [
                            <li key={card.chord}>
                              <button
                                type="button"
                                onClick={() => onGo(card.chord)}
                                className="min-h-9 rounded-pill bg-muted px-2.5 text-sm hover:bg-accent"
                              >
                                {t('player:summary.bar', { bar: card.bar })}
                              </button>
                            </li>,
                          ]
                        : [],
                    )}
                  </ul>
                ) : null}
              </li>
            )
          })}
        </ul>
      ) : (
        <ol aria-label={t('player:summary.inOrder')} className={GRID}>
          {inOrder.map((card, index) => {
            const diagram = diagrams.get(card.symbol)
            const isNow = index === current
            return (
              <li key={card.chord}>
                <button
                  type="button"
                  aria-label={`${printedSymbol(card.symbol)}, ${t('player:summary.bar', { bar: card.bar })}`}
                  aria-current={isNow ? 'true' : undefined}
                  onClick={() => onGo(card.chord)}
                  className={cn(
                    'card flex w-full flex-col items-center gap-2 p-3 transition-colors duration-200 ease-out hover:bg-muted',
                    isNow && 'border-foreground',
                  )}
                >
                  <span className="self-start text-xs text-muted-foreground tabular-nums">
                    {t('player:summary.bar', { bar: card.bar })}
                  </span>
                  {diagram ? <ChordDiagram chord={diagram} /> : null}
                  <span
                    className={cn(
                      'font-display text-2xl leading-none font-semibold',
                      isNow ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {printedSymbol(card.symbol)}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
