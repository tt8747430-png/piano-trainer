import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  beatCells,
  diagramChord,
  loopTicks,
  writtenBarOf,
  type BarRange,
  type CellBar,
  type DiagramChord,
  type PlayedBeat,
} from '@/features/practice'
import { cn, useMediaQuery } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import { printedSymbol, type Tick } from '@/shared/lib/music'
import { SheetTitle } from '@/shared/ui'
import { ChordDiagram } from '@/widgets/chord-diagrams'
import { chordsFrom } from '../model/chords-from'
import { lineProgress, lineWords, lyricLines, type Span } from '../model/lyric-lines'
import { BeatStrip } from './BeatStrip'

/** From a tablet's width, the two chords after the next too. */
const WIDE = '(min-width: 40rem)'

/** How each place of the row draws its chord: the one sounding, the next, the two after it. */
const PLACES = {
  now: {
    box: 'basis-1/2 max-w-md landscape-phone:max-w-56',
    symbol: 'text-4xl landscape-phone:text-2xl',
  },
  next: {
    box: 'basis-1/3 max-w-xs landscape-phone:max-w-36',
    symbol: 'text-2xl text-muted-foreground landscape-phone:text-xl',
  },
  later: { box: 'basis-1/6 max-w-48 opacity-70', symbol: 'text-xl text-muted-foreground' },
} as const

/** A chord of the row: its keys over its symbol, a button opening its sheet. */
function Diagram({
  chord,
  place,
  muted,
  label,
  onOpen,
}: {
  chord: DiagramChord
  place: keyof typeof PLACES
  muted: boolean
  /** What its symbol says: the symbol, or that it comes next. */
  label: string
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        'flex min-w-0 shrink flex-col items-center gap-2 rounded-xl p-1.5 transition-colors duration-200 ease-out hover:bg-muted',
        PLACES[place].box,
      )}
    >
      <ChordDiagram chord={chord} muted={muted} />
      <span
        aria-hidden
        className={cn('font-display leading-none font-semibold', PLACES[place].symbol)}
      >
        {label}
      </span>
    </button>
  )
}

/**
 * Diagrams (ADR 0099, Chordify's): the chord sounding as a large keyboard diagram over its symbol, the
 * next beside it greyed (from a tablet's width the two after it too, smaller and greyer); where no
 * chord sounds yet (a pickup, a bar of none) the next alone, greyed, saying it is next. Under them the
 * beat strip; under it, with the View's Lyrics on, the line being sung, bold, a bar filling under it
 * as the line goes, and the next line sung, muted. A diagram opens its chord's sheet (`onChord`); a
 * beat tapped takes the cursor there (`onGo`).
 */
export function ChordDiagrams({
  title,
  performance,
  bars,
  beat,
  played,
  loop,
  words,
  onGo,
  onChord,
}: {
  title: string
  performance: Performance
  /** Every bar as played, in beats. */
  bars: readonly CellBar[]
  beat: PlayedBeat
  /** The beat sounding, as played. */
  played: Span
  loop: BarRange | null
  /** The View's Lyrics: the line sung under the strip. */
  words: boolean
  onGo: (at: Tick) => void
  onChord: (chord: number) => void
}) {
  const { t } = useTranslation('player')
  const wide = useMediaQuery(WIDE)
  const { now, next } = chordsFrom(
    performance,
    played,
    loop ? loopTicks(performance, loop) : null,
    wide ? 3 : 1,
  )
  const lines = useMemo(() => lyricLines(performance), [performance])
  const written = useMemo(() => beatCells(performance), [performance])
  const bar = writtenBarOf(performance, beat.bar)
  const at = lines.findIndex((line) => line.bars.includes(bar))
  const line = lines[at]
  const sung = line?.sung ? line : undefined
  const coming = lines.slice(at + 1).find((each) => each.sung)
  const chord = (index: number | undefined) =>
    index === undefined ? null : diagramChord(performance, index)
  const first = chord(now ?? undefined)
  const [after, ...later] = next.map(chord)
  return (
    <section
      aria-label={t('views.diagrams')}
      className="flex h-full flex-col gap-4 overflow-y-auto overscroll-contain landscape-phone:gap-2"
    >
      <SheetTitle title={title} place="lines" />
      <div className="flex min-h-24 items-end justify-center gap-3 sm:gap-6">
        {first ? (
          <>
            <Diagram
              chord={first}
              place="now"
              muted={false}
              label={printedSymbol(first.symbol)}
              onOpen={() => onChord(first.chord)}
            />
            {after ? (
              <Diagram
                chord={after}
                place="next"
                muted
                label={printedSymbol(after.symbol)}
                onOpen={() => onChord(after.chord)}
              />
            ) : null}
            {later.flatMap((each) =>
              each ? (
                <Diagram
                  key={each.chord}
                  chord={each}
                  place="later"
                  muted
                  label={printedSymbol(each.symbol)}
                  onOpen={() => onChord(each.chord)}
                />
              ) : (
                []
              ),
            )}
          </>
        ) : after ? (
          // No chord yet: the next alone, greyed, saying so.
          <Diagram
            chord={after}
            place="now"
            muted
            label={t('nextChord', { symbol: printedSymbol(after.symbol) })}
            onOpen={() => onChord(after.chord)}
          />
        ) : null}
      </div>
      <BeatStrip
        className="-mx-gutter py-1 landscape-phone:mx-0"
        performance={performance}
        bars={bars}
        beat={beat}
        loop={loop}
        onBeat={onGo}
      />
      {words && (sung || coming) ? (
        <div className="flex flex-col gap-2 text-lg sm:text-xl">
          {sung ? (
            <>
              <p className="font-semibold text-foreground">{lineWords(sung)}</p>
              <div aria-hidden className="h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full origin-left rounded-full bg-foreground transition-transform duration-200 ease-out motion-reduce:transition-none"
                  style={{
                    transform: `scaleX(${lineProgress(sung, written, { written: bar, beat: beat.beat })})`,
                  }}
                />
              </div>
            </>
          ) : null}
          {coming ? <p className="text-muted-foreground">{lineWords(coming)}</p> : null}
        </div>
      ) : null}
      <div aria-hidden className="h-(--float-room) shrink-0" />
    </section>
  )
}
