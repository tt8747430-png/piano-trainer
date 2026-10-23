import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Performance } from '@/shared/lib/arrangement'
import { usePositionName } from '@/shared/ui'
import { pickAt, useSheetChoice, type Picked, type ScoreLayout } from '@/shared/ui/score'
import { chordPositions } from '../model/chord-positions'

/**
 * Each bar as a button over the staff, as the editor's are, through the one selection's gestures
 * (ADR 0082, 0088): a click or tap on a head chooses that note (one of a chord's), on a stem or a
 * chord's column the chord, and the cursor jumps there; on empty staff, nothing. Enter or Space goes
 * to the bar's first beat; Shift with a click, or a finger held and dragged, chooses bars (`onChoose`,
 * the piece's bar, extending what is chosen).
 */
export function BarTargets({
  layout,
  performance,
  positions,
  current,
  onJump,
  onPick,
  onChoose,
  firstBar = 0,
}: {
  /** The piece's bar the layout's first measure is: a line of a score laid out in lines. */
  firstBar?: number
  layout: ScoreLayout
  performance: Performance
  /** Each chord named with how the right hand plays it, as the labels over the staff say. */
  positions: boolean
  /** The bar the cursor is in. */
  current: number | undefined
  onJump: (beatGroup: number) => void
  /** A note or a chord clicked: the cursor goes to it, and it is what is chosen. */
  onPick: (picked: Picked) => void
  onChoose: (bar: number, extend: boolean) => void
}) {
  const { t } = useTranslation('music')
  const positionName = usePositionName()
  const choice = useSheetChoice({
    at: (bar, point, extend) => {
      if (extend) {
        onChoose(bar, true)
        return
      }
      if (!point) {
        const first = performance.beatGroups.findIndex((group) => group.bar === bar)
        if (first >= 0) onJump(first)
        return
      }
      const picked = pickAt(layout, point.x, point.y)
      if (picked) onPick(picked)
    },
    reach: (bar) => onChoose(bar, true),
  })
  // Named once per score: the cursor's move re-renders the bars, and only the current one changes.
  const names = useMemo(() => {
    const placed = positions ? chordPositions(performance) : []
    return layout.measures.map((_, index) => {
      const bar = firstBar + index
      const chords = (performance.bars[bar]?.chords ?? []).flatMap((index) => {
        const symbol = performance.chords[index]?.symbol
        if (!symbol) return []
        const position = placed[index]
        return position ? `${symbol} ${positionName(position)}` : symbol
      })
      return t('sheet.barChords', { n: bar + 1, chords: chords.join(' ') })
    })
  }, [layout, performance, positions, positionName, t, firstBar])
  return layout.measures.map((measure, index) => {
    const bar = firstBar + index
    return (
      <button
        key={bar}
        type="button"
        tabIndex={-1}
        aria-label={names[index]}
        aria-current={bar === current ? 'step' : undefined}
        {...choice(bar, { x: measure.x, y: 0 })}
        // A pointer's target only, as the editor's (the arrows move the cursor): no focus ring and no
        // hover wash round the bar, which would stand over empty staff (ADR 0082, 0088); the cursor and
        // the loop are the selection's marks.
        className="absolute inset-y-0 z-20 cursor-pointer outline-none"
        style={{ left: measure.x, width: measure.width }}
      />
    )
  })
}
