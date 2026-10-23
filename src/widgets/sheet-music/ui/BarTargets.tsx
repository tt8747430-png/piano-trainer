import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Performance } from '@/shared/lib/arrangement'
import { usePositionName } from '@/shared/ui'
import { useHoldToChoose, type ScoreLayout } from '@/shared/ui/score'
import { chordPositions } from '../model/chord-positions'
import { beatGroupAt } from '../model/beat-group-at'

/**
 * Each bar as a button over the staff, as the editor's are (ADR 0082): a tap jumps to the beat group
 * of the note under it, Enter or Space to the bar's first; Shift with a click, or a finger held on a
 * bar and dragged, chooses bars (`onChoose`, the piece's bar, extending what is chosen).
 */
export function BarTargets({
  layout,
  performance,
  positions,
  current,
  onJump,
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
  onChoose: (bar: number, extend: boolean) => void
}) {
  const { t } = useTranslation('music')
  const positionName = usePositionName()
  const hold = useHoldToChoose(onChoose)
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
        aria-label={names[index]}
        aria-current={bar === current ? 'step' : undefined}
        {...hold(bar)}
        onClick={(event) => {
          if (event.shiftKey) {
            onChoose(bar, true)
            return
          }
          const box = event.currentTarget.getBoundingClientRect()
          const target =
            event.detail === 0
              ? performance.beatGroups.findIndex((group) => group.bar === bar)
              : beatGroupAt(
                  performance,
                  bar,
                  layout.onsets.filter(
                    (onset) =>
                      onset.tick >= measure.startTick &&
                      onset.tick < measure.startTick + measure.ticks,
                  ),
                  // The tap in the layout's px, however the sheet is zoomed on the screen.
                  measure.x + ((event.clientX - box.left) * measure.width) / box.width,
                )
          if (target !== null && target >= 0) onJump(target)
        }}
        // No hover wash round the bar, which a touch screen leaves standing over it (ADR 0082): the
        // cursor and the loop are the selection's marks.
        className="absolute inset-y-0 z-20 cursor-pointer rounded-md focus-visible:-outline-offset-3"
        style={{ left: measure.x, width: measure.width }}
      />
    )
  })
}
