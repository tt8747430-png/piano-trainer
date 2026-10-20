import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Performance } from '@/shared/lib/arrangement'
import { usePositionName } from '@/shared/ui'
import { xAtTick, type ScoreLayout } from '@/shared/ui/score'
import { chordPositions } from '../model/chord-positions'
import { nearestBeatGroup } from '../model/nearest-beat-group'

/**
 * Each bar as a button over the staff: a tap jumps to the beat group nearest it, Enter or Space to
 * the bar's first.
 */
export function BarTargets({
  layout,
  performance,
  positions,
  current,
  onJump,
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
}) {
  const { t } = useTranslation('music')
  const positionName = usePositionName()
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
        onClick={(event) => {
          const box = event.currentTarget.getBoundingClientRect()
          const target =
            event.detail === 0
              ? performance.beatGroups.findIndex((group) => group.bar === bar)
              : nearestBeatGroup(
                  performance,
                  bar,
                  (tick) => xAtTick(layout, tick),
                  measure.x + event.clientX - box.left,
                )
          if (target !== null && target >= 0) onJump(target)
        }}
        className="absolute inset-y-0 z-20 cursor-pointer rounded-md ring-inset transition-shadow duration-200 ease-out hover:ring-1 hover:ring-input focus-visible:-outline-offset-3"
        style={{ left: measure.x, width: measure.width }}
      />
    )
  })
}
