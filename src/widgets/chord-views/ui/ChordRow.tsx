import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePieceInversions } from '@/features/choose-diagram-inversion'
import { DIAGRAM_KEYS, diagramChord } from '@/features/practice'
import { cn, REDUCED_MOTION, useElementSize, useMediaQuery } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import { printedSymbol, type Tick } from '@/shared/lib/music'
import { KeyDiagram, LeadSymbol } from '@/shared/ui'
import { ChordDiagram } from '@/widgets/chord-diagrams'
import { chordEvents, eventAt } from '../model/chord-events'

/** How long a hand's scroll rests before the row takes the chord it stopped on. */
const SETTLE = 140
/** How long the row's own scroll to the chord sounding lasts, its scroll events not the hand's. */
const FOLLOW = 700

/**
 * The Diagrams view's row (loop round 61, the Player's Diagrams board): every change of chord in
 * played order (`chordEvents`), each a slot half the room wide, its diagram over its name; the one
 * sounding at the row's start, the rest at 38%, so the next shows beside it. The row follows the
 * music, sliding to each change; swiped, it snaps a chord at a time and the music goes to the chord
 * it rests on; a chord tapped takes the music there (`onGo`). Under reduced motion it moves without
 * sliding. Where the music has no chord, an empty diagram named N.C.
 */
export function ChordRow({
  performance,
  at,
  onGo,
}: {
  performance: Performance
  /** The tick sounding, as played. */
  at: Tick
  onGo: (at: Tick) => void
}) {
  const { t } = useTranslation('player')
  const chosen = usePieceInversions()?.chosen
  const still = useMediaQuery(REDUCED_MOTION)
  const events = useMemo(() => chordEvents(performance), [performance])
  const drawn = useMemo(
    () =>
      events.map((event) =>
        event.chord === null ? null : diagramChord(performance, event.chord, chosen),
      ),
    [events, performance, chosen],
  )
  const current = eventAt(events, at)
  const row = useRef<HTMLDivElement>(null)
  const { width } = useElementSize(row)
  const following = useRef(false)
  // A hand on the row holds it: the music's slide waits until the hand lets go and its scroll settles,
  // even when the row is measured again meanwhile; let go, the row follows the music again.
  const [held, setHeld] = useState(false)
  const placed = useRef(false)
  const settle = useRef(0)
  // The chord sounding, for a scroll that settles after the render that moved it.
  const sounding = useRef(current)
  useEffect(() => {
    sounding.current = current
  })

  useEffect(() => {
    const el = row.current
    const slot = el?.querySelector<HTMLElement>('[data-slot="chord-slot"]')?.offsetWidth ?? 0
    if (!el || slot === 0 || held) return
    following.current = true
    el.scrollTo({ left: current * slot, behavior: still || !placed.current ? 'auto' : 'smooth' })
    placed.current = true
    const done = window.setTimeout(() => {
      following.current = false
    }, FOLLOW)
    return () => window.clearTimeout(done)
  }, [current, still, width, held])

  useEffect(() => () => window.clearTimeout(settle.current), [])

  // The hand's scroll settles (or a touch that never scrolled ends): the music goes to the chord the
  // row rests on, and the row is the music's again.
  const settleIn = () => {
    window.clearTimeout(settle.current)
    settle.current = window.setTimeout(() => {
      setHeld(false)
      const el = row.current
      const slot = el?.querySelector<HTMLElement>('[data-slot="chord-slot"]')?.offsetWidth ?? 0
      if (!el || slot === 0) return
      const index = Math.round(el.scrollLeft / slot)
      const event = events[index]
      if (event && index !== sounding.current) onGo(event.at)
    }, SETTLE)
  }
  const onScroll = () => {
    if (!following.current) settleIn()
  }
  // A hand on the row takes it from the music's slide.
  const takeOver = () => {
    following.current = false
    setHeld(true)
    settleIn()
  }

  return (
    <div
      ref={row}
      data-area="chords"
      role="group"
      aria-label={t('diagramsRow')}
      onScroll={onScroll}
      onPointerDown={takeOver}
      onWheel={takeOver}
      onTouchStart={takeOver}
      className="-mx-gutter flex snap-x snap-mandatory scroll-px-gutter overflow-x-auto overflow-y-hidden overscroll-x-contain px-gutter scrollbar-none landscape-phone:mx-0 landscape-phone:scroll-px-0 landscape-phone:px-0"
    >
      {events.map((event, index) => {
        const chord = drawn[index] ?? null
        const now = index === current
        return (
          <button
            key={`${event.at}-${event.chord ?? 'none'}`}
            type="button"
            data-slot="chord-slot"
            aria-current={now || undefined}
            onClick={() => onGo(event.at)}
            className={cn(
              'flex shrink-0 basis-1/2 snap-start snap-always flex-col items-center gap-2 rounded-control py-1 transition-opacity duration-300 ease-out motion-reduce:transition-none lg:gap-3',
              now ? 'opacity-100' : 'opacity-[0.38]',
            )}
          >
            <span className="block w-[min(9.625rem,calc(100%-2*var(--gutter)))] lg:w-[min(19rem,calc(100%-2*var(--gutter)))]">
              {chord ? (
                <ChordDiagram chord={chord} />
              ) : (
                <KeyDiagram keys={[]} range={DIAGRAM_KEYS} label={t('noChordShort')} />
              )}
            </span>
            <span
              aria-hidden
              className="text-lg leading-none font-medium whitespace-nowrap lg:text-2xl"
            >
              {chord ? <LeadSymbol text={printedSymbol(chord.symbol)} /> : t('noChordShort')}
            </span>
          </button>
        )
      })}
      <div aria-hidden className="shrink-0 basis-[calc(50%+var(--gutter))]" />
    </div>
  )
}
