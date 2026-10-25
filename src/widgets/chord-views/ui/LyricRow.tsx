import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import type { LyricLine, SungWords } from '../model/lyric-lines'
import { ChordChip } from './ChordChip'

/** A verse's words in a segment: a word the next segment carries on drawn on by a hyphen. */
function Words({ words }: { words: SungWords | undefined }) {
  return (
    <span className="flex whitespace-pre">
      {/* An empty place keeps its line, so the verses under it stay level. */}
      <span>{words?.text || ' '}</span>
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
 * keys'). On the loop's band where the loop holds it.
 */
export function LyricRow({
  line,
  index,
  performance,
  playing,
  sounding,
  looped,
  onGo,
  onChord,
}: {
  line: LyricLine
  /** Its place among the lines, which the view finds it by. */
  index: number
  performance: Performance
  playing: boolean
  /** Its segment whose chord sounds. */
  sounding: number | null
  looped: boolean
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
          line.sung ? 'items-end gap-y-2' : 'gap-x-1.5 gap-y-2.5 py-1',
        )}
      >
        {line.segments.map(({ chord, verses: sung }, segment) =>
          line.sung ? (
            <span key={segment} className="flex flex-col">
              <span className="flex h-9 items-end pr-1.5 pb-1.5">{chip(chord, segment)}</span>
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
      </div>
    </div>
  )
}
