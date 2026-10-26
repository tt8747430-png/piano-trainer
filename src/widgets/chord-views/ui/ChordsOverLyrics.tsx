import { Fragment, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { TextSize } from '@/entities/settings'
import { usePieceInversions } from '@/features/choose-diagram-inversion'
import {
  chordSummary,
  diagramChord,
  writtenBarOf,
  type BarRange,
  type CellBar,
  type PlayedBeat,
} from '@/features/practice'
import { useScrollMotion } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import { SheetTitle } from '@/shared/ui'
import { ChordSummary } from '@/widgets/chord-diagrams'
import { loopedBars } from '../model/beat-span'
import { footRoom, inSight, lineScroll } from '../model/in-sight'
import { lyricLines, soundingChip, type Span } from '../model/lyric-lines'
import { foldRepeats } from '../model/repeated-lines'
import { BeatStrip } from './BeatStrip'
import { LyricRow } from './LyricRow'

/**
 * Chords over lyrics (ADR 0099, 0108, Chordify's): under the title the beat strip across the view,
 * held at the top as the song scrolls under it with, where pinned (`pinned`), the song's chords as
 * diagrams in a row under it, the one sounding outlined; then in one column in its middle the song by
 * section, each under its name in spaced capitals, each line its chords as chips over its words
 * (`LyricRow`), at the text size chosen (`textSize`), a line of chords alone played again straight
 * after itself once with ×N (`foldRepeats`). The line playing is kept in sight, in the top third of
 * the room between the strip and the transport (`lineScroll`); the chip of the chord sounding is
 * filled. A chip, a line or a beat tapped takes the cursor there (`onGo`, the tick it is first
 * played at), a pinned diagram to its chord (`onSymbol`, ADR 0108): the line scrolls to it.
 */
export function ChordsOverLyrics({
  title,
  performance,
  headings,
  bars,
  beat,
  written,
  loop,
  pinned,
  textSize,
  clock,
  onGo,
  onSymbol,
}: {
  title: string
  performance: Performance
  headings: readonly string[]
  /** Every bar as played, in beats. */
  bars: readonly CellBar[]
  beat: PlayedBeat
  /** The beat sounding, as its bar is written (its first pass). */
  written: Span
  loop: BarRange | null
  /** The song's chord diagrams pinned under the strip. */
  pinned: boolean
  /** The words and their chords, as a percent of their own size. */
  textSize: TextSize
  /** Listen's clock while it plays: the strip's. */
  clock: (() => Tick | null) | null
  onGo: (at: Tick) => void
  /** A pinned diagram tapped, by its symbol: the cursor taken to it. */
  onSymbol: (symbol: string) => void
}) {
  const { t } = useTranslation('player')
  const lines = useMemo(() => foldRepeats(performance, lyricLines(performance)), [performance])
  // A line of neither words nor chords (an own song's bars of no chord symbol and nothing sung)
  // shows nothing, so it is left out, and a section's name heads its first line that shows.
  const shown = useMemo(
    () => lines.map((line) => line.sung || line.segments.some(({ chord }) => chord !== null)),
    [lines],
  )
  const chosen = usePieceInversions()?.chosen
  const summary = useMemo(() => chordSummary(performance, chosen), [performance, chosen])
  const bar = writtenBarOf(performance, beat.bar)
  const playing = lines.findIndex((line) => line.bars.includes(bar))
  const chip = soundingChip(lines, written)
  const soundingChord = chip ? lines[chip.line]?.segments[chip.segment]?.chord : null
  const sounding =
    soundingChord === null || soundingChord === undefined
      ? null
      : (performance.chords[soundingChord]?.symbol ?? null)
  const diagramOf = (chord: number) => diagramChord(performance, chord, chosen)
  const looped = loopedBars(performance, loop)
  const scroller = useRef<HTMLElement>(null)
  const strip = useRef<HTMLDivElement>(null)
  // The line last kept in sight; none before the view opens.
  const kept = useRef<number | null>(null)
  const motion = useScrollMotion()
  // The line playing brought into the top third of the room between the strip and the transport as
  // the music reaches it, where it is not there already. Opening, the view stays at its top, its
  // title in sight, where that line is in sight there (a loop's further on is brought to).
  useEffect(() => {
    const box = scroller.current
    const line = box?.querySelector(`[data-line="${playing}"]`)
    if (!box || !line || kept.current === playing) return
    const opening = kept.current === null
    kept.current = playing
    if (opening && inSight(line, box)) return
    const held = strip.current?.offsetHeight ?? 0
    const { top, height } = line.getBoundingClientRect()
    const by = lineScroll({
      top: top - box.getBoundingClientRect().top,
      height,
      held,
      room: box.clientHeight - held - footRoom(box),
    })
    if (by !== null) box.scrollTo({ top: Math.max(0, box.scrollTop + by), behavior: motion })
  }, [playing, motion])
  return (
    <section
      ref={scroller}
      aria-label={t('views.lyrics')}
      className="-mx-gutter flex h-full scroll-pb-(--float-room) flex-col gap-4 overflow-y-auto overscroll-contain px-gutter text-base *:shrink-0 sm:text-lg landscape-phone:mx-0 landscape-phone:px-0"
    >
      <SheetTitle title={title} place="lines" />
      <div
        ref={strip}
        className="sticky top-0 z-20 -mx-gutter bg-background py-2 landscape-phone:mx-0"
      >
        <BeatStrip
          performance={performance}
          bars={bars}
          beat={beat}
          loop={loop}
          clock={clock}
          onBeat={onGo}
        />
        {pinned ? (
          <div className="mx-auto mt-1 w-full max-w-2xl px-gutter landscape-phone:px-0">
            <ChordSummary chords={summary} sounding={sounding} onChord={onSymbol} />
          </div>
        ) : null}
      </div>
      {/* The song in one column, in the middle of a wide screen as the Grid's chart is, at a reading
          width; the strip above runs across the view. The width is in rem: a width in the font's own
          `ch` had Chrome restyle the whole screen at every beat played. Its text at the size chosen,
          every length in its lines in `em`. */}
      <div
        className="mx-auto flex w-full max-w-2xl flex-col gap-[0.75em]"
        style={{ fontSize: `${textSize}%` }}
      >
        {lines.map((line, index) => {
          if (!shown[index]) return null
          const heading = headings[line.section]
          const before = lines.findLast((_, at) => at < index && shown[at])
          const starts = before?.section !== line.section
          return (
            <Fragment key={index}>
              {starts && heading ? (
                <h2 className="pt-[0.75em] text-[0.875em] tracking-[0.3em] text-muted-foreground uppercase">
                  {heading}
                </h2>
              ) : null}
              <LyricRow
                line={line}
                index={index}
                performance={performance}
                playing={index === playing}
                sounding={chip?.line === index ? chip.segment : null}
                looped={line.bars.some((each) => looped.has(each))}
                diagramOf={diagramOf}
                onGo={onGo}
              />
            </Fragment>
          )
        })}
      </div>
      {/* Room to scroll the last line clear of the transport floating over the foot. */}
      <div aria-hidden className="h-(--float-room) shrink-0" />
    </section>
  )
}
