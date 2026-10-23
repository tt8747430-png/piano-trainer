import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Tick, TimeSignature } from '@/shared/lib/music'
import type { NextLine, Score, StaffId } from '@/shared/lib/notation'
import { drawnStaves } from './drawn-staves'
import type { ScoreLayout } from './layout'
import { staffHeight } from './size'
import { StaffPlace } from './StaffPlace'
import { drawScore } from './verovio/draw'
import './score.css'

type Engraving =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly layout: ScoreLayout }
  | { readonly status: 'error' }

/**
 * A score engraved by Verovio (ADR 0078) on one line of its staves (spec §2.5; the grand staff, the
 * tune's over it), or on some or one of them. What lies over it (labels, a cursor, the loop) is its children, given the engraving's
 * layout. The staff of `muted` is soft ink.
 */
export function ScoreView({
  score,
  scale,
  fingers,
  names = false,
  muted,
  staff,
  staves,
  timeBefore,
  next,
  selected,
  fill,
  children,
}: {
  score: Score
  scale: number
  fingers: boolean
  /** Each notehead carries its note's name (the Player's Named notes). */
  names?: boolean
  muted?: StaffId | undefined
  /** Only this staff of the grand staff: a line in one hand, an interval, a note to read. */
  staff?: StaffId | undefined
  /** The staves drawn, of those the score writes (the others hidden): all of them by default. */
  staves?: readonly StaffId[] | undefined
  /** The time signature before this line of music: printed again only where it changes. */
  timeBefore?: TimeSignature | undefined
  /**
   * What the next line starts in: a key, time or clef it changes to printed after this line's last
   * barline, as a courtesy (a justified line's).
   */
  next?: NextLine | undefined
  /** The sheet's width in CSS pixels: the line is spread to it, and drawn smaller where wider. */
  fill?: number | undefined
  /**
   * The notes chosen, those starting in [from, to) on a staff (on every staff without one), marked in
   * the focus colour as a notation app marks a selection (ADR 0082).
   */
  selected?: { readonly staff?: StaffId; readonly from: Tick; readonly to: Tick } | undefined
  children?: (layout: ScoreLayout) => ReactNode
}) {
  const { t } = useTranslation('music')
  const host = useRef<HTMLDivElement>(null)
  const [engraving, setEngraving] = useState<Engraving>({ status: 'loading' })
  // As numbers, so a new object of the same time engraves nothing again.
  const beforeCount = timeBefore?.count
  const beforeUnit = timeBefore?.unit
  // As one string, so a new object of the same signature engraves nothing again.
  const nextKey = next
    ? JSON.stringify({ key: next.key, time: next.time, clefs: next.clefs } satisfies NextLine)
    : ''
  const drawn = drawnStaves(score, staff, staves)
  // As one string, so a new list of the same staves engraves nothing again.
  const shownKey = drawn.join(' ')

  // Verovio draws off the page's thread; what was drawn stays until the new drawing is whole.
  useEffect(() => {
    const element = host.current
    if (!element) return
    const stopped = new AbortController()
    drawScore(
      score,
      element,
      {
        scale,
        fingers,
        names,
        staves: shownKey.split(' ') as StaffId[],
        timeBefore:
          beforeCount === undefined || beforeUnit === undefined
            ? undefined
            : { count: beforeCount, unit: beforeUnit },
        next: nextKey ? (JSON.parse(nextKey) as NextLine) : undefined,
        fill,
      },
      stopped.signal,
    )
      .then((layout) => {
        if (layout && !stopped.signal.aborted) setEngraving({ status: 'ready', layout })
      })
      .catch(() => {
        if (!stopped.signal.aborted) setEngraving({ status: 'error' })
      })
    return () => stopped.abort()
  }, [score, scale, fingers, names, shownKey, beforeCount, beforeUnit, nextKey, fill])

  // The chosen notes are marked on the engraving as it is, so moving the caret engraves nothing again.
  const selectedStaff = selected?.staff
  const selectedFrom = selected?.from
  const selectedTo = selected?.to
  useEffect(() => {
    const element = host.current
    if (
      !element ||
      engraving.status !== 'ready' ||
      selectedFrom === undefined ||
      selectedTo === undefined
    )
      return
    // Notes are named `n-<staff>-<tick>-<i>` (ADR 0078).
    const marked = [
      ...element.querySelectorAll<SVGElement>(
        `g.note[id^="n-${selectedStaff === undefined ? '' : `${selectedStaff}-`}"]`,
      ),
    ].filter((each) => {
      const tick = Number(each.id.split('-')[2])
      return tick >= selectedFrom && tick < selectedTo
    })
    for (const each of marked) each.classList.add('note-chosen')
    return () => {
      for (const each of marked) each.classList.remove('note-chosen')
    }
  }, [engraving, selectedStaff, selectedFrom, selectedTo])

  const size =
    engraving.status === 'ready'
      ? { width: engraving.layout.width, height: engraving.layout.height }
      : { height: staffHeight(undefined, drawn.length) * scale, width: fill }
  return (
    // Its layers are its own: what lies over the engraving stays under what the page pins.
    <div className="relative isolate" style={size}>
      <div
        ref={host}
        data-slot="score"
        data-muted={muted}
        aria-hidden
        className="pointer-events-none relative z-10"
      />
      {engraving.status === 'loading' ? (
        // Its lines, faint, until the first engraving is in: the music on its way, not a gap.
        <div className="absolute inset-x-0 top-0">
          <StaffPlace
            height={staffHeight(undefined, drawn.length)}
            scale={scale}
            count={drawn.length}
          />
          <p className="sr-only">{t('sheet.loading')}</p>
        </div>
      ) : null}
      {engraving.status === 'error' ? (
        <p className="absolute inset-0 flex items-center text-muted-foreground">
          {t('sheet.error')}
        </p>
      ) : null}
      {engraving.status === 'ready' && children ? children(engraving.layout) : null}
    </div>
  )
}
