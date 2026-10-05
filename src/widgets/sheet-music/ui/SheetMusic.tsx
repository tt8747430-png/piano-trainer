import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { BarRange } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { useMediaQuery } from '@/shared/lib'
import { notate, type StaffId } from '@/shared/lib/notation'
import { ScoreView } from '@/shared/ui/score'
import { SheetOverlay } from './SheetOverlay'

/** A phone on its side (theme.css's `landscape-phone`): height is scarce, so the staff is engraved smaller (spec §2.8). */
const LANDSCAPE_PHONE = '(orientation: landscape) and (max-height: 500px)'
const SMALL = 0.7

/**
 * A Performance as sheet music on one scrolling line of grand staff (spec §2.6): chord symbols over
 * numbered bars, the cursor on the beat group now, the loop, bars to jump to.
 */
export function SheetMusic({
  performance,
  headings,
  current,
  loop,
  fingers,
  names,
  muted,
  onJump,
  onLoopChange,
}: {
  performance: Performance
  /** Each section's name, by section: shown at its first bar. */
  headings: readonly string[]
  /** The beat group the cursor is on. */
  current: number
  loop: BarRange | null
  fingers: boolean
  /** Each notehead carries its note's name. */
  names: boolean
  /** The staff of the hand not heard or practised. */
  muted: StaffId | undefined
  onJump: (beatGroup: number) => void
  onLoopChange: (loop: BarRange) => void
}) {
  const { t } = useTranslation('music')
  const score = useMemo(() => notate(performance), [performance])
  const scale = useMediaQuery(LANDSCAPE_PHONE) ? SMALL : 1
  const scroller = useRef<HTMLElement>(null)
  return (
    <section
      ref={scroller}
      aria-label={t('sheet.label')}
      className="relative -mx-gutter overflow-x-auto overscroll-x-contain px-gutter pt-11 scrollbar-none landscape-phone:mx-0 landscape-phone:px-0"
    >
      <ScoreView score={score} scale={scale} fingers={fingers} names={names} muted={muted}>
        {(layout) => (
          <SheetOverlay
            layout={layout}
            scroller={scroller}
            performance={performance}
            headings={headings}
            current={current}
            loop={loop}
            onJump={onJump}
            onLoopChange={onLoopChange}
          />
        )}
      </ScoreView>
    </section>
  )
}
