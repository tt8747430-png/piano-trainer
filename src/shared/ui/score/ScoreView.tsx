import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Midi, Tick, TimeSignature } from '@/shared/lib/music'
import type { NextLine, Score, StaffId, StaffLabels } from '@/shared/lib/notation'
import { drawnStaves } from './drawn-staves'
import type { ScoreLayout } from './layout'
import { scoreHeight } from './size'
import { StaffPlace } from './StaffPlace'
import { drawScore } from './verovio/draw'
import { chosenParts } from './verovio/svg-chosen'
import './score.css'

type Engraving =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly layout: ScoreLayout }
  | { readonly status: 'error' }

/**
 * A score engraved by Verovio (ADR 0087) on one line of its staves (the grand staff, the
 * tune's over it), or on some or one of them. What lies over it (labels, the playhead, the loop) is
 * its children, given the engraving's layout. The staff of `muted` is soft ink.
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
  labels,
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
  /** The staves' names, printed at the line's head: a score's first line (ADR 0114). */
  labels?: StaffLabels | undefined
  /** The sheet's width in CSS pixels: the line is spread to it, and drawn smaller where wider. */
  fill?: number | undefined
  /**
   * The notes chosen, those starting in [from, to) on a staff (on every staff without one), one key
   * alone where `midi` says, drawn in the selection colour as a notation app draws a selection (ADR
   * 0096): their heads, stems, flags, accidentals, dots and ledger lines, and the rests chosen.
   */
  selected?:
    | {
        readonly staff?: StaffId
        readonly from: Tick
        readonly to: Tick
        readonly midi?: Midi | undefined
      }
    | undefined
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
  // As one string, so a new object of the same names engraves nothing again.
  const labelsKey = labels ? JSON.stringify(labels) : ''
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
        labels: labelsKey ? (JSON.parse(labelsKey) as StaffLabels) : undefined,
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
  }, [score, scale, fingers, names, shownKey, beforeCount, beforeUnit, nextKey, labelsKey, fill])

  // The chosen notes are marked on the engraving as it is, so moving the caret engraves nothing again.
  const selectedStaff = selected?.staff
  const selectedFrom = selected?.from
  const selectedTo = selected?.to
  const selectedKey = selected?.midi
  useEffect(() => {
    const element = host.current
    if (
      !element ||
      engraving.status !== 'ready' ||
      selectedFrom === undefined ||
      selectedTo === undefined
    )
      return
    // One key of a chord: its heads' ids, as the layout read them with their keys.
    const keys =
      selectedKey === undefined
        ? null
        : new Set(
            (engraving.layout.heads ?? [])
              .filter((head) => head.midi === selectedKey)
              .map((head) => head.id),
          )
    const marked = chosenParts(
      element,
      {
        staves: selectedStaff === undefined ? undefined : [selectedStaff],
        from: selectedFrom,
        to: selectedTo,
      },
      keys,
    )
    for (const each of marked) each.classList.add('note-chosen')
    return () => {
      for (const each of marked) each.classList.remove('note-chosen')
    }
  }, [engraving, selectedStaff, selectedFrom, selectedTo, selectedKey])

  const size =
    engraving.status === 'ready'
      ? { width: engraving.layout.width, height: engraving.layout.height }
      : { height: scoreHeight(score, drawn) * scale, width: fill }
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
          <StaffPlace height={scoreHeight(score, drawn)} scale={scale} count={drawn.length} />
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
