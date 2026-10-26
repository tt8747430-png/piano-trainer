import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import type { LyricLine, SungWords } from '../model/lyric-lines'

/** A place where a verse sings nothing: a no-break space, so the verses under it stay level. */
const EMPTY_PLACE = String.fromCharCode(0xa0)

/** A verse's words in a segment: a word the next segment carries on drawn on by a hyphen. */
function Words({ words }: { words: SungWords | undefined }) {
  return (
    <span className="flex whitespace-pre">
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
 * A line of Chords over lyrics laid out (ADR 0099), on the screen and in print alike: its segments,
 * each its chord (`chord`, drawn by its screen: a chip, a printed symbol) over the words sung up to
 * the next, verse 1 and each verse more under it, muted; a line of no words its chords alone.
 */
export function LineSegments({
  line,
  chord,
  className,
}: {
  line: LyricLine
  chord: (chord: number, segment: number) => ReactNode
  className?: string
}) {
  // The verses sung in it, verse 1 first.
  const verses = (line.segments[0]?.verses ?? [])
    .map((_, verse) => verse)
    .filter((verse) => line.segments.some((segment) => segment.verses[verse]?.text))
  const shown = (at: number | null, segment: number) => (at === null ? null : chord(at, segment))
  return (
    <div
      className={cn(
        'relative flex flex-wrap',
        line.sung ? 'items-end gap-y-2' : 'gap-x-3 gap-y-3 py-1',
        className,
      )}
    >
      {line.segments.map(({ chord: at, verses: sung }, segment) =>
        line.sung ? (
          <span key={segment} className="flex flex-col">
            <span className="flex h-9 items-end pr-2 pb-1.5">{shown(at, segment)}</span>
            {verses.map((verse) => (
              <span key={verse} className={cn(verse > 0 && 'font-normal text-muted-foreground')}>
                <Words words={sung[verse]} />
              </span>
            ))}
          </span>
        ) : (
          <span key={segment}>{shown(at, segment)}</span>
        ),
      )}
    </div>
  )
}
