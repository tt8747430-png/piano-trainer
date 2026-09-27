import { useTranslation } from 'react-i18next'
import type { Performance } from '@/shared/lib/arrangement'
import { xAtTick, type ScoreLayout } from '@/shared/ui/score'
import { nearestBeatGroup } from '../model/nearest-beat-group'

/**
 * Each bar as a button over the staff: a tap jumps to the beat group nearest it, Enter or Space to
 * the bar's first.
 */
export function BarTargets({
  layout,
  performance,
  current,
  onJump,
}: {
  layout: ScoreLayout
  performance: Performance
  /** The bar the cursor is in. */
  current: number | undefined
  onJump: (beatGroup: number) => void
}) {
  const { t } = useTranslation('music')
  return layout.measures.map((measure, bar) => {
    const chords = (performance.bars[bar]?.chords ?? []).flatMap(
      (index) => performance.chords[index]?.symbol ?? [],
    )
    return (
      <button
        key={bar}
        type="button"
        aria-label={t('sheet.barChords', { n: bar + 1, chords: chords.join(' ') })}
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
        className="absolute inset-y-0 z-20 cursor-pointer rounded-md ring-inset outline-none transition-shadow duration-200 ease-out hover:ring-1 hover:ring-input focus-visible:ring-3 focus-visible:ring-ring"
        style={{ left: measure.x, width: measure.width }}
      />
    )
  })
}
