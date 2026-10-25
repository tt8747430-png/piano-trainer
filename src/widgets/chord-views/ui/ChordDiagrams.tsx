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
import { cn, LANDSCAPE_PHONE, useMediaQuery } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import { printedSymbol, type Tick } from '@/shared/lib/music'
import { SheetTitle } from '@/shared/ui'
import { ChordDiagram } from '@/widgets/chord-diagrams'
import { chordsFrom } from '../model/chords-from'
import { lyricLines, type Span } from '../model/lyric-lines'
import { BeatStrip } from './BeatStrip'
import { SungLines } from './SungLines'

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

/**
 * A chord of the row: its keys over its symbol, a button opening its sheet. In a room too short for
 * them as drawn, its keys shrink to it, its symbol kept whole.
 */
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
        'flex max-h-full min-w-0 shrink flex-col items-center gap-2 rounded-xl p-1.5 transition-colors duration-200 ease-out hover:bg-muted',
        PLACES[place].box,
      )}
    >
      <ChordDiagram chord={chord} muted={muted} className="min-h-0" />
      <span
        aria-hidden
        className={cn('shrink-0 font-display leading-none font-semibold', PLACES[place].symbol)}
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
 * beat strip; under it, with the View's Lyrics on, the line being sung and the next (`SungLines`);
 * on a phone on its side, the title, the strip and the words beside the chords. All of it stands in
 * the room above the transport, in the middle of it, the chords shrinking where it is short
 * (`diagrams-view`). A diagram opens its chord's sheet (`onChord`); a beat tapped takes the cursor
 * there (`onGo`).
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
  // On a phone on its side the room is short: the chord sounding and the next alone.
  const tablet = useMediaQuery(WIDE)
  const onSide = useMediaQuery(LANDSCAPE_PHONE)
  const wide = tablet && !onSide
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
  const chord = (index: number | undefined) =>
    index === undefined ? null : diagramChord(performance, index)
  const first = chord(now ?? undefined)
  const [after, ...later] = next.map(chord)
  return (
    <section
      aria-label={t('views.diagrams')}
      className="diagrams-view h-full overflow-y-auto overscroll-contain pb-(--float-room)"
    >
      <div data-area="title">
        <SheetTitle title={title} place="lines" />
      </div>
      <div
        data-area="chords"
        className="flex items-end justify-center gap-3 sm:gap-6 landscape-phone:items-center"
      >
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
      <div data-area="strip" className="-mx-gutter landscape-phone:mx-0">
        <BeatStrip performance={performance} bars={bars} beat={beat} loop={loop} onBeat={onGo} />
      </div>
      {words ? (
        <SungLines
          sung={line?.sung ? line : undefined}
          coming={lines.slice(at + 1).find((each) => each.sung)}
          bars={written}
          at={{ written: bar, beat: beat.beat }}
        />
      ) : null}
    </section>
  )
}
