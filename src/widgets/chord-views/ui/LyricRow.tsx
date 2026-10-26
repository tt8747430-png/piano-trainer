import { useTranslation } from 'react-i18next'
import type { DiagramChord } from '@/features/practice'
import { cn } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import { printedSymbol } from '@/shared/lib/music'
import { ChordDiagram } from '@/widgets/chord-diagrams'
import type { SungWords } from '../model/lyric-lines'
import type { ShownLine } from '../model/repeated-lines'
import { ChordChip } from './ChordChip'

/** A place where a verse sings nothing: a no-break space, so the verses under it stay level. */
const EMPTY_PLACE = String.fromCharCode(0xa0)

/**
 * A verse's words in a segment: a word the next segment carries on drawn on by a hyphen. Wider than
 * the line's room (a large text size on a narrow phone), they wrap in it: never cut.
 */
function Words({ words }: { words: SungWords | undefined }) {
  return (
    <span className="flex whitespace-pre-wrap">
      <span>{words?.text || EMPTY_PLACE}</span>
      {words?.goesOn ? (
        <span aria-hidden className="grow px-0.5 text-center">
          -
        </span>
      ) : (
        <span> </span>
      )}
    </span>
  )
}

/**
 * A line of Chords over lyrics (ADR 0099): its segments, each its chord as a chip over the words sung
 * up to the next, verse 1 and each verse more under it, muted; a line of no words its chords alone.
 * The line playing reads in ink, bold; the others are muted. A chip opens its chord's sheet; the
 * line anywhere else takes the cursor to its first beat (a pointer's way only: the transport is the
 * keys'). On the loop's band where the loop holds it. Every length is in `em`, so the line takes its
 * view's text size (ADR 0108), and its segments wrap whole. A line of chords alone played again
 * straight after itself is shown once, `×N` at its end (`times`).
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
  onChord,
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
  onGo: () => void
  onChord: (chord: number) => void
}) {
  const { t } = useTranslation('player')
  const first = line.bars[0] ?? 0
  const last = line.bars.at(-1) ?? first
  // The verses sung in it, verse 1 first.
  const verses = (line.segments[0]?.verses ?? [])
    .map((_, verse) => verse)
    .filter((verse) => line.segments.some((segment) => segment.verses[verse]?.text))
  const chip = (chord: number | null, segment: number) =>
    chord === null ? null : (
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
        onOpen={() => onChord(chord)}
      />
    )
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
        onClick={onGo}
        className="absolute inset-0 cursor-pointer rounded-lg"
      />
      <div
        className={cn(
          'pointer-events-none relative flex flex-wrap',
          line.sung ? 'items-end gap-y-[0.5em]' : 'items-center gap-x-[0.75em] gap-y-[0.75em] py-1',
        )}
      >
        {line.segments.map(({ chord, verses: sung }, segment) =>
          line.sung ? (
            <span key={segment} className="flex max-w-full min-w-0 flex-col">
              <span className="flex h-[2.25em] items-end pr-[0.5em] pb-[0.375em]">
                {chip(chord, segment)}
              </span>
              {verses.map((verse) => (
                <span key={verse} className={cn(verse > 0 && 'font-normal text-muted-foreground')}>
                  <Words words={sung[verse]} />
                </span>
              ))}
            </span>
          ) : (
            <span key={segment}>{chip(chord, segment)}</span>
          ),
        )}
        {line.times > 1 ? (
          <span className="text-[0.875em] font-semibold text-muted-foreground tabular-nums">
            <span aria-hidden>{t('line.times', { n: line.times })}</span>
            <span className="sr-only">{t('line.played', { count: line.times })}</span>
          </span>
        ) : null}
      </div>
    </div>
  )
}
