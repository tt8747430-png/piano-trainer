import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Tick, TimeSignature } from '@/shared/lib/music'
import type { Score, StaffId } from '@/shared/lib/notation'
import { engraveInSteps, type ScoreLayout } from './engrave'
import { loadMusicFonts } from './music-font'
import { drawnStaves } from './drawn-staves'
import { staffHeight } from './size'
import './score.css'

type Engraving =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly layout: ScoreLayout }
  | { readonly status: 'error' }

/**
 * A score engraved on one line of its staves (spec §2.5; the grand staff, the tune's over it), or on
 * some or one of them, once the music font is in. What lies over it (labels, a cursor, the loop) is its children, given the engraving's
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
  /** The sheet's width in CSS pixels: the line is spread to it, and drawn smaller where wider. */
  fill?: number | undefined
  /** The notes chosen on a staff, those starting in [from, to), marked in the focus colour as a notation app marks a selection. */
  selected?: { readonly staff: StaffId; readonly from: Tick; readonly to: Tick } | undefined
  children?: (layout: ScoreLayout) => ReactNode
}) {
  const { t } = useTranslation('music')
  const host = useRef<HTMLDivElement>(null)
  const [engraving, setEngraving] = useState<Engraving>({ status: 'loading' })
  // As numbers, so a new object of the same time engraves nothing again.
  const beforeCount = timeBefore?.count
  const beforeUnit = timeBefore?.unit
  const drawn = drawnStaves(score, staff, staves)
  // As one string, so a new list of the same staves engraves nothing again.
  const shownKey = drawn.join(' ')

  // VexFlow draws into the DOM, outside React, a few measures at a time; the font must be in before
  // it measures anything. What was drawn stays until the new drawing is whole.
  useEffect(() => {
    const element = host.current
    if (!element) return
    const stopped = new AbortController()
    loadMusicFonts()
      .then(() =>
        engraveInSteps(
          score,
          element,
          {
            scale,
            fingers,
            names,
            staff,
            staves: shownKey.split(' ') as StaffId[],
            timeBefore:
              beforeCount === undefined || beforeUnit === undefined
                ? undefined
                : { count: beforeCount, unit: beforeUnit },
            fill,
          },
          { signal: stopped.signal },
        ),
      )
      .then((layout) => {
        if (layout && !stopped.signal.aborted) setEngraving({ status: 'ready', layout })
      })
      .catch(() => {
        if (!stopped.signal.aborted) setEngraving({ status: 'error' })
      })
    return () => stopped.abort()
  }, [score, scale, fingers, names, staff, shownKey, beforeCount, beforeUnit, fill])

  // The chosen notes are marked on the engraving as it is, so moving the caret engraves nothing again.
  const selectedStaff = selected?.staff
  const selectedFrom = selected?.from
  const selectedTo = selected?.to
  useEffect(() => {
    const element = host.current
    if (
      !element ||
      engraving.status !== 'ready' ||
      selectedStaff === undefined ||
      selectedFrom === undefined ||
      selectedTo === undefined
    )
      return
    const marked = [
      ...element.querySelectorAll<SVGElement>(`[data-staff="${selectedStaff}"][data-tick]`),
    ].filter((each) => {
      const tick = Number(each.dataset.tick)
      return tick >= selectedFrom && tick < selectedTo
    })
    for (const each of marked) each.classList.add('vf-selected')
    return () => {
      for (const each of marked) each.classList.remove('vf-selected')
    }
  }, [engraving, selectedStaff, selectedFrom, selectedTo])

  const size =
    engraving.status === 'ready'
      ? { width: engraving.layout.width, height: engraving.layout.height }
      : { height: staffHeight(undefined, drawn.length) * scale }
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
      {engraving.status === 'loading' ? <p className="sr-only">{t('sheet.loading')}</p> : null}
      {engraving.status === 'error' ? (
        <p className="absolute inset-0 flex items-center text-muted-foreground">
          {t('sheet.error')}
        </p>
      ) : null}
      {engraving.status === 'ready' && children ? children(engraving.layout) : null}
    </div>
  )
}
