import { Fragment, useMemo } from 'react'
import type { Performance } from '@/shared/lib/arrangement'
import { printedSymbol } from '@/shared/lib/music'
import { lyricLines, shownLines } from '../model/lyric-lines'
import { LineSegments } from './LineSegments'

/**
 * Chords over lyrics as it prints (ADR 0107): the song by section, each under its name in spaced
 * capitals, each line its chords printed over its words, every verse; in ink, with nothing a screen
 * adds (the strip, the line playing, chips to tap). A line is never split over two pages.
 */
export function PrintedLyrics({
  performance,
  headings,
}: {
  performance: Performance
  /** Each section's name, by section; none for music of one section. */
  headings: readonly string[]
}) {
  const shown = useMemo(() => shownLines(lyricLines(performance)), [performance])
  return (
    <div className="flex flex-col gap-3 text-lg">
      {shown.map(({ line, index, starts }) => {
        const heading = headings[line.section]
        return (
          <Fragment key={index}>
            {starts && heading ? (
              <h2 className="pt-3 text-sm tracking-[0.3em] text-muted-foreground uppercase break-after-avoid">
                {heading}
              </h2>
            ) : null}
            <LineSegments
              line={line}
              className="break-inside-avoid"
              chord={(chord) => (
                <span className="font-display leading-tight font-semibold whitespace-nowrap">
                  {printedSymbol(performance.chords[chord]?.symbol ?? '')}
                </span>
              )}
            />
          </Fragment>
        )
      })}
    </div>
  )
}
