import { Fragment, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  chordSummary,
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
import { BeatStrip } from './BeatStrip'
import { LyricRow } from './LyricRow'

/**
 * Chords over lyrics (ADR 0099, Chordify's): under the title the beat strip across the view, held at
 * the top as the song scrolls under it, then in one column in its middle the song's chords as
 * diagrams and the song by section, each under its name in spaced capitals, each line its chords as
 * chips over its words (`LyricRow`). The line playing is kept in sight, in the top third of the room
 * between the strip and the transport (`lineScroll`); the chip of the chord sounding is filled. A chip, or a summary's diagram, opens the chord's sheet (`onChord`); a line or a beat
 * tapped takes the cursor there (`onGo`, the tick it is first played at).
 */
export function ChordsOverLyrics({
  title,
  performance,
  headings,
  bars,
  beat,
  written,
  loop,
  onGo,
  onChord,
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
  onGo: (at: Tick) => void
  onChord: (chord: number) => void
}) {
  const { t } = useTranslation('player')
  const lines = useMemo(() => lyricLines(performance), [performance])
  const summary = useMemo(() => chordSummary(performance), [performance])
  const bar = writtenBarOf(performance, beat.bar)
  const playing = lines.findIndex((line) => line.bars.includes(bar))
  const chip = soundingChip(lines, written)
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
        <BeatStrip performance={performance} bars={bars} beat={beat} loop={loop} onBeat={onGo} />
      </div>
      {/* The chords and the song in one column, in the middle of a wide screen as the Grid's chart
          is, at a reading width; the strip above runs across the view. The width is in rem: a width
          in the font's own `ch` had Chrome restyle the whole screen at every beat played. */}
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <ChordSummary chords={summary} />
        <div className="flex flex-col gap-3">
          {lines.map((line, index) => {
            const heading = headings[line.section]
            const starts = index === 0 || lines[index - 1]?.section !== line.section
            return (
              <Fragment key={index}>
                {starts && heading ? (
                  <h2 className="pt-3 text-sm tracking-[0.3em] text-muted-foreground uppercase">
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
                  onGo={() => onGo(line.from)}
                  onChord={onChord}
                />
              </Fragment>
            )
          })}
        </div>
      </div>
      {/* Room to scroll the last line clear of the transport floating over the foot. */}
      <div aria-hidden className="h-(--float-room) shrink-0" />
    </section>
  )
}
