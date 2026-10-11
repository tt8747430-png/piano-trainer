import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { BarRange } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { useElementSize } from '@/shared/lib'
import { notate, type StaffId } from '@/shared/lib/notation'
import { ScoreView, staffHeight } from '@/shared/ui/score'
import { fitScale } from '../model/fit-scale'
import { SheetOverlay } from './SheetOverlay'

/** The room fingers take under and over the staff (the labels' row is the section's padding). */
const FINGERS = 36

/**
 * A Performance as sheet music on one scrolling line of grand staff (spec §2.6): chord symbols over
 * numbered bars, the cursor on the beat group now, the loop, bars to jump to. It takes the height it
 * is given and engraves the staff to fill it (`fitScale`), so music read from a stand is as large as
 * the screen allows.
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
  const scroller = useRef<HTMLElement>(null)
  const { width, height } = useElementSize(scroller)
  const room = { width, height: height - (fingers ? FINGERS : 0) }
  const scale = fitScale(room, staffHeight(muted))
  return (
    <section
      ref={scroller}
      aria-label={t('sheet.label')}
      className="relative -mx-gutter h-full overflow-x-auto overscroll-x-contain px-gutter pt-11 scrollbar-none landscape-phone:mx-0 landscape-phone:px-0"
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
