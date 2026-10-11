import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Tick, TimeSignature } from '@/shared/lib/music'
import type { Score, StaffId } from '@/shared/lib/notation'
import { engraveInSteps, type ScoreLayout } from './engrave'
import { loadMusicFonts } from './music-font'
import { staffHeight } from './size'
import './score.css'

type Engraving =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly layout: ScoreLayout }
  | { readonly status: 'error' }

/**
 * A score engraved on one line of grand staff (spec §2.5), or on one of its staves, once the music
 * font is in. What lies over it (labels, a cursor, the loop) is its children, given the engraving's
 * layout. The staff of `muted` is soft ink.
 */
export function ScoreView({
  score,
  scale,
  fingers,
  names = false,
  muted,
  staff,
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
  /** The time signature before this line of music: printed again only where it changes. */
  timeBefore?: TimeSignature | undefined
  /** A width in CSS pixels the line is spread to where it is a fair share of it (the editor's lines). */
  fill?: number | undefined
  /** The notes chosen, marked in the focus colour as a notation app marks a selection. */
  selected?: { readonly staff: StaffId; readonly tick: Tick } | undefined
  children?: (layout: ScoreLayout) => ReactNode
}) {
  const { t } = useTranslation('music')
  const host = useRef<HTMLDivElement>(null)
  const [engraving, setEngraving] = useState<Engraving>({ status: 'loading' })
  // As numbers, so a new object of the same time engraves nothing again.
  const beforeCount = timeBefore?.count
  const beforeUnit = timeBefore?.unit

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
  }, [score, scale, fingers, names, staff, beforeCount, beforeUnit, fill])

  // The chosen notes are marked on the engraving as it is, so moving the caret engraves nothing again.
  const selectedStaff = selected?.staff
  const selectedTick = selected?.tick
  useEffect(() => {
    const element = host.current
    if (!element || engraving.status !== 'ready' || selectedStaff === undefined) return
    const marked = element.querySelectorAll(
      `[data-staff="${selectedStaff}"][data-tick="${selectedTick}"]`,
    )
    for (const each of marked) each.classList.add('vf-selected')
    return () => {
      for (const each of marked) each.classList.remove('vf-selected')
    }
  }, [engraving, selectedStaff, selectedTick])

  const size =
    engraving.status === 'ready'
      ? { width: engraving.layout.width, height: engraving.layout.height }
      : { height: staffHeight(staff) * scale }
  return (
    <div className="relative" style={size}>
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
