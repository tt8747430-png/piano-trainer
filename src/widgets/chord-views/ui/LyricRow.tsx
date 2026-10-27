import { useTranslation } from 'react-i18next'
import type { DiagramChord } from '@/features/practice'
import { cn } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import { printedSymbol, type Tick } from '@/shared/lib/music'
import { ChordDiagram } from '@/widgets/chord-diagrams'
import type { ShownLine } from '../model/repeated-lines'
import { ChordChip } from './ChordChip'
import { LineSegments } from './LineSegments'

/**
 * A line of Chords over lyrics (ADR 0108): its segments (`LineSegments`), each its chord as a
 * chip over the words sung up to the next, at its view's text size. The line playing reads in ink,
 * bold; the others are muted. A chip takes the cursor to its chord, the line anywhere else to its
 * first beat (a pointer's way only: the transport is the keys'). On the loop's band where the loop
 * holds it. A line of chords alone played again straight after itself is shown once, `×N` at its end
 * (`times`).
 */
export function LyricRow({
  line,
  index,
  performance,
  playing,
  sounding,
  looped,
  diagramOf,
  onGo,
}: {
  line: ShownLine
  /** Its place among the lines, which the view finds it by. */
  index: number
  performance: Performance
  playing: boolean
  /** Its segment whose chord sounds. */
  sounding: number | null
  looped: boolean
  /** A chord's diagram as its piece draws it: what a pointer resting on its chip shows. */
  diagramOf: (chord: number) => DiagramChord | null
  /** A tap on it: the tick it takes the cursor to, its first beat's or a chip's chord's. */
  onGo: (at: Tick) => void
}) {
  const { t } = useTranslation('player')
  const first = line.bars[0] ?? 0
  const last = line.bars.at(-1) ?? first
  return (
    <div
      data-line={index}
      data-looped={looped ? '' : undefined}
      className={cn(
        'relative -mx-2 rounded-lg px-2 py-1 transition-colors duration-200 ease-out',
        looped && 'bg-ring/15',
        playing ? 'font-semibold text-foreground' : 'text-muted-foreground',
      )}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label={
          first === last
            ? t('line.one', { n: first + 1 })
            : t('line.many', { first: first + 1, last: last + 1 })
        }
        aria-current={playing ? 'step' : undefined}
        onClick={() => onGo(line.from)}
        className="absolute inset-0 cursor-pointer rounded-lg"
      />
      <LineSegments
        line={line}
        className="pointer-events-none"
        chord={(chord, segment) => (
          <ChordChip
            symbol={performance.chords[chord]?.symbol ?? ''}
            sounding={segment === sounding}
            diagram={() => {
              const drawn = diagramOf(chord)
              return drawn ? (
                <>
                  <ChordDiagram chord={drawn} className="h-14 w-auto" />
                  <span aria-hidden className="font-display text-base leading-tight font-semibold">
                    {printedSymbol(drawn.symbol)}
                  </span>
                </>
              ) : null
            }}
            onGo={() => onGo(performance.chords[chord]?.startTick ?? line.from)}
          />
        )}
        end={
          line.times > 1 ? (
            <span className="text-[0.875em] font-semibold text-muted-foreground tabular-nums">
              <span aria-hidden>{t('line.times', { n: line.times })}</span>
              <span className="sr-only">{t('line.played', { count: line.times })}</span>
            </span>
          ) : null
        }
      />
    </div>
  )
}
